"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { formatOrderStatus } from "@/lib/api-mappers";
import { getMyOrders } from "@/services/order-service";
import { useSocket } from "@/providers/socket-provider";

const statusSteps = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"] as const;

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const { socket } = useSocket();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchOrder = () => {
      getMyOrders()
        .then((orders) => {
          if (!active) return;
          const found = orders.find((entry) => entry.id === params.id);
          setOrder(found || null);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // Poll every 10 seconds

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [params.id]);

  useEffect(() => {
    if (socket) {
      const liveUpdate = () => {
        getMyOrders().then((orders) => {
          const found = orders.find((entry) => entry.id === params.id);
          if (found) setOrder(found);
        });
      };
      socket.on("new_notification", liveUpdate);
      return () => { socket.off("new_notification", liveUpdate); };
    }
  }, [socket, params.id]);

  if (!loading && !order) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h1 className="font-display text-4xl text-brand-900">Order not found</h1>
          <p className="mt-4 text-sm leading-7 text-stone-600">We could not find the requested order tracking details.</p>
          <Link href="/dashboard" className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">
            Back to Profile
          </Link>
        </div>
      </main>
    );
  }

  if (loading || !order) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 text-sm text-stone-600 shadow-soft">Loading order tracking...</div>
      </main>
    );
  }

  const orderStatus = formatOrderStatus(order.status);
  const activeIndex = Math.max(statusSteps.indexOf(orderStatus as (typeof statusSteps)[number]), 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Order Tracking</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Track Order #{order.orderNumber}</h1>
        <p className="mt-3 text-sm leading-7 text-stone-600">Your order status updates here as soon as the owner changes it in the dashboard.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <TrackStat label="Date" value={new Date(order.createdAt).toLocaleString("en-GB")} />
          <TrackStat label="Amount" value={formatCurrency(order.totalPrice)} />
          <TrackStat label="Current Status" value={orderStatus} />
          <TrackStat label="Payment Method" value={order.paymentMethod} />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {statusSteps.map((step, index) => {
            const active = index <= activeIndex;
            return (
              <div key={step} className={active ? "rounded-2xl bg-brand-500 px-4 py-4 text-center text-white" : "rounded-2xl bg-stone-100 px-4 py-4 text-center text-stone-500"}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold">{step}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
          <div className="rounded-3xl bg-orange-50 p-6">
            <h2 className="text-2xl font-semibold text-stone-900">Order Items</h2>
            <div className="mt-4 space-y-2 text-sm text-stone-700">
              {order.items.map((item: any) => (
                <div key={item.id} className="rounded-2xl bg-white px-4 py-3">
                  {item.menuItem.name} x {item.quantity}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 p-6">
            <h2 className="text-2xl font-semibold text-stone-900">Delivery Summary</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
              <p>Restaurant: {order.restaurant?.name || "Jay Malhar"}</p>
              <p>Address: {order.deliveryAddress.line1}, {order.deliveryAddress.city}</p>
              <p>Phone: {order.deliveryAddress.phone}</p>
              <p>Payment Status: {order.paymentStatus}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/dashboard" className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">
            Back to Profile
          </Link>
          <Link href="/restaurants" className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-800">
            Order Again
          </Link>
        </div>
      </div>
    </main>
  );
}

function TrackStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-3 text-lg font-semibold text-stone-900">{value}</p>
    </div>
  );
}

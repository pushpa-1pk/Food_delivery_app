"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { formatOrderStatus, toOrderStatusValue } from "@/lib/api-mappers";
import { getSellerOrders, updateOrderStatus, type ApiOrderStatus } from "@/services/order-service";

const statuses = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered", "Cancelled"] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function loadOrders() {
    getSellerOrders().then((data) => setOrders(data));
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // Poll every 10 seconds for real-time updates
    return () => clearInterval(interval);
  }, []);

  const query = search.trim().toLowerCase();
  const filteredOrders = orders.filter((order) =>
    query.length === 0 ||
    String(order.orderNumber).toLowerCase().includes(query) ||
    order.id.toLowerCase().includes(query) ||
    (order.user?.name || "").toLowerCase().includes(query) ||
    formatOrderStatus(order.status).toLowerCase().includes(query)
  );

  async function handleStatusChange(orderId: string, status: string) {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, toOrderStatusValue(status) as ApiOrderStatus);
      loadOrders();
    } finally {
      setUpdatingId(null);
    }
  }

  function printInvoice(orderId: string, orderNumber: number) {
    window.alert(`Invoice prepared for #${orderNumber}`);
  }

  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Orders</p>
          <h1 className="mt-2 font-display text-4xl text-brand-900">Manage all orders</h1>
        </div>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search order, customer, or status"
          className="w-full max-w-sm rounded-2xl border border-stone-200 px-4 py-3"
        />
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-stone-500">
            <tr>
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Items</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t border-stone-100 align-top">
                <td className="py-4 font-semibold text-stone-900">#{order.orderNumber}</td>
                <td className="py-4 text-stone-700">
                  <p>{order.user?.name || "Customer"}</p>
                  <p className="text-xs text-stone-500">{order.user?.email || "-"}</p>
                </td>
                <td className="py-4 text-stone-700">{order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</td>
                <td className="py-4 text-stone-700">{formatCurrency(order.totalPrice)}</td>
                <td className="py-4">
                  <select
                    value={formatOrderStatus(order.status)}
                    onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    disabled={updatingId === order.id}
                    className="rounded-xl border border-stone-200 px-3 py-2"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleStatusChange(order.id, "Accepted")} className="rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                      Accept
                    </button>
                    <button type="button" onClick={() => handleStatusChange(order.id, "Cancelled")} className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                      Reject
                    </button>
                    <button type="button" onClick={() => printInvoice(order.id, order.orderNumber)} className="rounded-full bg-stone-900 px-3 py-2 text-xs font-semibold text-white">
                      Print Invoice
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

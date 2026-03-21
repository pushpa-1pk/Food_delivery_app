"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { StatsCard } from "@/components/admin/stats-card";
import { formatCurrency } from "@/lib/utils";
import { formatOrderStatus } from "@/lib/api-mappers";
import { getOwnerDashboard } from "@/services/owner-service";
import { getMyNotifications, markNotificationRead, type AppNotification } from "@/services/notification-service";
import { useSocket } from "@/providers/socket-provider";

export default function AdminDashboardPage() {
  const { socket } = useSocket();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const prevLatestNotifId = useRef<string | null>(null);

  useEffect(() => {
    let unmounted = false;

    const fetchDashboard = () => {
      getOwnerDashboard()
        .then((data) => {
          if (!unmounted) setDashboard(data);
        })
        .finally(() => {
          if (!unmounted) setLoading(false);
        });

      getMyNotifications().then((notifsData) => {
        if (!unmounted) {
          if (notifsData.length > 0) {
            setNotifications(notifsData);
            const latestId = notifsData[0].id;
            if (prevLatestNotifId.current && prevLatestNotifId.current !== latestId) {
              const newIndex = notifsData.findIndex(n => n.id === prevLatestNotifId.current);
              const newNotifs = newIndex === -1 ? [notifsData[0]] : notifsData.slice(0, newIndex);
              newNotifs.forEach(n => toast(n.message, { icon: "🔔" }));
            }
            prevLatestNotifId.current = latestId;
          } else {
            setNotifications([]);
          }
        }
      }).catch(() => undefined);
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000); // Poll every 10 seconds

    return () => {
      unmounted = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewNotif = (notification: AppNotification) => {
        setNotifications((prev) => [notification, ...prev].slice(0, 100));
      };
      socket.on("new_notification", handleNewNotif);
      return () => { socket.off("new_notification", handleNewNotif); };
    }
  }, [socket]);

  async function markRead(id: string) {
    await markNotificationRead(id).catch(() => undefined);
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  }

  if (loading || !dashboard) {
    return <section className="rounded-[2rem] bg-white p-8 text-sm text-stone-600 shadow-soft">Loading dashboard...</section>;
  }

  const popularItem = dashboard.topItems[0]?.name || "-";

  return (
    <section className="space-y-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Owner Notifications</p>
            <h2 className="mt-2 font-display text-3xl text-brand-900">Live order timeline</h2>
          </div>
          <p className="text-sm text-stone-500">{notifications.filter((item) => !item.isRead).length} unread</p>
        </div>
        <div className="mt-5 grid gap-3">
          {notifications.length === 0 ? <div className="rounded-2xl bg-orange-50 px-4 py-4 text-sm text-stone-600">No notifications yet.</div> : notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className={notification.isRead ? "rounded-2xl border border-stone-200 px-4 py-4 text-sm text-stone-600" : "rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4 text-sm text-stone-700"}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-stone-900">{notification.title}</p>
                  <p className="mt-1 leading-6">{notification.message}</p>
                  <p className="mt-2 text-xs text-stone-500">{new Date(notification.createdAt).toLocaleString("en-GB")}</p>
                </div>
                {!notification.isRead ? <button type="button" onClick={() => markRead(notification.id)} className="rounded-full bg-stone-900 px-3 py-2 text-xs font-semibold text-white">Mark read</button> : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Dashboard</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Restaurant overview</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          View quick performance stats, recent orders, and business activity from one control center.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Orders" value={String(dashboard.totalOrders)} subtitle="Total orders received" />
        <StatsCard title="Revenue" value={formatCurrency(dashboard.totalRevenue)} subtitle="Total collected revenue" />
        <StatsCard title="Menu Items" value={String(dashboard.menuItems)} subtitle="Active and inactive dishes" />
        <StatsCard title="Customers" value={String(dashboard.customers)} subtitle="Customer accounts tracked" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-stone-900">Latest Orders</h2>
            <Link href="/admin/dashboard/orders" className="text-sm font-semibold text-brand-700">Manage all</Link>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-stone-500">
                <tr>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-t border-stone-100">
                    <td className="py-4 font-semibold text-stone-900">#{order.orderNumber}</td>
                    <td className="py-4 text-stone-700">{order.user?.name || "Customer"}</td>
                    <td className="py-4 text-stone-700">{formatCurrency(order.totalPrice)}</td>
                    <td className="py-4 text-stone-700">{formatOrderStatus(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-stone-900">Top Snapshot</h2>
            <div className="mt-5 grid gap-4">
              <MiniStat label="Pending Orders" value={String(dashboard.pendingOrders)} />
              <MiniStat label="Popular Item" value={popularItem} />
              <MiniStat label="Delivered Orders" value={String(dashboard.deliveredOrders)} />
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-stone-900">Top Selling Items</h2>
              <Link href="/admin/dashboard/analytics" className="text-sm font-semibold text-brand-700">Open analytics</Link>
            </div>
            <div className="mt-6 grid gap-3">
              {dashboard.topItems.map((item: any) => (
                <div key={item.name} className="rounded-2xl bg-orange-50 px-4 py-4 text-sm text-stone-700">
                  {item.name} - {item.quantity} orders
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-orange-50 px-4 py-4">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}

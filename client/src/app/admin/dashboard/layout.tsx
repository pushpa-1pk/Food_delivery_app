"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getMyNotifications, markNotificationRead, type AppNotification } from "@/services/notification-service";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const prevLatestNotifId = useRef<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifsData = await getMyNotifications();
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
      } catch (err) {}
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  async function markRead(id: string) {
    await markNotificationRead(id).catch(() => undefined);
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <AdminGuard>
        <div className="mb-4 flex items-center lg:hidden">
          <button type="button" onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 rounded-2xl bg-[#16242a] px-5 py-3 text-sm font-semibold text-white shadow-soft">
            <svg className="h-5 w-5 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            Admin Menu
          </button>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[280px,1fr]">
          <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="space-y-6">
            <div>{children}</div>
          </div>
        </div>
      </AdminGuard>
    </main>
  );
}

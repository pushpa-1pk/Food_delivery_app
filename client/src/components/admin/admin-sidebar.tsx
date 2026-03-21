"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useAdminStore } from "@/store/admin-store";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "DB" },
  { href: "/admin/dashboard/orders", label: "Orders", icon: "OR" },
  { href: "/admin/dashboard/menu", label: "Menu Management", icon: "MN" },
  { href: "/admin/dashboard/add-food", label: "Add Food", icon: "AD" },
  { href: "/admin/dashboard/customers", label: "Customers", icon: "CU" },
  { href: "/admin/dashboard/analytics", label: "Analytics", icon: "AN" },
  { href: "/admin/dashboard/settings", label: "Settings", icon: "ST" }
];

export function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const notifications = useAdminStore((state) => state.notifications);

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] transform overflow-y-auto bg-[#16242a] p-6 text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-24 lg:z-auto lg:w-full lg:translate-x-0 lg:rounded-[2rem] lg:shadow-soft ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5 lg:hidden">
          <span className="font-display text-xl text-orange-200">Admin Menu</span>
          <button type="button" onClick={onClose} className="rounded-full bg-white/10 p-2"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div className="hidden border-b border-white/10 pb-5 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-200">Owner Panel</p>
          <h2 className="mt-3 font-display text-3xl">Jay Malhar</h2>
        </div>

        <nav className="mt-6 grid gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
              className={active ? "flex items-center gap-3 rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white" : "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10"}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl bg-white/10 p-4 text-sm text-orange-50">
        <p className="font-semibold">Live Notifications</p>
        <p className="mt-2 leading-6">{notifications[0] || "No new notifications"}</p>
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-6 flex w-full items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
      >
        Logout
      </button>
      </aside>
    </>
  );
}

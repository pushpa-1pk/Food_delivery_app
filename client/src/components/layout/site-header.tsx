"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { logoutUser } from "@/services/auth-service";
import { useSocket } from "@/providers/socket-provider";
import { formatDistanceToNow } from "date-fns";
import { getMyNotifications, markNotificationRead, type AppNotification } from "@/services/notification-service";
import { toast } from "react-hot-toast";

export function SiteHeader() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (isAuthenticated) {
      getMyNotifications().then(setNotifications).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (socket) {
      const handleNewNotif = (notification: AppNotification) => {
        setNotifications((prev) => [notification, ...prev].slice(0, 100));
        toast(notification.message, { icon: "🔔" });
      };
      socket.on("new_notification", handleNewNotif);
      return () => { socket.off("new_notification", handleNewNotif); };
    }
  }, [socket]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
      const target = event.target as Element;
      if (!target.closest(".notif-container")) {
        setIsNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // Keep the UI responsive even if the API is unavailable.
    }

    logout();
    setIsOpen(false);
  }

  const initials = user?.name?.slice(0, 1).toUpperCase() || "U";
  const isOwner = user?.role === "ADMIN" || user?.role === "SELLER";
  const unreadCount = notifications.filter(n => !n.isRead).length;

  async function handleMarkRead(id: string) {
    await markNotificationRead(id).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  return (
    <header className="sticky top-0 z-20 border-b border-orange-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-brand-500 bg-orange-50">
            <img
              src="/logo.jpeg"
              alt="Malhar Online Food Delivery"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-display text-2xl font-bold leading-none text-brand-900">Jay Malhar</p>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
              Online Food Delivery
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-stone-700">
            <Link href="/">Home</Link>
            <Link href="/restaurants">Menu</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/cart" className="rounded-full bg-brand-500 px-4 py-2 text-white">
              Cart ({itemCount})
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-brand-700 shadow-sm md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {isAuthenticated && (
            <div className="notif-container relative z-30">
              <button
                type="button"
                onClick={() => setIsNotifOpen((v) => !v)}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-brand-700 shadow-sm transition-colors hover:bg-orange-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[80vh] overflow-y-auto rounded-3xl border border-orange-100 bg-white p-2 shadow-xl">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100 mb-2">
                    <span className="font-semibold text-stone-900">Notifications</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {notifications.length === 0 ? (
                      <p className="px-3 py-4 text-center text-sm text-stone-500">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 15).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => { if (!n.isRead) handleMarkRead(n.id); setIsNotifOpen(false); }}
                          className={`cursor-pointer rounded-2xl p-3 transition-colors hover:bg-stone-50 ${!n.isRead ? "bg-orange-50/50 border border-orange-100/50" : "bg-white"}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className={`text-sm ${!n.isRead ? "font-semibold text-stone-900" : "font-medium text-stone-700"}`}>
                                {n.title}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-stone-600 line-clamp-2">{n.message}</p>
                              <p className="mt-2 text-[10px] font-medium text-stone-400">
                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                            {!n.isRead && <div className="mt-1 h-2 w-2 rounded-full bg-brand-500 flex-shrink-0"></div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative z-30" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-brand-700 shadow-sm transition-colors hover:bg-orange-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </button>

            {isOpen ? (
              <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-orange-100 bg-white p-3 shadow-soft z-30">
                {isAuthenticated && user ? (
                  <>
                    <div className="rounded-2xl bg-orange-50 px-4 py-3">
                      <p className="text-sm font-semibold text-brand-900">{user.name}</p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm">
                      <Link href="/dashboard" onClick={() => setIsOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-stone-50">
                        My Profile
                      </Link>
                      {isOwner ? (
                        <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-stone-50">
                          Admin Dashboard
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-2xl px-4 py-3 text-left text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="grid gap-2 text-sm">
                    <Link href="/signin" onClick={() => setIsOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-stone-50">
                      Sign in
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)} className="rounded-2xl bg-brand-500 px-4 py-3 text-white">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-orange-100 bg-white px-4 py-4 sm:px-6 shadow-sm">
          <nav className="flex flex-col gap-2 text-sm font-medium text-stone-700">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-stone-50">Home</Link>
            <Link href="/restaurants" onClick={() => setIsMobileMenuOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-stone-50">Menu</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-stone-50">About Us</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-stone-50">Contact Us</Link>
            <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="rounded-2xl bg-brand-500 px-4 py-3 text-white text-center">
              Cart ({itemCount})
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

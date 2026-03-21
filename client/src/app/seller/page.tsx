"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export default function SellerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SELLER";

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Private admin area</p>
          <h1 className="mt-2 font-display text-4xl text-brand-900">This page has moved</h1>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            The Jay Malhar owner now uses the dedicated admin system. Customers cannot access this area.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">
              Back to website
            </Link>
            <Link href="/admin" className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-800">
              Admin login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Redirected admin area</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Use the new admin dashboard</h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          Owner access has been moved to the dedicated admin panel for better separation between customer and owner flows.
        </p>
        <Link href="/admin/dashboard" className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">
          Open admin dashboard
        </Link>
      </div>
    </main>
  );
}

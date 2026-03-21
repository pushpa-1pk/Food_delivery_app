"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AdminGuard({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SELLER";

  if (!isAdmin) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Private admin area</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Admin access required</h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          This area is available only for the Jay Malhar owner.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/signin" className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">
            Sign in
          </Link>
          <Link href="/" className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-800">
            Back to website
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

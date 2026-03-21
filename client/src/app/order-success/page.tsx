"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "--";
  const orderNumber = searchParams.get("orderNumber") || orderId;

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Order Success</p>
        <h1 className="mt-3 font-display text-5xl text-brand-900">Your order has been placed</h1>
        <p className="mt-5 text-base leading-8 text-stone-700">
          Thank you for ordering from Jay Malhar. Your order ID is <span className="font-semibold">#{orderNumber}</span>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={`/orders/${orderId}`} className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">
            Track Order
          </Link>
          <Link href="/restaurants" className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-800">
            Continue Ordering
          </Link>
        </div>
      </div>
    </main>
  );
}

function OrderSuccessFallback() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Order Success</p>
        <h1 className="mt-3 font-display text-5xl text-brand-900">Preparing your order summary</h1>
        <p className="mt-5 text-base leading-8 text-stone-700">We are loading the latest order details for you.</p>
      </div>
    </main>
  );
}

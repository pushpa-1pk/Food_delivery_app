"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Cart</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Review your order</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 shadow-soft">
              <p className="text-stone-600">Your cart is empty.</p>
              <Link href="/restaurants" className="mt-4 inline-block rounded-full bg-brand-500 px-5 py-3 text-white">
                Browse menu
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-3xl bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900">{item.name}</h2>
                    <p className="text-sm text-stone-500">{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-full bg-stone-900 px-3 py-2 text-white">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 rounded-full bg-white/10 text-lg">
                      -
                    </button>
                    <span className="min-w-4 text-center text-sm font-semibold">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 rounded-full bg-white/10 text-lg">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <aside className="h-fit rounded-[2rem] bg-ink p-6 text-white shadow-soft">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <Row label="Subtotal" value={formatCurrency(subtotal)} />
            <Row label="Delivery fee" value={formatCurrency(deliveryFee)} />
            <Row label="Total" value={formatCurrency(total)} strong />
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-brand-500 px-5 py-3 text-center font-semibold text-white"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "border-t border-white/20 pt-3 text-base font-semibold" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

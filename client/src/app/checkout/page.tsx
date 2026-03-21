"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createOrder, validateCoupon } from "@/services/order-service";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useProfileStore } from "@/store/profile-store";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 40 : 0;
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [couponCode, setCouponCode] = useState("");
  const [couponState, setCouponState] = useState<any>(null);
  
  const profilePhone = useProfileStore((state) => state.phone);
  const addresses = useProfileStore((state) => state.addresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "manual">("manual");
  const [form, setForm] = useState({
    fullName: authUser?.name || "",
    phone: profilePhone || "9999999999",
    line1: "123 Main Road",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
    notes: ""
  });

  const total = useMemo(() => {
    const discountedSubtotal = couponState?.totalAfterDiscount ?? subtotal;
    return discountedSubtotal + deliveryFee;
  }, [couponState, subtotal, deliveryFee]);

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (result) => {
      clearCart();
      router.push(`/order-success?orderId=${result.data.id}&orderNumber=${result.data.orderNumber}`);
    }
  });

  async function applyCoupon() {
    if (!couponCode.trim()) {
      setCouponState(null);
      return;
    }

    try {
      const coupon = await validateCoupon(couponCode, subtotal);
      setCouponState(coupon);
    } catch {
      setCouponState({ invalid: true });
    }
  }

  function handleSelectAddress(id: string | "manual") {
    setSelectedAddressId(id);
    if (id !== "manual") {
      const addr = addresses.find(a => a.id === id);
      if (addr) {
        const parts = addr.address.split(",").map(p => p.trim());
        
        setForm(prev => {
          let c = prev.city || "Nashik";
          let s = prev.state || "Maharashtra";
          let l1 = addr.address;
          
          if (parts.length >= 3) {
            s = parts[parts.length - 1];
            c = parts[parts.length - 2];
            l1 = parts.slice(0, parts.length - 2).join(", ");
          }

          return {
            ...prev,
            fullName: prev.fullName || authUser?.name || "",
            phone: prev.phone || "9999999999",
            line1: l1,
            city: c,
            state: s,
          };
        });
      }
    } else {
      setForm(prev => ({ ...prev, line1: "", city: "", state: "", postalCode: "" }));
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Checkout</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Place your order</h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">Review your order, apply coupon codes, and confirm delivery details to complete checkout.</p>

        <div className="mt-8 rounded-3xl bg-orange-50 p-6">
          <h2 className="text-xl font-semibold text-stone-900">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-stone-700">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-orange-100 pt-3">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {couponState?.discountAmount ? (
              <div className="flex items-center justify-between text-green-700">
                <span>Coupon {couponState.code}</span>
                <span>-{formatCurrency(couponState.discountAmount)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <span>Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-stone-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} className="flex-1 rounded-2xl border border-stone-200 px-4 py-3" placeholder="Coupon code" />
          <button type="button" onClick={applyCoupon} className="rounded-full border border-stone-300 px-5 py-3 font-semibold text-stone-800">Apply</button>
        </div>
        {couponState?.invalid ? <p className="mt-2 text-sm text-red-600">Coupon code is not valid.</p> : null}

        <form
          className="mt-8 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({
              restaurantId: "jay-malhar-main",
              paymentMethod,
              couponCode: couponState?.code,
              items: items.map((item) => ({ menuItemId: item.id, quantity: item.quantity })),
              deliveryAddress: {
                fullName: form.fullName,
                phone: form.phone,
                line1: form.line1,
                city: form.city,
                state: form.state,
                postalCode: form.postalCode
              },
              notes: form.notes
            });
          }}
        >
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Delivery Address</h2>
            {addresses.length > 0 && (
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {addresses.map(addr => (
                  <label key={addr.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${selectedAddressId === addr.id ? "border-brand-500 bg-orange-50" : "border-stone-200"}`}>
                    <input type="radio" className="mt-1" checked={selectedAddressId === addr.id} onChange={() => handleSelectAddress(addr.id)} />
                    <div>
                      <span className="block font-semibold text-stone-900">{addr.type}</span>
                      <span className="mt-1 block text-sm text-stone-600">{addr.address}</span>
                    </div>
                  </label>
                ))}
                <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${selectedAddressId === "manual" ? "border-brand-500 bg-orange-50" : "border-stone-200"}`}>
                  <input type="radio" checked={selectedAddressId === "manual"} onChange={() => handleSelectAddress("manual")} />
                  <span className="font-semibold text-stone-900">Enter new address</span>
                </label>
              </div>
            )}
          </div>
          
          <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Full name" required />
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Phone number" required />
          <textarea value={form.line1} onChange={(event) => setForm({ ...form, line1: event.target.value })} className="min-h-24 rounded-2xl border border-stone-200 px-4 py-3" placeholder="Delivery address" required />
          <div className="grid gap-4 md:grid-cols-3">
            <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="City" required />
            <input value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="State" required />
            <input value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Postal code" required />
          </div>
          <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="min-h-24 rounded-2xl border border-stone-200 px-4 py-3" placeholder="Order notes (optional)" />
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3">
              <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3">
              <input type="radio" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} />
              Razorpay Online Payment
            </label>
          </div>
          {paymentMethod === "ONLINE" ? <p className="text-sm text-stone-600">Razorpay-ready flow is enabled on the backend. Add live keys in env for production checkout.</p> : null}
          {mutation.isError ? <p className="text-sm text-red-600">Unable to place order right now. Please check your sign in and try again.</p> : null}
          <button type="submit" disabled={mutation.isPending || items.length === 0} className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white disabled:opacity-60">
            {mutation.isPending ? "Processing..." : "Confirm order"}
          </button>
        </form>
        {mutation.isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
            <p className="mt-4 text-lg font-semibold text-stone-900">Processing order...</p>
            <p className="mt-2 text-sm text-stone-600">Please do not close this window.</p>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { getOwnerRestaurantDetails, updateOwnerRestaurantDetails } from "@/services/owner-service";

export default function SettingsPage() {
  const [form, setForm] = useState({
    restaurantName: "Jay Malhar",
    description: "",
    address: "",
    city: "",
    deliveryTime: "30 to 40 minutes",
    deliveryCharges: "40",
    openingHours: "10:00 AM to 11:00 PM",
    paymentOptions: "Cash on Delivery, UPI, Cards",
    liveNotifications: true,
    orderSoundAlert: true,
    deliveryRadius: "8",
    isOpen: true
  });

  useEffect(() => {
    getOwnerRestaurantDetails().then((restaurant) => {
      setForm((current) => ({
        ...current,
        restaurantName: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        city: restaurant.city,
        deliveryCharges: String(restaurant.deliveryFee),
        openingHours: restaurant.openingHours,
        deliveryRadius: String(restaurant.deliveryRadius),
        isOpen: restaurant.isOpen
      }));
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateOwnerRestaurantDetails({
      name: form.restaurantName,
      description: form.description,
      address: form.address,
      city: form.city,
      openingHours: form.openingHours,
      deliveryFee: Number(form.deliveryCharges),
      deliveryRadius: Number(form.deliveryRadius),
      isOpen: form.isOpen
    });
    window.alert("Settings saved successfully");
  }

  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Settings</p>
      <h1 className="mt-2 font-display text-4xl text-brand-900">Restaurant settings</h1>

      <form className="mt-8 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
        <input className="rounded-2xl border border-stone-200 px-4 py-3" value={form.restaurantName} onChange={(event) => setForm({ ...form, restaurantName: event.target.value })} placeholder="Restaurant Name" />
        <input className="rounded-2xl border border-stone-200 px-4 py-3" value={form.deliveryTime} onChange={(event) => setForm({ ...form, deliveryTime: event.target.value })} placeholder="Delivery Time" />
        <input className="rounded-2xl border border-stone-200 px-4 py-3" value={form.deliveryCharges} onChange={(event) => setForm({ ...form, deliveryCharges: event.target.value })} placeholder="Delivery Charges" />
        <input className="rounded-2xl border border-stone-200 px-4 py-3" value={form.openingHours} onChange={(event) => setForm({ ...form, openingHours: event.target.value })} placeholder="Opening Hours" />
        <input className="rounded-2xl border border-stone-200 px-4 py-3 lg:col-span-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Restaurant Description" />
        <input className="rounded-2xl border border-stone-200 px-4 py-3" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Address" />
        <input className="rounded-2xl border border-stone-200 px-4 py-3" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="City" />
        <input className="rounded-2xl border border-stone-200 px-4 py-3" value={form.deliveryRadius} onChange={(event) => setForm({ ...form, deliveryRadius: event.target.value })} placeholder="Delivery Radius" />
        <input className="rounded-2xl border border-stone-200 px-4 py-3" value={form.paymentOptions} onChange={(event) => setForm({ ...form, paymentOptions: event.target.value })} placeholder="Payment Options" />
        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3">
          <input type="checkbox" checked={form.liveNotifications} onChange={(event) => setForm({ ...form, liveNotifications: event.target.checked })} />
          Live order notifications
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3">
          <input type="checkbox" checked={form.orderSoundAlert} onChange={(event) => setForm({ ...form, orderSoundAlert: event.target.checked })} />
          Order sound alert
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 lg:col-span-2">
          <input type="checkbox" checked={form.isOpen} onChange={(event) => setForm({ ...form, isOpen: event.target.checked })} />
          Restaurant open for orders
        </label>
        <button type="submit" className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white lg:col-span-2">
          Save Settings
        </button>
      </form>
    </section>
  );
}

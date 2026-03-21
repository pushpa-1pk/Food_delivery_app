"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { getRestaurant } from "@/services/restaurant-service";
import { mapRestaurantMenuItems } from "@/lib/api-mappers";
import { menuCategories } from "@/data/menu-data";
import { useCartStore } from "@/store/cart-store";

const sortOptions = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" }
] as const;

import { MenuItemCard } from "@/components/cards/menu-item-card";

export default function RestaurantsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof menuCategories)[number]["value"]>("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>("popularity");
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  useEffect(() => {
    let active = true;

    getRestaurant("jay-malhar-main")
      .then((data) => {
        if (!active) return;
        setRestaurant(data);
      })
      .catch((err: any) => {
        if (!active) return;
        setError(err?.response?.data?.message || "Unable to load menu right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const foods = useMemo(() => mapRestaurantMenuItems(restaurant), [restaurant]);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredItems = foods
    .filter((item) => item.isAvailable)
    .filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch);
      const matchesCategory = category === "All" || item.category === category;
      const matchesVeg = !vegOnly || item.isVeg;
      return matchesSearch && matchesCategory && matchesVeg;
    })
    .sort((left, right) => {
      if (sortBy === "price-asc") return left.price - right.price;
      if (sortBy === "price-desc") return right.price - left.price;
      if (right.rating !== left.rating) return right.rating - left.rating;
      return Number(Boolean(right.isBestSeller)) - Number(Boolean(left.isBestSeller));
    });

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">{restaurant?.name || "Jay Malhar"} Menu</p>
            <h1 className="mt-2 font-display text-4xl text-brand-900">Authentic Maharashtrian Taste</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
              Browse our direct-order menu, search food quickly, and add your favorites to cart without leaving the page.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Badge label="Delivery Time" value="30 to 40 minutes" />
            <Badge label="Rating" value={String(restaurant?.rating || 4.5)} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr,220px,180px]">
          <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search food..." className="rounded-2xl border border-stone-200 px-4 py-3" />
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as (typeof sortOptions)[number]["value"])} className="rounded-2xl border border-stone-200 px-4 py-3">
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <label className="flex items-center justify-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-700">
            <input type="checkbox" checked={vegOnly} onChange={(event) => setVegOnly(event.target.checked)} />
            Veg only
          </label>
        </div>
      </section>

      <section className="mt-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {menuCategories.map((entry) => {
            const active = category === entry.value;
            return (
              <button
                key={entry.value}
                type="button"
                onClick={() => setCategory(entry.value)}
                className={`group block text-center transition-all hover:-translate-y-1 ${
                  active ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div
                  className={`mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-4 shadow-soft transition-colors duration-300 sm:h-28 sm:w-28 ${
                    active ? "border-brand-500 ring-2 ring-brand-500/20" : "border-orange-50"
                  }`}
                >
                  <img
                    src={typeof entry.image === "string" ? entry.image : entry.image?.src}
                    alt={entry.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p
                  className={`text-sm font-semibold transition-colors sm:text-base ${
                    active ? "text-brand-600" : "text-stone-700 group-hover:text-stone-900"
                  }`}
                >
                  {entry.label}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl text-brand-900">Food Items</h2>
            <p className="mt-2 text-sm text-stone-600">Menu, pricing, and availability are loaded from the restaurant database.</p>
          </div>
          <p className="text-sm font-medium text-stone-500">{filteredItems.length} dishes found</p>
        </div>

        {loading ? <div className="rounded-[2rem] bg-white p-8 text-sm text-stone-600 shadow-soft">Loading menu...</div> : null}
        {error ? <div className="rounded-[2rem] bg-red-50 p-8 text-sm text-red-700 shadow-soft">{error}</div> : null}

        {!loading && !error ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={{
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                isAvailable: item.isAvailable,
                image: typeof item.image === "string" ? item.image : undefined
              }} />
            ))}
          </div>
        ) : null}
      </section>

      {cartCount > 0 ? <Link href="/cart" className="fixed bottom-6 right-6 z-30 rounded-full bg-brand-500 px-6 py-4 text-sm font-semibold text-white shadow-2xl">View Cart ({cartCount} items)</Link> : null}
    </main>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm"><p className="text-stone-500">{label}</p><p className="mt-1 font-semibold text-stone-900">{value}</p></div>;
}

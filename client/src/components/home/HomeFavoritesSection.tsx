"use client";

import Link from "next/link";
import { useFavoritesStore, FavoriteItem } from "@/store/favorites-store";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

function FavCard({ item }: { item: FavoriteItem }) {
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl">
      {/* ❤ remove */}
      <button
        onClick={() => removeFavorite(item.id)}
        aria-label="Remove from favorites"
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      </button>

      <Link href={`/food/${item.id}`}>
        {item.image ? (
          <div className="h-44 w-full overflow-hidden">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-brand-300">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </div>
        )}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{item.category}</p>
          <h3 className="mt-1 text-xl font-semibold text-stone-900 group-hover:text-brand-600 transition-colors">{item.name}</h3>
          <p className="mt-1 text-sm leading-6 text-stone-500 line-clamp-2">{item.description}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-brand-600">{formatCurrency(item.price)}</span>
            {!item.isAvailable && <span className="text-xs font-medium text-red-500">Unavailable</span>}
          </div>
        </div>
      </Link>

      {item.isAvailable && (
        <div className="px-5 pb-5">
          <button
            onClick={() => addItem({ id: item.id, name: item.name, price: item.price, quantity: 1 })}
            className="w-full rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomeFavoritesSection() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const items = useFavoritesStore((s) => s.items);
  const sorted = [...items].sort((a, b) => b.addedAt - a.addedAt).slice(0, 6);

  if (!isAuthenticated || sorted.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Your Saved Dishes</p>
          <h2 className="mt-2 font-display text-4xl text-brand-900">
            My Favorites{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h2>
        </div>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-500">
          View all
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Grid — max 6 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((item) => (
          <FavCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

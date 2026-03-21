"use client";

import Link from "next/link";
import { useFavoritesStore } from "@/store/favorites-store";
import { useAuthStore } from "@/store/auth-store";
import { formatCurrency } from "@/lib/utils";
import { SiteFooter } from "@/components/layout/site-footer";

export default function FavoritesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const items = useFavoritesStore((s) => s.items);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);

  const sorted = [...items].sort((a, b) => b.addedAt - a.addedAt);

  if (!isAuthenticated) {
    return (
      <main>
        <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10 text-brand-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-brand-900">Your Favorites</h1>
          <p className="mt-4 text-base text-stone-600">Please sign in to view and manage your favorite dishes.</p>
          <Link href="/signin" className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg">
            Sign In
          </Link>
        </section>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="rounded-[2.5rem] bg-ink px-8 py-12 text-center shadow-soft sm:px-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-red-500">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-white">Your Favorites</h1>
          <p className="mt-3 text-base text-stone-400">
            {sorted.length === 0 ? "You haven't saved any favorites yet." : `You have ${sorted.length} favorite ${sorted.length === 1 ? "dish" : "dishes"}.`}
          </p>
          {sorted.length > 0 && (
            <button
              onClick={clearFavorites}
              className="mt-4 text-sm font-medium text-stone-400 underline decoration-stone-500/30 underline-offset-4 transition-colors hover:text-red-400 hover:decoration-red-400/50"
            >
              Clear all favorites
            </button>
          )}
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {sorted.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-12 w-12 text-stone-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-stone-900">No favorites yet</h2>
            <p className="mt-3 max-w-md mx-auto text-sm text-stone-500">
              Browse our menu and tap the ❤️ heart icon on any dish to save it here for quick access later.
            </p>
            <Link
              href="/restaurants"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Browse Menu
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl">
                {/* Remove button */}
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
                  {item.image && (
                    <div className="h-48 w-full overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{item.category}</p>
                        <h3 className="mt-1 text-xl font-semibold text-stone-900 group-hover:text-brand-600 transition-colors">{item.name}</h3>
                      </div>
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-brand-600">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-stone-600 line-clamp-2">{item.description}</p>
                    {!item.isAvailable && (
                      <p className="mt-3 text-sm font-medium text-red-500">Currently unavailable</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}

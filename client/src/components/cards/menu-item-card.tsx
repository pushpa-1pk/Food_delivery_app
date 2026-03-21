"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useFavoritesStore } from "@/store/favorites-store";

type Props = {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    isAvailable: boolean;
    category: string;
  };
};

export function MenuItemCard({ item }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(item.id));

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  }

  return (
    <Link href={`/food/${item.id}`} className="group relative block rounded-3xl border border-stone-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl overflow-hidden">
      {/* Heart button — only for logged in users */}
      {isAuthenticated && (
        <button
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-95 ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/80 text-stone-400 hover:text-red-500"
          }`}
        >
          {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}
        </button>
      )}

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
          <p className="mt-4 text-sm font-medium text-red-500">Currently unavailable</p>
        )}
      </div>
    </Link>
  );
}

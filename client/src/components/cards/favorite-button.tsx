"use client";

import { useFavoritesStore } from "@/store/favorites-store";
import { useState } from "react";

type Props = {
  item: any;
};

export default function FavoriteButton({ item }: Props) {
  const addFavorite = useFavoritesStore((s) => s.addFavorite);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const items = useFavoritesStore((s) => s.items);

  const isFavorite = items.some((fav) => fav.id === item.id);

  const [animating, setAnimating] = useState(false);

  const toggleFavorite = () => {
    setAnimating(true);

    if (isFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite({
        ...item,
        addedAt: Date.now(),
      });
    }

    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition 
      ${isFavorite ? "bg-red-500 text-white" : "bg-white text-stone-500"}
      ${animating ? "scale-125" : "scale-100"}
      hover:scale-110 active:scale-95`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}
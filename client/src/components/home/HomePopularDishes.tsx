"use client";

import { useEffect, useState } from "react";
import { getRestaurant } from "@/services/restaurant-service";
import { mapRestaurantMenuItems } from "@/lib/api-mappers";
import { MenuItemCard } from "@/components/cards/menu-item-card";
import Link from "next/link";

export default function HomePopularDishes() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurant("jay-malhar-main")
      .then((data) => {
        const mapped = mapRestaurantMenuItems(data);
        // Only show available items, sliced to 6
        setItems(mapped.filter(item => item.isAvailable).slice(0, 6));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-44 w-full animate-pulse rounded-[2rem] bg-stone-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

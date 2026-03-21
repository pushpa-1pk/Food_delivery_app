import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type Props = {
  restaurant: {
    id: string;
    name: string;
    description: string;
    rating: number;
    deliveryFee: number;
    tags: string[];
  };
};

export function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="group rounded-3xl border border-orange-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
          Single-brand kitchen
        </span>
        <span className="text-sm font-semibold text-stone-600">{restaurant.rating.toFixed(1)} star</span>
      </div>
      <h3 className="font-display text-2xl text-brand-900">{restaurant.name}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{restaurant.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {restaurant.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between text-sm font-medium text-stone-700">
        <span>Delivery from {formatCurrency(restaurant.deliveryFee)}</span>
        <span className="text-brand-600 group-hover:text-brand-900">Explore menu</span>
      </div>
    </Link>
  );
}

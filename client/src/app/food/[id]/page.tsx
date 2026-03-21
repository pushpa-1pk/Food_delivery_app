"use client";
// Hotload trigger save for dev-server cache re-reading.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { getRestaurant } from "@/services/restaurant-service";
import { mapRestaurantMenuItems } from "@/lib/api-mappers";

import { useFavoritesStore } from "@/store/favorites-store";
import { useAuthStore } from "@/store/auth-store";
// import reviews layout
import { api } from "@/lib/api";
import { MenuItemCard } from "@/components/cards/menu-item-card";

export default function FoodDetailsPage() {
  const params = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(params.id));
  
  const [quantity, setQuantity] = useState(1);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Review state
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let active = true;

    getRestaurant("jay-malhar-main")
      .then((data) => {
        if (!active) return;
        setRestaurant(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const foods = useMemo(() => mapRestaurantMenuItems(restaurant), [restaurant]);
  const item = foods.find((entry) => entry.id === params.id && entry.isAvailable);
  const cartCount = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const similarItems = foods.filter((entry) => entry.category === item?.category && entry.id !== item?.id && entry.isAvailable).slice(0, 3);

  // Fetch item specific reviews
  useEffect(() => {
    if (!item?.id || !restaurant?.id) return;

    setLoadingReviews(true);
    api.get(`/reviews/${restaurant.id}?menuItemId=${item.id}`)
      .then((res) => {
        setReviews(res.data.data);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [item?.id, restaurant?.id]);

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item) return;
    if (!comment.trim()) return;

    setSubmitting(true);
    setSuccessMsg("");

    try {
      await api.post("/reviews", {
        restaurantId: restaurant.id,
        menuItemId: item.id,
        rating,
        comment
      });

      setSuccessMsg("Review submitted successfully!");
      setComment("");
      setRating(5);

      // Refresh reviews list
      const res = await api.get(`/reviews/${restaurant.id}?menuItemId=${item.id}`);
      setReviews(res.data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 text-sm text-stone-600 shadow-soft">Loading food details...</div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h1 className="font-display text-4xl text-brand-900">Food item not found</h1>
          <p className="mt-4 text-sm leading-7 text-stone-600">This dish is not available right now.</p>
          <Link href="/restaurants" className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">Back to Menu</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
        <section className="relative rounded-[2rem] bg-white p-8 shadow-soft">
          {/* Heart button — only for logged in users */}
          {isAuthenticated && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite({
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  price: item.price,
                  image: typeof item.image === "string" ? item.image : undefined,
                  category: item.category,
                  isAvailable: item.isAvailable,
                });
              }}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`absolute right-12 top-12 z-20 flex h-11 w-11 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-95 ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-stone-400 hover:text-red-500"
              }`}
            >
              {isFavorite ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              )}
            </button>
          )}

          {item.image ? (
            <div className="h-80 w-full overflow-hidden rounded-[1.5rem]">
              <img
                src={typeof item.image === "string" ? item.image : item.image?.src}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,#fff7ed_0%,#fed7aa_55%,#fb923c_100%)] text-6xl font-bold text-brand-900">
              {item.imageLabel}
            </div>
          )}
        </section>
        <section className="rounded-[2rem] bg-white p-8 shadow-soft">
          <div className="flex flex-wrap gap-2">
            <span className={item.isVeg ? "rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700" : "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"}>{item.isVeg ? "VEG" : "NON-VEG"}</span>
            {item.spicyLevel ? <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{item.spicyLevel}</span> : null}
          </div>
          <h1 className="mt-4 font-display text-5xl text-brand-900">{item.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-stone-900">{formatCurrency(item.price)}</p>
          <p className="mt-4 text-base leading-8 text-stone-700">{item.description}</p>
          {item.rating > 0 ? <p className="mt-4 text-sm font-medium text-stone-600">Star {item.rating.toFixed(1)} Rating</p> : null}
          <p className="mt-2 text-sm text-stone-500">Estimated delivery: 30 to 40 minutes</p>
          <div className="mt-8 rounded-3xl bg-orange-50 p-6">
            <h2 className="text-xl font-semibold text-stone-900">Ingredients</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">Fresh ingredients, house spices, balanced seasoning, and careful kitchen preparation.</p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm font-semibold text-stone-700">Quantity:</span>
            <div className="flex items-center gap-3 rounded-full bg-stone-900 px-3 py-2 text-white">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-8 w-8 rounded-full bg-white/10 text-lg">-</button>
              <span className="min-w-4 text-center text-sm font-semibold">{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} className="h-8 w-8 rounded-full bg-white/10 text-lg">+</button>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <button type="button" onClick={() => addItem({ id: item.id, name: item.name, price: item.price, quantity })} className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">Add to Cart</button>
            <Link href="/cart" className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-800">Go to Cart</Link>
          </div>
        </section>
      </div>

      {/* Reviews & Similar Dishes Section */}
      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr,400px]">
        {/* Left: Reviews List & Submit Form */}
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-stone-900">Reviews for {item.name}</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-stone-600">
              {loadingReviews && <p className="text-stone-400">Loading reviews...</p>}
              
              {!loadingReviews && reviews.map((review: any) => (
                <div key={review.id} className="rounded-2xl bg-orange-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-stone-900">{review.user?.name || "Customer"}</p>
                    <span className="text-xs font-bold text-brand-600">★ {review.rating}/5</span>
                  </div>
                  <p className="mt-1 text-stone-700">{review.comment}</p>
                </div>
              ))}
              
              {!loadingReviews && reviews.length === 0 && (
                <div className="rounded-2xl bg-orange-50 px-4 py-4">No reviews for this dish yet. Be the first to try it!</div>
              )}
            </div>
          </div>

          {/* Submit Review Form */}
          {isAuthenticated && (
            <div className="rounded-[2rem] bg-white p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-stone-900">Leave a Review</h3>
              {successMsg && <p className="mt-2 text-sm text-green-600 font-medium">{successMsg}</p>}
              
              <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700">Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700">Comment</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others what you think of this dish..."
                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm"
                    required
                    minLength={5}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-brand-500 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right: Similar Dishes */}
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-stone-900">Similar Dishes</h2>
          <p className="mt-1 text-sm text-stone-500">Dishes you might be interested in</p>
          <div className="mt-6 grid gap-6">
            {similarItems.map((similar) => (
              <MenuItemCard key={similar.id} item={{
                id: similar.id,
                name: similar.name,
                description: similar.description,
                price: similar.price,
                category: similar.category,
                isAvailable: similar.isAvailable,
                image: typeof similar.image === "string" ? similar.image : undefined
              }} />
            ))}
            {similarItems.length === 0 && <p className="text-sm text-stone-400">No similar dishes found.</p>}
          </div>
        </div>
      </section>
      
      {cartCount > 0 && (
        <Link href="/cart" className="fixed bottom-6 right-6 z-30 rounded-full bg-brand-500 px-6 py-4 text-sm font-semibold text-white shadow-2xl">
          View Cart ({cartCount} item{cartCount > 1 ? "s" : ""})
        </Link>
      )}
    </main>
  );
}

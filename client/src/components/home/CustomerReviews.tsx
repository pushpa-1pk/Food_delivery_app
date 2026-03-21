"use client";
const veg = "/assets/veg.png";
const nonveg = "/assets/nonveg.jpg";
const dosa = "/assets/dosa.jpg";
const thali = "/assets/thali.jpg";

import { useState, useEffect, useCallback } from "react";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "Best Misal Pav in the city! The spices are perfectly balanced and the delivery was super fast. Truly authentic Maharashtrian taste.",
    foodImage: veg,
  },
  {
    id: 2,
    name: "Rahul Patil",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "Fast delivery and amazing taste. The Veg Thali is always fresh and filling. Jay Malhar never disappoints with their quality.",
    foodImage: nonveg,
  },
  {
    id: 3,
    name: "Anita Deshmukh",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "Thali quality is always fresh and filling. The portions are generous and everything tastes homemade. Highly recommended!",
    foodImage: thali,
  },
  {
    id: 4,
    name: "Vikram Joshi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "Jay Malhar feels like home food with restaurant speed. Every dish is cooked with love. My family orders from here every weekend!",
    foodImage: dosa,
  },
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setFadeKey((k) => k + 1);
  }, []);

  const goPrev = useCallback(() => {
    goTo(activeIndex === 0 ? reviews.length - 1 : activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(activeIndex === reviews.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, goNext]);

  const active = reviews[activeIndex];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div
        className="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-14 sm:px-12 lg:px-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Section heading */}
        <div className="mb-10 text-center lg:text-left">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            What Our Customers{" "}
            <span className="text-brand-500">Say</span>
          </h2>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr,1fr] lg:gap-16">
          {/* Left: Review Card */}
          <div key={fadeKey} className="review-fade-in">
            {/* Reviewer info */}
            <div className="flex items-center gap-4">
              <img
                src={active.avatar}
                alt={active.name}
                className="h-16 w-16 rounded-full border-2 border-brand-500/40 object-cover shadow-lg"
              />
              <div>
                <p className="text-lg font-semibold text-white">{active.name}</p>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: active.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Review text */}
            <p className="mt-6 text-base italic leading-8 text-stone-300 sm:text-lg">
              &quot;{active.text}&quot;
            </p>

            {/* Navigation row: Arrow + Avatars + Arrow */}
            <div className="mt-8 flex items-center gap-3">
              {/* Left arrow */}
              <button
                onClick={goPrev}
                aria-label="Previous review"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-500 hover:text-brand-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Avatar thumbnails */}
              <div className="flex items-center gap-2">
                {reviews.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => goTo(i)}
                    aria-label={`View review by ${r.name}`}
                    className={`relative h-10 w-10 overflow-hidden rounded-full border-2 transition-all duration-300 ${
                      i === activeIndex
                        ? "scale-110 border-brand-500 shadow-lg shadow-brand-500/30"
                        : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Right arrow */}
              <button
                onClick={goNext}
                aria-label="Next review"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-500 hover:text-brand-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Decorative food image */}
          <div className="relative mx-auto flex items-center justify-center lg:mx-0">
            {/* Decorative circle behind */}
            <div className="absolute -right-4 -top-4 h-64 w-64 rounded-full bg-brand-500/20 sm:h-80 sm:w-80" />
            <div className="absolute -left-6 bottom-2 h-32 w-32 rounded-full bg-brand-500/10 sm:h-40 sm:w-40" />

            {/* Food image */}
            <div
              key={`food-${fadeKey}`}
              className="review-fade-in relative z-10 h-64 w-64 overflow-hidden rounded-full border-4 border-white/10 shadow-2xl sm:h-80 sm:w-80"
            >
              <img
                src={active.foodImage}
                alt="Delicious food"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { menuCategories } from "@/data/menu-data";
import { SiteFooter } from "@/components/layout/site-footer";
import CustomerReviews from "@/components/home/CustomerReviews";
import HomeFavoritesSection from "@/components/home/HomeFavoritesSection";
import { MenuItemCard } from "@/components/cards/menu-item-card";

import HomePopularDishes from "@/components/home/HomePopularDishes";



const highlights = [
  { 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-[46px] w-[46px] text-brand-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h8.25m-2.25-18H18a2.25 2.25 0 0 1 2.25 2.25v7.5m-5.208 6.422 1.358-5.072m0 0 2.51 2.225-.569 9.47-5.227-7.917 3.286.672Z" />
      </svg>
    ), 
    title: "Easy To Order", 
    body: "Consectetur Adipiscing Elit, Sed Do\nEiusm Tempor Incididunt Ut Labore Et\nDolore Magna Aliqua." 
  },
  { 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-[46px] w-[46px] text-brand-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ), 
    title: "Fastest Delivery", 
    body: "Consectetur Adipiscing Elit, Sed Do\nEiusm Tempor Incididunt Ut Labore Et\nDolore Magna Aliqua." 
  },
  { 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-[46px] w-[46px] text-brand-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ), 
    title: "Best Quality", 
    body: "Consectetur Adipiscing Elit, Sed Do\nEiusm Tempor Incididunt Ut Labore Et\nDolore Magna Aliqua." 
  }
];



export default function HomePage() {
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "8551815738";
  const address = process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS || "Kurhadi, Tal. Goregaon, Dist. Gondia, Maharashtra";
  const mapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL || "https://maps.google.com/maps?q=Kurhadi,Goregaon,Gondia,Maharashtra,India&t=&z=14&ie=UTF8&iwloc=&output=embed";

  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink shadow-soft lg:pr-0">
          {/* Subtle background texture/gradient for white theme */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_50%)]" />
          
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Content Area */}
            <div className="max-w-2xl p-8 text-left sm:p-12 lg:py-16 lg:pl-16">
              <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-brand-700 shadow-soft">
                50% OFF on your first order
              </span>
              <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Fresh flavors, <span className="text-brand-500">authentic taste, </span> <br />
                and fast delivery – all in one place.
              </h1>
              <p className="mt-6 text-base leading-8 text-stone-300">
                Experience the authentic taste of Jay Malhar at your doorstep – fresh ingredients, high hygiene, and fast delivery.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/restaurants" className="group rounded-full bg-brand-500 px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25">
                  Order Now
                </Link>
                <Link href="/restaurants" className="rounded-full border border-stone-700 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/5">
                  Explore Menu 
                </Link>
              </div>
            </div>

            {/* Right Image Area — flush to all edges */}
            <div className="relative flex items-center justify-end lg:h-full lg:min-h-[500px] overflow-hidden">
              <img
                src="/assets/hero1.png"
                alt="Jay Malhar Authentic Food"
                className="relative z-20 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Popular Dishes</p>
            <h2 className="mt-2 font-display text-4xl text-brand-900">Customer favorites</h2>
          </div>
          <Link href="/restaurants" className="text-sm font-semibold text-brand-700">See full menu</Link>
        </div>
        
        {/* Dynamically Loaded items from Backend API */}
        <HomePopularDishes />
      </section>

      {/* User's favorites — only shown when logged in and has saved dishes */}
      {/* <HomeFavoritesSection /> */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Menu Categories</p>
        <h2 className="mt-2 font-display text-4xl text-brand-900">Find food by category</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {menuCategories.map((category) => (
            <Link key={category.label} href={`/restaurants?category=${encodeURIComponent(category.value)}`} className="group block text-center transition-all hover:-translate-y-1">
              <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-orange-50 shadow-soft">
                <img src={typeof category.image === 'string' ? category.image : category.image?.src} alt={category.label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <p className="text-lg font-semibold text-stone-900 group-hover:text-brand-600 transition-colors">{category.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — Story text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">About Restaurant</p>
            <h2 className="mt-3 font-display text-4xl text-brand-900">
              A Passion for <span className="text-brand-500">Great Food</span>
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-[2px] w-12 bg-brand-500/30" />
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              <span className="h-[2px] w-12 bg-brand-500/30" />
            </div>
            <p className="mt-6 text-base leading-8 text-stone-700">
              Founded by <strong>Proprietor Chirag Meshram</strong>, Jay Malhar Restaurant brings authentic
              Maharashtrian flavors with fresh ingredients and traditional recipes. We focus on quality,
              hygiene, and quick delivery so every customer enjoys a great meal every time.
            </p>
            <p className="mt-4 text-base leading-8 text-stone-700">
              From hearty thalis to fast-moving comfort dishes, our kitchen on <strong>Goregaon–Tiroda Main Road,
              Kunhadi</strong> is built to serve taste, speed, and consistency together.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/25"
            >
              Read Our Story
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          {/* Right — Decorative image */}
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-full w-full rounded-[2.5rem] bg-brand-500/10" />
            <img
              src="/assets/about-dishes.png"
              alt="Our delicious food"
              className="relative z-10 rounded-[2.5rem] object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:mb-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Why Choose Us</p>
          <h2 className="mt-3 font-display text-4xl text-brand-900">What makes us different</h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-[2px] w-12 bg-brand-500/30" />
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            <span className="h-[2px] w-12 bg-brand-500/30" />
          </div>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-orange-50">
                {item.icon}
              </div>
              <h3 className="mb-4 text-2xl font-bold text-stone-900">{item.title}</h3>
              <p className="whitespace-pre-line text-[15px] leading-[1.8] text-stone-500 max-w-[280px]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CustomerReviews />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-[2.5rem] bg-ink px-8 py-12 text-center text-white shadow-soft">
          {/* <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">Order CTA</p> */}
          <h2 className="mt-3 font-display text-4xl">Hungry?</h2>
          <p className="mt-4 text-base text-orange-50/90">Order your favorite food now and enjoy Jay Malhar at home.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/restaurants" className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">
              Browse Menu
            </Link>
            <Link href="/restaurants/jay-malhar-main" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white">
              Order Now
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-[2.5rem] bg-ink px-8 py-14 sm:px-12 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left — Info */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Contact & Location</p>
              <h2 className="mt-3 font-display text-4xl text-white">
                Visit or <span className="text-brand-500">Call Us</span>
              </h2>
              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Address</p>
                    <p className="mt-0.5 text-lg font-medium text-white">{address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Phone</p>
                    <a href={`tel:${supportPhone.replace(/\s/g, "")}`} className="mt-0.5 block text-lg font-medium text-white transition-colors hover:text-brand-500">{supportPhone}</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Hours</p>
                    <p className="mt-0.5 text-lg font-medium text-white">10:00 AM – 11:00 PM</p>
                  </div>
                </div>
              </div>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/25"
              >
                Contact Us
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            {/* Right — Map placeholder */}
            <div className="rounded-[2rem] bg-white/5 p-5 backdrop-blur-sm">
              <iframe
                title="Jay Malhar Restaurant Location"
                src="https://maps.google.com/maps?q=Kurhadi,Goregaon,Gondia,Maharashtra,India&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="h-[340px] w-full rounded-[1.5rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";

const whyChooseUs = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="h-10 w-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
    title: "Fresh Ingredients",
    body: "We source the freshest vegetables, spices, and ingredients daily to ensure every dish bursts with authentic flavor and nutrition.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="h-10 w-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: "Fast Delivery",
    body: "Our delivery network ensures your food reaches you hot and fresh within 30–40 minutes of placing your order.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="h-10 w-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
    title: "Wide Variety",
    body: "From Veg & Non-Veg specials to Chinese dishes, Thali platters, and Morning Specials — there's something for everyone.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="h-10 w-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
    title: "Quality Service",
    body: "We treat every order with care. Hygienic packing, accurate portions, and a commitment to excellence in every meal.",
  },
];

const missionPoints = [
  { label: "Tasty & Hygienic", desc: "Every meal is prepared in a clean kitchen with strict hygiene standards and authentic recipes." },
  { label: "Affordable Prices", desc: "Enjoy premium quality food at prices that fit your budget — no compromise on taste." },
  { label: "Fast & Reliable", desc: "Dependable delivery that gets your food to you hot and on time, every single time." },
  { label: "Customer First", desc: "Your satisfaction drives everything we do. We listen, improve, and serve with a smile." },
];

const gallery = [
  { src: "/assets/about-hero.png", alt: "Our restaurant kitchen", label: "Our Kitchen" },
  { src: "/assets/about-dishes.png", alt: "Delicious dishes", label: "Signature Dishes" },
  { src: "/assets/about-delivery.png", alt: "Food delivery service", label: "Fast Delivery" },
  { src: "/assets/about-customers.png", alt: "Happy customers enjoying food", label: "Happy Customers" },
];

export default function AboutPage() {
  return (
    <main>
      {/* ─── 1. Hero Section ──────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-soft">
          <img
            src="/assets/about-hero.png"
            alt="Jay Malhar Restaurant"
            className="h-[340px] w-full object-cover brightness-[0.45] sm:h-[420px] lg:h-[480px]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-orange-200 backdrop-blur-sm">
              Jay Malhar Restaurant
            </span>
            <h1 className="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              About Our Restaurant
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-orange-100/90">
              Delivering Fresh, Delicious Food to Your Doorstep
            </p>
          </div>
        </div>
      </section>

      {/* ─── 2. Our Story ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Our Story</p>
            <h2 className="mt-3 font-display text-4xl text-brand-900">
              A Passion for <span className="text-brand-500">Great Food</span>
            </h2>
            <div className="mx-auto mt-4 flex items-center gap-2">
              <span className="h-[2px] w-12 bg-brand-500/30" />
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              <span className="h-[2px] w-12 bg-brand-500/30" />
            </div>
            <p className="mt-6 text-base leading-8 text-stone-700">
              Jay Malhar Restaurant was started by <strong>Proprietor Chirag Megham</strong> with a simple
              vision — to bring authentic, homestyle Maharashtrian food to every doorstep. What began as a small
              kitchen has grown into a trusted name for quality meals in the community.
            </p>
            <p className="mt-4 text-base leading-8 text-stone-700">
              Our passion lies in using fresh, locally-sourced ingredients, traditional recipes passed down
              through generations, and a kitchen that maintains the highest hygiene standards. We proudly serve
              customers around <strong>Kurhadi, Tal. Goregaon, Dist. Gondia, Maharashtra</strong>, delivering the warmth of
              home-cooked food with restaurant-level speed and consistency.
            </p>
            <p className="mt-4 text-base leading-8 text-stone-700">
              Every dish that leaves our kitchen carries the love and dedication of our team. From hearty thalis to
              spicy non-veg specials, each order is crafted to satisfy and delight.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[2.5rem] bg-brand-500/10" />
            <img
              src="/assets/about-dishes.png"
              alt="Our delicious food"
              className="relative z-10 rounded-[2.5rem] object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* ─── 3. Our Mission ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-[2.5rem] bg-ink px-8 py-14 sm:px-12 lg:px-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Our Mission</p>
            <h2 className="mt-3 font-display text-4xl text-white">
              What We <span className="text-brand-500">Stand For</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {missionPoints.map((point) => (
              <div key={point.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand-500/30 hover:bg-white/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">{point.label}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-400">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Why Choose Us ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Why Choose Us</p>
          <h2 className="mt-3 font-display text-4xl text-brand-900">What Makes Us Special</h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-[2px] w-12 bg-brand-500/30" />
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            <span className="h-[2px] w-12 bg-brand-500/30" />
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="group rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-soft transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100 text-brand-500 transition-colors group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. Gallery Section ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Gallery</p>
          <h2 className="mt-3 font-display text-4xl text-brand-900">A Glimpse of Jay Malhar</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((img) => (
            <div key={img.label} className="group relative overflow-hidden rounded-[2rem] shadow-soft">
              <img
                src={img.src}
                alt={img.alt}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-lg font-semibold text-white">{img.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. Restaurant Location ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-soft lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Find Us</p>
            <h2 className="mt-3 font-display text-4xl text-brand-900">Restaurant Location</h2>
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-brand-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">Address</p>
                  <p className="mt-1 text-lg font-medium text-stone-900">Kurhadi, Tal. Goregaon, Dist. Gondia, Maharashtra</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-brand-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">Phone</p>
                  <p className="mt-1 text-lg font-medium text-stone-900">
                    <a href="tel:8551815738" className="text-brand-600 hover:text-brand-500 transition-colors">8551815738</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-brand-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">Hours</p>
                  <p className="mt-1 text-lg font-medium text-stone-900">10:00 AM – 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[2.5rem] bg-white/5 p-5 backdrop-blur-sm">
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
      </section>

      {/* ─── 7. Contact / CTA Section ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-brand-500 to-orange-400 px-8 py-16 text-center shadow-soft sm:px-12">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-100">Get In Touch</p>
            <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
              We Are Happy to Serve You
            </h2>
            <p className="mt-5 text-lg leading-8 text-orange-50/90">
              Order now and enjoy delicious meals prepared with love by <strong>Chirag Megham</strong> and the
              Jay Malhar team. Fresh food, fast delivery, unforgettable taste.
            </p>
            <div className="mt-4 text-base text-orange-100">
              <p>
                We are located in Kurhadi, Tal. Goregaon, Dist. Gondia, Maharashtra. Come visit us for dine-in or order online
                for fast delivery. We're happy to serve you every day from 10 AM to 11 PM.
              </p>
              <p className="mt-1">
                📞 <a href="tel:8551815738" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">8551815738</a>
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/restaurants"
                className="rounded-full bg-white px-8 py-4 font-semibold text-brand-600 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                Browse Menu
              </Link>
              <a
                href="tel:8551815738"
                className="rounded-full border-2 border-white/30 px-8 py-4 font-semibold text-white transition-transform hover:-translate-y-1 hover:border-white/60"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

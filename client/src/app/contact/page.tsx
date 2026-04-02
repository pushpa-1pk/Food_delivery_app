"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";

const contactInfo = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    label: "Address",
    value: "Kurhadi, Tal. Goregaon, Dist. Gondia, Maharashtra",
    href: undefined as string | undefined,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    label: "Phone",
    value: "8551815738",
    href: "tel:8551815738",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Email",
    value: "jaymalhartaste@gmail.com",
    href: "mailto:jaymalhartaste@gmail.com",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    label: "Hours",
    value: "10:00 AM – 11:00 PM (Everyday)",
    href: undefined as string | undefined,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  }

  return (
    <main>
      {/* ─── Hero Banner ──────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-soft">
          <img
            src="/assets/about-hero.png"
            alt="Contact Jay Malhar Restaurant"
            className="h-[300px] w-full object-cover brightness-[0.4] sm:h-[360px]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-orange-200 backdrop-blur-sm">
              Jay Malhar Restaurant
            </span>
            <h1 className="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-8 text-orange-100/90">
              We'd love to hear from you. Reach out anytime!
            </p>
          </div>
        </div>
      </section>

      {/* ─── Contact Info Cards ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="group rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100 text-brand-500 transition-colors group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white">
                {item.icon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="mt-1 block text-lg font-semibold text-stone-900 transition-colors hover:text-brand-500">
                  {item.value}
                </a>
              ) : (
                <p className="mt-1 text-lg font-semibold text-stone-900">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Proprietor & Form ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[380px,1fr] lg:gap-12">
          {/* Left — Owner info + social */}
          <div className="space-y-8">
            {/* Owner Card */}
            <div className="rounded-[2.5rem] bg-ink p-8 text-white shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Proprietor</p>
              <h2 className="mt-3 font-display text-3xl">Chirag Meshram</h2>
              <p className="mt-4 text-sm leading-7 text-stone-400">
                Dedicated to bringing authentic taste, fresh ingredients, and fast service to every customer.
                Order now and experience the Jay Malhar difference.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-brand-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <a href="tel:8551815738" className="text-lg font-semibold text-white transition-colors hover:text-brand-500">
                  8551815738
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-bold text-stone-900">Stay Connected</h3>
              <p className="mt-2 text-sm text-stone-500">Follow us for updates and offers</p>
              <div className="mt-5 flex gap-3">
                <a href="#" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" aria-label="WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="rounded-[2rem] bg-gradient-to-br from-brand-500 to-orange-400 p-6 text-center text-white shadow-soft">
              <h3 className="text-xl font-bold">Hungry Right Now?</h3>
              <p className="mt-2 text-sm text-orange-100">Skip the form and order directly</p>
              <Link
                href="/restaurants"
                className="mt-4 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-600 shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                Browse Menu
              </Link>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="rounded-[2.5rem] bg-white p-8 shadow-soft lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Send a Message</p>
            <h2 className="mt-3 font-display text-4xl text-brand-900">
              We Love To Hear <span className="text-brand-500">From You</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-500">
              Have a question, feedback, or just want to say hello? Fill in the form below and we will get back to you as soon as possible.
            </p>

            {submitted && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 shrink-0 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="text-sm font-semibold text-green-700">
                  Thank you! We've received your message and will get back to you shortly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField id="firstName" label="First Name" required value={formData.firstName} onChange={handleChange} />
                <FormField id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField id="email" label="Email" type="email" required placeholder="your@email.com" value={formData.email} onChange={handleChange} />
                <FormField id="phone" label="Phone" type="tel" required placeholder="Phone number" value={formData.phone} onChange={handleChange} />
              </div>
              <FormField id="subject" label="Subject" required placeholder="What is this about?" value={formData.subject} onChange={handleChange} />
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-stone-800">
                  Message <span className="text-brand-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/25"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── Location / Map Section ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <div className="rounded-[2.5rem] bg-ink px-8 py-14 sm:px-12 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Visit Us</p>
              <h2 className="mt-3 font-display text-4xl text-white">
                Find Our <span className="text-brand-500">Restaurant</span>
              </h2>
              <p className="mt-5 text-base leading-8 text-stone-400">
                We are located in Kurhadi, Tal. Goregaon, Dist. Gondia, Maharashtra. Come visit us for dine-in or order online
                for fast delivery. We’re happy to serve you every day from 10 AM to 11 PM.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-white">Kurhadi, Tal. Goregaon, Dist. Gondia, Maharashtra</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <a href="tel:8551815738" className="text-base font-medium text-white transition-colors hover:text-brand-500">8551815738</a>
                </div>
              </div>
            </div>
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

function FormField({
  id,
  label,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-stone-800">
        {label} {required && <span className="text-brand-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}

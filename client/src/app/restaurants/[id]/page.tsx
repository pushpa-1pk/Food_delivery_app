import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { menuItems } from "@/data/menu-data";

export default function RestaurantDetailPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Open now</p>
            <h1 className="mt-2 font-display text-4xl text-brand-900">Jay Malhar Restaurant</h1>
            <p className="mt-4 max-w-2xl text-stone-600">
              Authentic Maharashtrian meals prepared fresh with direct online ordering, fast delivery, and reliable kitchen quality.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <Metric label="Rating" value="4.5" />
            <Metric label="Delivery" value="30 to 40 min" />
            <Metric label="Min order" value="Rs 149" />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-3xl text-brand-900">Menu Highlights</h2>
          <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-brand-600">
            Live menu controlled from owner dashboard
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {menuItems.slice(0, 6).map((item) => (
            <Link href={`/food/${item.id}`} key={item.id} className="group block overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl">
              {item.image && (
                <div className="h-48 w-full overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-brand-700">{item.category}</span>
                      <span className={item.isVeg ? "rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700" : "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"}>
                        {item.isVeg ? "VEG" : "NON-VEG"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold text-stone-900 group-hover:text-brand-600 transition-colors">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                  </div>
                  <div className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-brand-700">
                    {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-stone-600">
                  {item.rating > 0 ? <span>Star {item.rating.toFixed(1)}</span> : <span>No ratings yet</span>}
                  <span>{item.spicyLevel || "Mild"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
      <p className="text-stone-500">{label}</p>
      <p className="mt-1 font-semibold text-stone-900">{value}</p>
    </div>
  );
}

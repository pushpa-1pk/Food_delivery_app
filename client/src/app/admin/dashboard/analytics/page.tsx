"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { getOwnerAnalytics } from "@/services/owner-service";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    getOwnerAnalytics().then((data) => setAnalytics(data));
  }, []);

  function exportSalesReport() {
    if (!analytics) {
      return;
    }

    const lines = [
      "Jay Malhar Sales Report",
      `Today's Revenue: ${formatCurrency(analytics.todaysRevenue)}`,
      `Weekly Revenue Entries: ${analytics.weeklyRevenue.length}`,
      `Monthly Order Entries: ${analytics.monthlyOrders.length}`
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "jay-malhar-sales-report.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!analytics) {
    return <section className="rounded-[2rem] bg-white p-8 text-sm text-stone-600 shadow-soft">Loading analytics...</section>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Analytics</p>
            <h1 className="mt-2 font-display text-4xl text-brand-900">Sales and trends</h1>
          </div>
          <button type="button" onClick={exportSalesReport} className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white">
            Export Sales Report
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Today's Revenue" value={formatCurrency(analytics.todaysRevenue)} />
        <Metric title="Weekly Sales Days" value={String(analytics.weeklyRevenue.length)} />
        <Metric title="Monthly Order Days" value={String(analytics.monthlyOrders.length)} />
        <Metric title="Popular Dishes" value={String(analytics.topItems.length)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-stone-900">Daily revenue</h2>
          <div className="mt-6 grid grid-cols-7 items-end gap-3">
            {analytics.dailyRevenue.map((entry: any) => (
              <div key={entry.date} className="space-y-2 text-center text-xs text-stone-500">
                <div className="rounded-t-2xl bg-brand-500/80" style={{ height: `${Math.max(entry.revenue / 20, 20)}px` }} />
                <span>{entry.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-stone-900">Top selling items</h2>
          <div className="mt-6 grid gap-4">
            {analytics.topItems.map((item: any, index: number) => (
              <div key={item.name} className="rounded-2xl bg-orange-50 px-4 py-4">
                <p className="text-sm text-stone-500">Rank {index + 1}</p>
                <p className="mt-2 text-lg font-semibold text-stone-900">{item.name}</p>
                <p className="mt-1 text-sm text-stone-600">{item.quantity} items sold</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-soft">
      <p className="text-sm text-stone-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}

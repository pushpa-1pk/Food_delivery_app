"use client";

import { useEffect, useState } from "react";
import { getOwnerCustomers } from "@/services/owner-service";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    getOwnerCustomers().then((data) => setCustomers(data));
  }, []);

  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Customers</p>
      <h1 className="mt-2 font-display text-4xl text-brand-900">Customer management</h1>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-stone-500">
            <tr>
              <th className="pb-3">Customer Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Orders</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-stone-100">
                <td className="py-4 font-semibold text-stone-900">{customer.name}</td>
                <td className="py-4 text-stone-700">{customer.email}</td>
                <td className="py-4 text-stone-700">{customer.phone || "-"}</td>
                <td className="py-4 text-stone-700">{customer.orders}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => window.alert(`Customer ${customer.name} has ${customer.orders} orders.`)} className="rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700">
                      View History
                    </button>
                    <button type="button" disabled className="rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-400">
                      Block User
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

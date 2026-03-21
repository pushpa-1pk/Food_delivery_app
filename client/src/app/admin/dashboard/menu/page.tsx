"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { deleteOwnerMenuItem, getOwnerRestaurantDetails, toggleOwnerMenuItem } from "@/services/owner-service";

export default function MenuManagementPage() {
  const router = useRouter();
  const [foods, setFoods] = useState<any[]>([]);

  function loadMenu() {
    getOwnerRestaurantDetails().then((restaurant) => setFoods(restaurant.menuItems || []));
  }

  useEffect(() => {
    loadMenu();
  }, []);

  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-soft">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Menu Management</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Manage food items</h1>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-stone-500">
            <tr>
              <th className="pb-3">Food Name</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id} className="border-t border-stone-100 align-top">
                <td className="py-4">
                  <div className="flex items-center w-80 gap-3">
                    {food.image && <img src={food.image} alt={food.name} className="h-10 w-10 rounded-full object-cover border border-stone-200" />}
                    <div>
                      <p className="font-semibold text-stone-900">{food.name}</p>
                      <p className="text-xs text-stone-500">{food.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-stone-700">
                  {formatCurrency(food.price)}
                  {food.discount > 0 ? <span className="ml-2 text-xs font-semibold text-green-600">{food.discount}% OFF</span> : null}
                </td>
                <td className="py-4 text-stone-700">{food.category}</td>
                <td className="py-4 text-stone-700">{food.isAvailable ? "Active" : "Inactive"}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => router.push(`/admin/dashboard/add-food?editId=${food.id}`)} className="rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700">
                      Edit
                    </button>
                    <button type="button" onClick={async () => { await toggleOwnerMenuItem(food.id); loadMenu(); }} className="rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold text-brand-700">
                      {food.isAvailable ? "Disable" : "Enable"}
                    </button>
                    <button type="button" onClick={async () => { await deleteOwnerMenuItem(food.id); loadMenu(); }} className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                      Delete
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

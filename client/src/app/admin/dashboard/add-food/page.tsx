"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createOwnerMenuItem, uploadImageToCloudinary, getOwnerRestaurantDetails, updateOwnerMenuItem } from "@/services/owner-service";

const categoryOptions = [
  "Morning Special",
  "South Indian",
  "Veg Special",
  "Nonveg Special",
  "Chinese Special",
  "Thali Special"
] as const;

type CategoryOption = (typeof categoryOptions)[number];

type AddFoodForm = {
  name: string;
  description: string;
  price: string;
  category: CategoryOption;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  discount: string;
};

export default function AddFoodPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const [form, setForm] = useState<AddFoodForm>({
    name: "",
    description: "",
    price: "",
    category: categoryOptions[0],
    image: "",
    isVeg: true,
    isAvailable: true,
    discount: "0"
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      getOwnerRestaurantDetails()
        .then((restaurant) => {
          const item = restaurant.menuItems?.find((mi) => mi.id === editId);
          if (item) {
            setForm({
              name: item.name,
              description: item.description,
              price: String(item.price),
              category: item.category as CategoryOption,
              image: item.image || "",
              isVeg: item.isVeg,
              isAvailable: item.isAvailable,
              discount: String(item.discount || 0)
            });
          }
        })
        .finally(() => setInitialLoading(false));
    }
  }, [editId]);

  async function handleImageUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");
    try {
      const uploadedUrl = await uploadImageToCloudinary(file, "jay-malhar/menu");
      setForm((current) => ({ ...current, image: uploadedUrl }));
    } catch (err: any) {
      setError(err?.message || "Unable to upload image right now.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image: form.image || undefined,
        isVeg: form.isVeg,
        isAvailable: form.isAvailable,
        discount: Number(form.discount)
      };

      if (editId) {
        await updateOwnerMenuItem(editId, payload);
      } else {
        await createOwnerMenuItem(payload);
      }
      router.push("/admin/dashboard/menu");
    } catch (err: any) {
      setError(err?.response?.data?.message || `Unable to ${editId ? "update" : "add"} food item.`);
    }
  }

  if (initialLoading) {
    return <section className="p-8">Loading food item details...</section>;
  }

  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">{editId ? "Edit Food" : "Add Food"}</p>
      <h1 className="mt-2 font-display text-4xl text-brand-900">{editId ? "Update food item" : "Add a new food item"}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
        Use the same live sections shown on the Jay Malhar menu so customers and the owner dashboard stay in sync.
      </p>

      <form className="mt-8 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
        <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Food Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <div className="flex gap-3">
          <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" placeholder="Price (₹)" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
          <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" placeholder="Discount (%)" type="number" value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} />
        </div>
        <input className="rounded-2xl border border-stone-200 px-4 py-3 lg:col-span-2" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
        <select className="rounded-2xl border border-stone-200 px-4 py-3" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as CategoryOption })}>
          {categoryOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <div className="flex items-center gap-6 rounded-2xl border border-stone-200 px-4 py-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
            <input type="radio" name="diet" checked={form.isVeg} onChange={() => setForm({ ...form, isVeg: true })} /> Veg
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
            <input type="radio" name="diet" checked={!form.isVeg} onChange={() => setForm({ ...form, isVeg: false })} /> Non-Veg
          </label>
        </div>
        <div className="rounded-2xl border border-stone-200 p-4 lg:col-span-2">
          <label className="block text-sm font-semibold text-stone-800">Upload Food Image</label>
          <input type="file" accept="image/*" className="mt-3 block w-full text-sm text-stone-600" onChange={(event) => handleImageUpload(event.target.files?.[0])} />
          <p className="mt-2 text-xs text-stone-500">{uploading ? "Uploading to Cloudinary..." : form.image ? `Uploaded image ready: ${form.image}` : "Please upload an image."}</p>
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 lg:col-span-2">
          <input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm({ ...form, isAvailable: event.target.checked })} />
          Available Now
        </label>
        {error ? <p className="text-sm text-red-600 lg:col-span-2">{error}</p> : null}
        <button type="submit" disabled={uploading} className="w-fit rounded-full bg-brand-500 px-8 py-3 font-semibold text-white disabled:opacity-60 lg:col-span-2">
          {uploading ? "Uploading..." : editId ? "Save Updates" : "Add Food Item"}
        </button>
      </form>
    </section>
  );
}
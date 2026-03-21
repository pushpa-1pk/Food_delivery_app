import { api } from "@/lib/api";
import type { ApiOrder } from "@/services/order-service";
import type { RestaurantResponse } from "@/services/restaurant-service";

export type OwnerDashboardResponse = {
  totalOrders: number;
  totalRevenue: number;
  menuItems: number;
  customers: number;
  pendingOrders: number;
  deliveredOrders: number;
  topItems: Array<{ name: string; quantity: number }>;
  recentOrders: ApiOrder[];
};

export type OwnerAnalyticsResponse = {
  todaysRevenue: number;
  weeklyRevenue: Array<{ date: string; revenue: number }>;
  dailyRevenue: Array<{ date: string; revenue: number }>;
  monthlyOrders: Array<{ date: string; count: number }>;
  topItems: Array<{ name: string; quantity: number }>;
};

export type OwnerCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  orders: number;
};

export type OwnerMenuPayload = {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isVeg?: boolean;
  isAvailable?: boolean;
  discount?: number;
};

export async function getOwnerDashboard() {
  const response = await api.get("/admin/owner/dashboard");
  return response.data.data as OwnerDashboardResponse;
}

export async function getOwnerAnalytics() {
  const response = await api.get("/admin/owner/analytics");
  return response.data.data as OwnerAnalyticsResponse;
}

export async function getOwnerCustomers() {
  const response = await api.get("/admin/owner/customers");
  return response.data.data as OwnerCustomer[];
}

export async function createOwnerMenuItem(payload: OwnerMenuPayload) {
  const response = await api.post("/menu", payload);
  return response.data.data;
}

export async function updateOwnerMenuItem(id: string, payload: Partial<OwnerMenuPayload>) {
  const response = await api.put(`/menu/${id}`, payload);
  return response.data.data;
}

export async function toggleOwnerMenuItem(id: string) {
  const response = await api.patch(`/menu/${id}/toggle`);
  return response.data.data;
}

export async function deleteOwnerMenuItem(id: string) {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
}

export async function getOwnerRestaurantDetails() {
  const response = await api.get("/restaurants/owner/me");
  return response.data.data as RestaurantResponse;
}

export async function updateOwnerRestaurantDetails(payload: Partial<RestaurantResponse>) {
  const response = await api.patch("/restaurants/owner/me", payload);
  return response.data.data as RestaurantResponse;
}

export async function getCloudinaryUploadSignature(folder = "jay-malhar") {
  const response = await api.get(`/uploads/signature?folder=${encodeURIComponent(folder)}`);
  return response.data.data as {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    folder: string;
    signature: string;
    uploadUrl: string;
  };
}

export async function uploadImageToCloudinary(file: File, folder = "jay-malhar") {
  const signatureData = await getCloudinaryUploadSignature(folder);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  const response = await fetch(signatureData.uploadUrl, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url as string;
}

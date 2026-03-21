import { api } from "@/lib/api";

export type RestaurantResponse = {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  rating: number;
  images: string[];
  categories: string[];
  deliveryFee: number;
  deliveryRadius: number;
  openingHours: string;
  isOpen: boolean;
  status: string;
  menuItems: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string | null;
    isAvailable: boolean;
    isVeg: boolean;
    discount: number;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    user?: { id: string; name: string };
  }>;
};

export async function getRestaurants() {
  const response = await api.get("/restaurants");
  return response.data.data as RestaurantResponse[];
}

export async function getRestaurant(id: string) {
  const response = await api.get(`/restaurants/${id}`);
  return response.data.data as RestaurantResponse;
}

export async function getOwnerRestaurant() {
  const response = await api.get("/restaurants/owner/me");
  return response.data.data as RestaurantResponse;
}

export async function updateOwnerRestaurant(payload: Partial<RestaurantResponse>) {
  const response = await api.patch("/restaurants/owner/me", payload);
  return response.data.data as RestaurantResponse;
}

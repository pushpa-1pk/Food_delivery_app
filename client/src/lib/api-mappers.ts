import type { ApiOrder, ApiOrderStatus } from "@/services/order-service";
import type { RestaurantResponse } from "@/services/restaurant-service";

export function formatOrderStatus(status: ApiOrderStatus | string) {
  if (status === "OUT_FOR_DELIVERY") return "Out for Delivery";
  if (status === "PENDING") return "Pending";
  if (status === "ACCEPTED") return "Accepted";
  if (status === "PREPARING") return "Preparing";
  if (status === "DELIVERED") return "Delivered";
  if (status === "CANCELLED") return "Cancelled";
  if (status === "REJECTED") return "Rejected";
  return status;
}

export function toOrderStatusValue(status: string) {
  if (status === "Out for Delivery") return "OUT_FOR_DELIVERY";
  return status.toUpperCase().replace(/ /g, "_");
}

function getImageLabel(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getSpicyLevel(name: string, description: string): "Mild" | "Medium" | "Spicy" {
  const text = `${name} ${description}`.toLowerCase();
  if (/kolhapuri|tambda|schezwan|chilli|manchurian|tikka|masala|spicy|kadhai/.test(text)) {
    return "Spicy";
  }
  if (/butter|paneer|fried|rice|thali|dosa|egg|garlic/.test(text)) {
    return "Medium";
  }
  return "Mild";
}

function isBestSeller(name: string, category: string) {
  return /thali|chicken lollipop|chicken chilli|paneer butter masala|tandoori chicken fry|masala dosa/.test(
    `${name} ${category}`.toLowerCase()
  );
}

import { menuItems } from "@/data/menu-data";

export function mapRestaurantMenuItems(restaurant?: RestaurantResponse) {
  return (restaurant?.menuItems || []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    imageLabel: getImageLabel(item.name),
    image: (item as any).image || menuItems.find(m => m.id === item.id)?.image,
    isVeg: typeof (item as any).isVeg === "boolean" ? (item as any).isVeg : !/chicken|mutton|fish|egg|omelette|tikka|kebab|tangdi/i.test(item.name + " " + item.description),
    rating: (item as any).rating || 0,
    isAvailable: item.isAvailable,
    isBestSeller: isBestSeller(item.name, item.category),
    spicyLevel: getSpicyLevel(item.name, item.description)
  }));
}

export function mapMyOrders(orders: ApiOrder[]) {
  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    date: new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    amount: order.totalPrice,
    status: formatOrderStatus(order.status),
    items: order.items.map((item) => item.menuItem.name),
    deliveryAddress: order.deliveryAddress,
    paymentMethod: order.paymentMethod
  }));
}
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { menuItems } from "@/data/menu-data";

export type OrderStatus = "Pending" | "Accepted" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";

export type AdminFoodItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageLabel: string;
  isVeg: boolean;
  rating: number;
  isAvailable: boolean;
  isBestSeller?: boolean;
  spicyLevel?: string;
};

export type AdminOrder = {
  id: string;
  orderNumber: number;
  customerId?: string;
  customer: string;
  email: string;
  items: number;
  itemNames: string[];
  price: number;
  status: OrderStatus;
  createdAt: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  blocked: boolean;
};

export type RestaurantSettings = {
  restaurantName: string;
  deliveryTime: string;
  deliveryCharges: string;
  openingHours: string;
  paymentOptions: string;
  orderSoundAlert: boolean;
  liveNotifications: boolean;
};

type AddFoodPayload = {
  name: string;
  description: string;
  price: number;
  category: string;
  imageLabel: string;
  isVeg: boolean;
  isAvailable: boolean;
  spicyLevel: string;
};

type IncomingOrderPayload = {
  id: string;
  customerId?: string;
  customer: string;
  email: string;
  itemNames: string[];
  price: number;
  createdAt: string;
};

type AdminStore = {
  foods: AdminFoodItem[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  settings: RestaurantSettings;
  notifications: string[];
  addFood: (payload: AddFoodPayload) => void;
  updateFood: (id: string, updates: Partial<AdminFoodItem>) => void;
  deleteFood: (id: string) => void;
  toggleFoodAvailability: (id: string) => void;
  createIncomingOrder: (payload: IncomingOrderPayload) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  blockCustomer: (id: string) => void;
  updateSettings: (payload: Partial<RestaurantSettings>) => void;
};

const initialFoods: AdminFoodItem[] = menuItems.map((item) => ({
  ...item,
  spicyLevel: item.spicyLevel || "Mild"
}));

const initialOrders: AdminOrder[] = [
  { id: "1021", orderNumber: 1021, customer: "Rahul", email: "rahul@gmail.com", items: 2, itemNames: ["Misal Pav", "Mango Lassi"], price: 350, status: "Preparing", createdAt: "Today, 7:10 PM" },
  { id: "1022", orderNumber: 1022, customer: "Amit", email: "amit@gmail.com", items: 1, itemNames: ["Misal Pav"], price: 120, status: "Pending", createdAt: "Today, 7:18 PM" },
  { id: "1023", orderNumber: 1023, customer: "Neha", email: "neha@gmail.com", items: 3, itemNames: ["Paneer Thali", "Veg Biryani", "Masala Soda"], price: 540, status: "Delivered", createdAt: "Today, 6:45 PM" },
  { id: "1024", orderNumber: 1024, customer: "Sneha", email: "sneha@gmail.com", items: 4, itemNames: ["Special Maharashtrian Thali", "Mango Lassi", "Gulab Jamun", "Masala Soda"], price: 760, status: "Out for Delivery", createdAt: "Today, 7:02 PM" },
  { id: "1025", orderNumber: 1025, customer: "Rohit", email: "rohit@gmail.com", items: 2, itemNames: ["Chicken Biryani", "Masala Soda"], price: 280, status: "Accepted", createdAt: "Today, 7:25 PM" }
];

const initialCustomers: AdminCustomer[] = [
  { id: "c1", name: "Rahul", email: "rahul@gmail.com", orders: 5, blocked: false },
  { id: "c2", name: "Neha", email: "neha@gmail.com", orders: 3, blocked: false },
  { id: "c3", name: "Amit", email: "amit@gmail.com", orders: 8, blocked: false },
  { id: "c4", name: "Sneha", email: "sneha@gmail.com", orders: 4, blocked: false }
];

const initialSettings: RestaurantSettings = {
  restaurantName: "Jay Malhar",
  deliveryTime: "30 to 40 minutes",
  deliveryCharges: "40",
  openingHours: "10:00 AM to 11:00 PM",
  paymentOptions: "Cash on Delivery, UPI, Cards",
  orderSoundAlert: true,
  liveNotifications: true
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      foods: initialFoods,
      orders: initialOrders,
      customers: initialCustomers,
      settings: initialSettings,
      notifications: ["New order #1022 received", "Paneer Thali is trending today"],
      addFood: (payload) =>
        set((state) => ({
          foods: [
            {
              id: `food-${Date.now()}`,
              name: payload.name,
              description: payload.description,
              price: payload.price,
              category: payload.category,
              imageLabel: payload.imageLabel || payload.name.slice(0, 2).toUpperCase(),
              isVeg: payload.isVeg,
              rating: 4.5,
              isAvailable: payload.isAvailable,
              spicyLevel: payload.spicyLevel || "Mild"
            },
            ...state.foods
          ],
          notifications: [`${payload.name} added to menu`, ...state.notifications]
        })),
      updateFood: (id, updates) =>
        set((state) => ({
          foods: state.foods.map((food) => (food.id === id ? { ...food, ...updates } : food))
        })),
      deleteFood: (id) =>
        set((state) => ({
          foods: state.foods.filter((food) => food.id !== id),
          notifications: ["Menu item removed", ...state.notifications]
        })),
      toggleFoodAvailability: (id) =>
        set((state) => ({
          foods: state.foods.map((food) => (food.id === id ? { ...food, isAvailable: !food.isAvailable } : food))
        })),
      createIncomingOrder: (payload) =>
        set((state) => {
          const existingCustomer = state.customers.find((customer) => customer.email === payload.email);
          const nextCustomers = existingCustomer
            ? state.customers.map((customer) =>
                customer.email === payload.email ? { ...customer, orders: customer.orders + 1 } : customer
              )
            : [
                {
                  id: payload.customerId || `customer-${Date.now()}`,
                  name: payload.customer,
                  email: payload.email,
                  orders: 1,
                  blocked: false
                },
                ...state.customers
              ];

          return {
            orders: [
              {
                id: payload.id,
                orderNumber: parseInt(payload.id.replace(/\D/g, '') || String(Date.now()).slice(-4)),
                customerId: payload.customerId,
                customer: payload.customer,
                email: payload.email,
                items: payload.itemNames.length,
                itemNames: payload.itemNames,
                price: payload.price,
                status: "Pending",
                createdAt: payload.createdAt
              },
              ...state.orders
            ],
            customers: nextCustomers,
            notifications: [`New order #${payload.id} received`, ...state.notifications]
          };
        }),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, status } : order)),
          notifications: [`#${id} updated to ${status}`, ...state.notifications]
        })),
      blockCustomer: (id) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id ? { ...customer, blocked: !customer.blocked } : customer
          )
        })),
      updateSettings: (payload) =>
        set((state) => ({
          settings: { ...state.settings, ...payload },
          notifications: ["Restaurant settings updated", ...state.notifications]
        }))
    }),
    {
      name: "jay-malhar-admin",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

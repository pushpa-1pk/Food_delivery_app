"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserAddress = {
  id: string;
  type: string;
  address: string;
};

export type UserOrder = {
  id: string;
  date: string;
  amount: number;
  status: "Pending" | "Accepted" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  items: string[];
};

export type PaymentMethod = {
  id: string;
  label: string;
};

type ProfileState = {
  phone: string;
  profileImage: string | null;
  addresses: UserAddress[];
  paymentMethods: PaymentMethod[];
  favoriteItemIds: string[];
  orders: UserOrder[];
  setPhone: (phone: string) => void;
  setProfileImage: (image: string | null) => void;
  addAddress: (type: string, address: string) => void;
  updateAddress: (id: string, type: string, address: string) => void;
  deleteAddress: (id: string) => void;
  addPaymentMethod: (label: string) => void;
  removePaymentMethod: (id: string) => void;
  addOrder: (order: UserOrder) => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      phone: "+91 9876543210",
      profileImage: null,
      addresses: [
        { id: "a1", type: "Home", address: "Flat 12, Nashik Road, Nashik, Maharashtra" },
        { id: "a2", type: "Work", address: "IT Park Building, Nashik, Maharashtra" }
      ],
      paymentMethods: [
        { id: "p1", label: "UPI: rahul@upi" },
        { id: "p2", label: "Card: **** **** **** 1234" }
      ],
      favoriteItemIds: ["misal-pav", "paneer-thali", "veg-biryani"],
      orders: [
        { id: "1045", date: "10 Mar 2026", amount: 350, status: "Delivered", items: ["Misal Pav", "Mango Lassi"] },
        { id: "1046", date: "11 Mar 2026", amount: 120, status: "Preparing", items: ["Misal Pav"] },
        { id: "1047", date: "12 Mar 2026", amount: 540, status: "Out for Delivery", items: ["Paneer Thali", "Veg Biryani"] }
      ],
      setPhone: (phone) => set({ phone }),
      setProfileImage: (profileImage) => set({ profileImage }),
      addAddress: (type, address) =>
        set((state) => ({
          addresses: [{ id: `addr-${Date.now()}`, type, address }, ...state.addresses]
        })),
      updateAddress: (id, type, address) =>
        set((state) => ({
          addresses: state.addresses.map((entry) => (entry.id === id ? { ...entry, type, address } : entry))
        })),
      deleteAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((entry) => entry.id !== id)
        })),
      addPaymentMethod: (label) =>
        set((state) => ({
          paymentMethods: [{ id: `pay-${Date.now()}`, label }, ...state.paymentMethods]
        })),
      removePaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((entry) => entry.id !== id)
        })),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders]
        }))
    }),
    {
      name: "jay-malhar-profile",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

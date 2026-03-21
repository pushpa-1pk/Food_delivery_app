import { api } from "@/lib/api";

export type ApiOrderStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "REJECTED";

export type ApiOrder = {
  id: string;
  orderNumber: number;
  status: ApiOrderStatus;
  totalPrice: number;
  paymentStatus: string;
  paymentMethod: string;
  deliveryAddress: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    menuItem: {
      id: string;
      name: string;
      category: string;
    };
  }>;
  restaurant?: {
    id: string;
    name: string;
    deliveryFee?: number;
    openingHours?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
};

export type CreateOrderPayload = {
  restaurantId: string;
  paymentMethod: "COD" | "ONLINE";
  couponCode?: string;
  items: Array<{ menuItemId: string; quantity: number }>;
  deliveryAddress: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  notes?: string;
};

export async function createOrder(payload: CreateOrderPayload) {
  const response = await api.post("/orders", payload);
  return response.data as {
    data: ApiOrder;
    meta: {
      subtotal: number;
      deliveryFee: number;
      coupon?: {
        code: string;
        discountPercent: number;
        discountAmount: number;
        totalAfterDiscount: number;
      } | null;
      payment: {
        provider: string;
        status: string;
        paymentOrderId: string | null;
        keyId?: string;
        currency?: string;
      };
    };
  };
}

export async function getMyOrders() {
  const response = await api.get("/orders/me");
  return response.data.data as ApiOrder[];
}

export async function getSellerOrders() {
  const response = await api.get("/orders/seller");
  return response.data.data as ApiOrder[];
}

export async function updateOrderStatus(id: string, status: ApiOrderStatus) {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data.data as ApiOrder;
}

export async function validateCoupon(code: string, subtotal: number) {
  const response = await api.get(`/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
  return response.data.data;
}

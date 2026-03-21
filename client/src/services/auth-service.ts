import { api } from "@/lib/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER" | "SELLER";
};

export async function loginUser(payload: LoginPayload) {
  const response = await api.post("/auth/login", payload);
  return response.data.data;
}

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post("/auth/register", payload);
  return response.data.data;
}

export async function forgotPassword(email: string) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function verifyResetOtp(payload: { email: string; token: string }) {
  const response = await api.post("/auth/verify-reset-otp", payload);
  return response.data;
}

export async function resetPassword(payload: { email: string; token: string; password: any }) {
  const response = await api.post("/auth/reset-password", payload);
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data.data;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}
export async function changePassword(payload: any) {
  const response = await api.post("/auth/change-password", payload);
  return response.data;
}

export async function updateSettings(payload: { pushNotifications?: boolean; emailNotifications?: boolean }) {
  const response = await api.patch("/auth/settings", payload);
  return response.data.data;
}

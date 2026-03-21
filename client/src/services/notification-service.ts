import { api } from "@/lib/api";

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  orderId?: string | null;
};

export async function getMyNotifications() {
  const response = await api.get("/notifications/me");
  return response.data.data as AppNotification[];
}

export async function markNotificationRead(id: string) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data.data as AppNotification;
}

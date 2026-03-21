import { catchAsync } from "@/utils/catch-async";
import { ApiError } from "@/utils/api-error";
import { getNotificationsForUser, markNotificationRead } from "@/services/notification.service";
import { prisma } from "@/config/database";

export const getMyNotifications = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const notifications = await getNotificationsForUser(req.user.id, req.user.role);
  res.json({ data: notifications });
});

export const markMyNotificationRead = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const notification = await markNotificationRead(String(req.params.id), req.user.id, req.user.role);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.json({ data: notification });
});

export const deleteMyNotification = catchAsync(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  
  const notificationId = String(req.params.id);
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  
  if (!notification || (notification.userId !== req.user.id && req.user.role !== "ADMIN")) {
    throw new ApiError(404, "Notification not found");
  }

  await prisma.notification.delete({ where: { id: notificationId } });
  res.json({ data: { success: true } });
});

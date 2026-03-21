import { Role } from "@prisma/client";
import { prisma } from "@/config/database";
import { logger } from "@/utils/logger";
import { sendEmail } from "@/services/email.service";
import { env } from "@/config/env";
import { getIo } from "@/services/socket.service";

async function createNotification(input: {
  userId?: string;
  role?: Role;
  type: string;
  title: string;
  message: string;
  orderId?: string;
}) {
  if (input.userId) {
    const count = await prisma.notification.count({ where: { userId: input.userId } });
    if (count >= 100) {
      const oldest = await prisma.notification.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: "asc" },
        take: count - 99
      });
      if (oldest.length) {
        await prisma.notification.deleteMany({
          where: { id: { in: oldest.map((n) => n.id) } }
        });
      }
    }
  }

  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      role: input.role,
      type: input.type,
      title: input.title,
      message: input.message,
      orderId: input.orderId
    }
  });

  try {
    const io = getIo();
    if (input.userId) {
      io.to(input.userId).emit("new_notification", notification);
    } else if (input.role) {
      io.to(`role_${input.role}`).emit("new_notification", notification);
    }
  } catch (err) {
    logger.error("Failed to push socket message", err);
  }

  return notification;
}

export async function notifyAdminNewOrder(orderId: string, orderNumber: number, items: string, customerName: string, totalPrice: number) {
  const message = `New order #${orderNumber} (${items}) from ${customerName} for Rs ${totalPrice}`;
  logger.info(`Admin notification: ${message}`);

  await Promise.all([
    createNotification({
      role: Role.ADMIN,
      type: "NEW_ORDER",
      title: "New order received",
      message,
      orderId
    }),
    createNotification({
      role: Role.SELLER,
      type: "NEW_ORDER",
      title: "New order received",
      message,
      orderId
    })
  ]).catch(() => undefined);

  if (env.smtpHost && env.supportEmail) {
    await sendEmail(
      env.supportEmail,
      `New Jay Malhar order #${orderNumber}`,
      `<p>${message}</p>`
    ).catch(() => undefined);
  }
}

export async function notifyCustomerOrderUpdate(userId: string | undefined, email: string | undefined, orderId: string, orderNumber: number, items: string, status: string) {
  const message = `Your order #${orderNumber} (${items}) is now ${status}`;
  logger.info(`Customer notification: ${message}`);

  if (userId) {
    await createNotification({
      userId,
      type: "ORDER_STATUS",
      title: "Order status updated",
      message,
      orderId
    }).catch(() => undefined);
  }

  if (env.smtpHost && email) {
    await sendEmail(
      email,
      `Your Jay Malhar order #${orderNumber} is now ${status}`,
      `<p>${message}</p>`
    ).catch(() => undefined);
  }
}

export async function getNotificationsForUser(userId: string, role: Role) {
  const where =
    role === Role.CUSTOMER
      ? { userId }
      : role === Role.ADMIN
        ? { OR: [{ role: Role.ADMIN }, { role: Role.SELLER }, { userId }] }
        : { OR: [{ role: Role.SELLER }, { userId }] };

  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20
  });
}

export async function markNotificationRead(notificationId: string, userId: string, role: Role) {
  const notification = await prisma.notification.findFirst({
    where:
      role === Role.CUSTOMER
        ? { id: notificationId, userId }
        : role === Role.ADMIN
          ? { id: notificationId, OR: [{ role: Role.ADMIN }, { role: Role.SELLER }, { userId }] }
          : { id: notificationId, OR: [{ role: Role.SELLER }, { userId }] }
  });

  if (!notification) {
    return null;
  }

  return prisma.notification.update({
    where: { id: notification.id },
    data: { isRead: true }
  });
}

import { OrderStatus, PaymentStatus, Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "@/config/database";
import { catchAsync } from "@/utils/catch-async";
import { orderSchema } from "@/utils/validators";
import { ApiError } from "@/utils/api-error";
import { processPayment } from "@/services/payment.service";
import { validateCoupon } from "@/services/coupon.service";
import { notifyAdminNewOrder, notifyCustomerOrderUpdate } from "@/services/notification.service";

async function findOwnerRestaurant(userId?: string, role?: Role) {
  if (!userId || !role) {
    return null;
  }

  if (role === "SELLER") {
    return prisma.restaurant.findFirst({ where: { sellerId: userId } });
  }

  return prisma.restaurant.findFirst({ where: { status: "APPROVED" } });
}

export const createOrder = catchAsync(async (req, res) => {
  const data = orderSchema.parse(req.body);

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      OR: [{ id: data.restaurantId }, { slug: data.restaurantId }]
    },
    include: { menuItems: true }
  });

  if (!restaurant || !restaurant.isOpen) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Restaurant is closed");
  }

  const menuMap = new Map(restaurant.menuItems.map((item) => [item.id, item]));
  const missingItem = data.items.find((item) => {
    const menuItem = menuMap.get(item.menuItemId);
    return !menuItem || !menuItem.isAvailable;
  });

  if (missingItem) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "One or more items are out of stock");
  }

  const subtotal = data.items.reduce((sum, item) => sum + (menuMap.get(item.menuItemId)?.price || 0) * item.quantity, 0);
  const coupon = data.couponCode ? await validateCoupon(data.couponCode, subtotal) : null;
  const discountedSubtotal = coupon?.totalAfterDiscount ?? subtotal;
  const totalPrice = discountedSubtotal + restaurant.deliveryFee;

  const payment = await processPayment(totalPrice, data.paymentMethod);
  const order = await prisma.order.create({
    data: {
      userId: req.user?.id || "",
      restaurantId: restaurant.id,
      couponId: coupon?.id,
      totalPrice,
      paymentMethod: data.paymentMethod,
      paymentStatus: payment.status === "PAID" ? PaymentStatus.PAID : PaymentStatus.PENDING,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      items: {
        create: data.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuMap.get(item.menuItemId)?.price || 0
        }))
      }
    },
    include: {
      items: { include: { menuItem: true } },
      restaurant: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
      coupon: true
    }
  });

  if (coupon?.id) {
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usageCount: { increment: 1 } }
    });
  }

  // 100-Order Garbage Collection Limit 
  const totalOrders = await prisma.order.count();
  if (totalOrders > 100) {
    const oldestOrders = await prisma.order.findMany({
      orderBy: { createdAt: "asc" },
      take: totalOrders - 100
    });
    
    if (oldestOrders.length > 0) {
      const oldestIds = oldestOrders.map((o) => o.id);
      await prisma.notification.deleteMany({
        where: { orderId: { in: oldestIds } }
      });
      await prisma.order.deleteMany({
        where: { id: { in: oldestIds } }
      });
    }
  }

  const itemNames = order.items.map((i) => i.menuItem.name).join(", ");
  await notifyAdminNewOrder(order.id, order.orderNumber, itemNames, order.user?.name || data.deliveryAddress.fullName, totalPrice);
  await notifyCustomerOrderUpdate(order.user?.id, order.user?.email, order.id, order.orderNumber, itemNames, "Pending");

  res.status(StatusCodes.CREATED).json({
    data: order,
    meta: {
      subtotal,
      deliveryFee: restaurant.deliveryFee,
      coupon,
      payment
    }
  });
});

export const getMyOrders = catchAsync(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user?.id },
    include: {
      items: { include: { menuItem: true } },
      restaurant: true,
      coupon: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({ data: orders });
});

export const getSellerOrders = catchAsync(async (req, res) => {
  const restaurant = await findOwnerRestaurant(req.user?.id, req.user?.role);
  if (!restaurant) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Restaurant not found");
  }

  const orders = await prisma.order.findMany({
    where: { restaurantId: restaurant.id },
    include: {
      items: { include: { menuItem: true } },
      user: { select: { id: true, name: true, email: true, phone: true } },
      coupon: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({ data: orders });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const orderId = String(req.params.id);
  const { status } = req.body as { status: OrderStatus };
  const restaurant = await findOwnerRestaurant(req.user?.id, req.user?.role);

  if (!restaurant) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Restaurant not found");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      restaurantId: restaurant.id
    },
    include: {
      user: { select: { id: true, email: true } }
    }
  });

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status },
    include: {
      items: { include: { menuItem: true } },
      user: { select: { id: true, name: true, email: true, phone: true } },
      restaurant: true,
      coupon: true
    }
  });

  const itemNames = updatedOrder.items.map((i) => i.menuItem.name).join(", ");
  await notifyCustomerOrderUpdate(updatedOrder.user?.id, updatedOrder.user?.email, updatedOrder.id, updatedOrder.orderNumber, itemNames, status.replace(/_/g, " "));

  res.json({ data: updatedOrder });
});

import { prisma } from "@/config/database";
import { catchAsync } from "@/utils/catch-async";
import { ApiError } from "@/utils/api-error";
import { Role } from "@prisma/client";

async function findOwnerRestaurant(userId?: string, role?: Role) {
  if (!userId || !role) {
    return null;
  }

  if (role === "SELLER") {
    return prisma.restaurant.findFirst({ where: { sellerId: userId } });
  }

  return prisma.restaurant.findFirst({ where: { status: "APPROVED" } });
}

export const getDashboard = catchAsync(async (_req, res) => {
  const [users, sellers, orders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalPrice: true } })
  ]);

  res.json({
    data: {
      totalUsers: users,
      totalSellers: sellers,
      totalOrders: orders,
      totalRevenue: revenue._sum.totalPrice || 0
    }
  });
});

export const getOwnerDashboard = catchAsync(async (req, res) => {
  const restaurant = await findOwnerRestaurant(req.user?.id, req.user?.role);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const [menuItems, orders, totalRevenue] = await Promise.all([
    prisma.menuItem.count({ where: { restaurantId: restaurant.id } }),
    prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        items: { include: { menuItem: true } },
        user: { select: { id: true, name: true, email: true, phone: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.order.aggregate({
      where: { restaurantId: restaurant.id },
      _sum: { totalPrice: true }
    })
  ]);

  const uniqueCustomers = new Map(
    orders
      .filter((order) => order.user)
      .map((order) => [order.userId, order.user])
  );

  const popularItems = new Map<string, number>();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const current = popularItems.get(item.menuItem.name) || 0;
      popularItems.set(item.menuItem.name, current + item.quantity);
    });
  });

  const topItems = Array.from(popularItems.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }));

  res.json({
    data: {
      totalOrders: orders.length,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      menuItems,
      customers: uniqueCustomers.size,
      pendingOrders: orders.filter((order) => order.status === "PENDING").length,
      deliveredOrders: orders.filter((order) => order.status === "DELIVERED").length,
      topItems,
      recentOrders: orders.slice(0, 5)
    }
  });
});

export const getOwnerCustomers = catchAsync(async (req, res) => {
  const restaurant = await findOwnerRestaurant(req.user?.id, req.user?.role);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const orders = await prisma.order.findMany({
    where: { restaurantId: restaurant.id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } }
    }
  });

  const customerMap = new Map<string, { id: string; name: string; email: string; phone: string | null; orders: number }>();

  orders.forEach((order) => {
    if (!order.user) {
      return;
    }

    const existing = customerMap.get(order.user.id);
    if (existing) {
      existing.orders += 1;
      return;
    }

    customerMap.set(order.user.id, {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone || null,
      orders: 1
    });
  });

  res.json({ data: Array.from(customerMap.values()) });
});

export const getOwnerAnalytics = catchAsync(async (req, res) => {
  const restaurant = await findOwnerRestaurant(req.user?.id, req.user?.role);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const orders = await prisma.order.findMany({
    where: { restaurantId: restaurant.id },
    include: {
      items: { include: { menuItem: true } }
    },
    orderBy: { createdAt: "asc" }
  });

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const weeklyCutoff = new Date(now);
  weeklyCutoff.setDate(now.getDate() - 6);
  const monthlyCutoff = new Date(now.getFullYear(), now.getMonth(), 1);

  const dailyRevenueMap = new Map<string, number>();
  const weeklySalesMap = new Map<string, number>();
  const monthlyOrderMap = new Map<string, number>();
  const topItemsMap = new Map<string, number>();

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const dayKey = date.toISOString().slice(0, 10);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    dailyRevenueMap.set(dayKey, (dailyRevenueMap.get(dayKey) || 0) + order.totalPrice);

    if (date >= weeklyCutoff) {
      weeklySalesMap.set(dayKey, (weeklySalesMap.get(dayKey) || 0) + order.totalPrice);
    }

    if (date >= monthlyCutoff) {
      monthlyOrderMap.set(dayKey, (monthlyOrderMap.get(dayKey) || 0) + 1);
    }

    order.items.forEach((item) => {
      topItemsMap.set(item.menuItem.name, (topItemsMap.get(item.menuItem.name) || 0) + item.quantity);
    });
  });

  res.json({
    data: {
      todaysRevenue: dailyRevenueMap.get(todayKey) || 0,
      weeklyRevenue: Array.from(weeklySalesMap.entries()).map(([date, revenue]) => ({ date, revenue })),
      dailyRevenue: Array.from(dailyRevenueMap.entries()).slice(-7).map(([date, revenue]) => ({ date, revenue })),
      monthlyOrders: Array.from(monthlyOrderMap.entries()).map(([date, count]) => ({ date, count })),
      topItems: Array.from(topItemsMap.entries())
        .sort((left, right) => right[1] - left[1])
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }))
    }
  });
});

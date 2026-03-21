import { Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "@/config/database";
import { catchAsync } from "@/utils/catch-async";
import { menuItemSchema, menuItemUpdateSchema } from "@/utils/validators";
import { ApiError } from "@/utils/api-error";

async function findOwnerRestaurant(userId?: string, role?: Role) {
  if (!userId || !role) {
    return null;
  }

  if (role === "SELLER") {
    return prisma.restaurant.findFirst({ where: { sellerId: userId } });
  }

  return prisma.restaurant.findFirst({ where: { status: "APPROVED" } });
}

async function ensureOwnerMenuItemAccess(menuItemId: string, userId?: string, role?: Role) {
  const restaurant = await findOwnerRestaurant(userId, role);
  if (!restaurant) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Restaurant not found for owner");
  }

  const item = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      restaurantId: restaurant.id
    }
  });

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Menu item not found");
  }

  return { restaurant, item };
}

export const addMenuItem = catchAsync(async (req, res) => {
  const restaurant = await findOwnerRestaurant(req.user?.id, req.user?.role);

  if (!restaurant) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Restaurant not found for owner");
  }

  const data = menuItemSchema.parse(req.body);
  const item = await prisma.menuItem.create({
    data: {
      ...data,
      restaurantId: restaurant.id
    }
  });

  res.status(StatusCodes.CREATED).json({ data: item });
});

export const updateMenuItem = catchAsync(async (req, res) => {
  const itemId = String(req.params.id);
  const { item } = await ensureOwnerMenuItemAccess(itemId, req.user?.id, req.user?.role);
  const data = menuItemUpdateSchema.parse(req.body);

  const updatedItem = await prisma.menuItem.update({
    where: { id: item.id },
    data
  });

  res.json({ data: updatedItem });
});

export const toggleMenuItem = catchAsync(async (req, res) => {
  const itemId = String(req.params.id);
  const { item } = await ensureOwnerMenuItemAccess(itemId, req.user?.id, req.user?.role);

  const updatedItem = await prisma.menuItem.update({
    where: { id: item.id },
    data: { isAvailable: !item.isAvailable }
  });

  res.json({ data: updatedItem });
});

export const deleteMenuItem = catchAsync(async (req, res) => {
  const itemId = String(req.params.id);
  const { item } = await ensureOwnerMenuItemAccess(itemId, req.user?.id, req.user?.role);

  await prisma.menuItem.delete({ where: { id: item.id } });

  res.json({ message: "Menu item deleted" });
});

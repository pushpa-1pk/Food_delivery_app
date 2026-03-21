import { RestaurantStatus, Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "@/config/database";
import { catchAsync } from "@/utils/catch-async";
import { ownerRestaurantUpdateSchema, restaurantSchema } from "@/utils/validators";
import { ApiError } from "@/utils/api-error";

async function findOwnerRestaurant(userId?: string, role?: Role) {
  if (!userId || !role) {
    return null;
  }

  if (role === "SELLER") {
    return prisma.restaurant.findFirst({
      where: { sellerId: userId },
      include: {
        menuItems: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true } }
          }
        }
      }
    });
  }

  return prisma.restaurant.findFirst({
    where: { status: RestaurantStatus.APPROVED },
    include: {
      menuItems: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true } }
        }
      }
    }
  });
}

export const getRestaurants = catchAsync(async (req, res) => {
  const { search, category } = req.query as { search?: string; category?: string };
  const restaurants = await prisma.restaurant.findMany({
    where: {
      status: RestaurantStatus.APPROVED,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(category ? { categories: { has: category } } : {})
    },
    include: {
      menuItems: true,
      seller: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  res.json({ data: restaurants });
});

export const getRestaurantById = catchAsync(async (req, res) => {
  const restaurantId = String(req.params.id);
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      OR: [{ id: restaurantId }, { slug: restaurantId }]
    },
    include: {
      menuItems: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true } }
        }
      }
    }
  });

  if (!restaurant) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Restaurant not found");
  }

  res.json({ data: restaurant });
});

export const getOwnerRestaurant = catchAsync(async (req, res) => {
  const restaurant = await findOwnerRestaurant(req.user?.id, req.user?.role);

  if (!restaurant) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Restaurant not found");
  }

  res.json({ data: restaurant });
});

export const createRestaurant = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const data = restaurantSchema.parse(req.body);
  const existing = await prisma.restaurant.findFirst({ where: { sellerId: req.user.id } });

  if (existing) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Single-restaurant mode allows one restaurant per seller");
  }

  const slug = data.name.toLowerCase().replace(/\s+/g, "-");
  const restaurant = await prisma.restaurant.create({
    data: {
      ...data,
      sellerId: req.user.id,
      slug
    }
  });

  res.status(StatusCodes.CREATED).json({ data: restaurant });
});

export const updateOwnerRestaurant = catchAsync(async (req, res) => {
  const existing = await findOwnerRestaurant(req.user?.id, req.user?.role);

  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Restaurant not found");
  }

  const data = ownerRestaurantUpdateSchema.parse(req.body);
  const updatedRestaurant = await prisma.restaurant.update({
    where: { id: existing.id },
    data: {
      ...data,
      slug: data.name ? data.name.toLowerCase().replace(/\s+/g, "-") : existing.slug
    },
    include: {
      menuItems: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true } }
        }
      }
    }
  });

  res.json({ data: updatedRestaurant });
});

export const updateRestaurantStatus = catchAsync(async (req, res) => {
  const restaurantId = String(req.params.id);
  const { status } = req.body as { status: RestaurantStatus };
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      OR: [{ id: restaurantId }, { slug: restaurantId }]
    }
  });

  if (!restaurant) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Restaurant not found");
  }

  const updatedRestaurant = await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { status }
  });

  res.json({ data: updatedRestaurant });
});

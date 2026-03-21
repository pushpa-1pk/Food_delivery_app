import { StatusCodes } from "http-status-codes";
import { prisma } from "@/config/database";
import { catchAsync } from "@/utils/catch-async";
import { reviewSchema } from "@/utils/validators";

export const createReview = catchAsync(async (req, res) => {
  const data = reviewSchema.parse(req.body);
  
  // Find if a review already exists for this user + restaurant + (menuItem if applicable)
  const existing = await prisma.review.findFirst({
    where: {
      userId: req.user?.id || "",
      restaurantId: data.restaurantId,
      menuItemId: data.menuItemId || null
    }
  });

  let review;
  if (existing) {
    review = await prisma.review.update({
      where: { id: existing.id },
      data: {
        rating: data.rating,
        comment: data.comment
      }
    });
  } else {
    review = await prisma.review.create({
      data: {
        restaurantId: data.restaurantId,
        menuItemId: data.menuItemId || null,
        rating: data.rating,
        comment: data.comment,
        userId: req.user?.id || ""
      }
    });
  }

  res.status(StatusCodes.CREATED).json({ data: review });
});

export const getRestaurantReviews = catchAsync(async (req, res) => {
  const restaurantId = String(req.params.restaurantId);
  const menuItemId = req.query.menuItemId ? String(req.query.menuItemId) : undefined;

  const reviews = await prisma.review.findMany({
    where: { 
      restaurantId,
      menuItemId: menuItemId === "undefined" || !menuItemId ? null : menuItemId
    },
    include: {
      user: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({ data: reviews });
});

import { Router } from "express";
import { createReview, getRestaurantReviews } from "@/controllers/review.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";

const router = Router();

router.get("/:restaurantId", getRestaurantReviews);
router.post("/", authenticate, authorize("CUSTOMER", "ADMIN"), createReview);

export default router;

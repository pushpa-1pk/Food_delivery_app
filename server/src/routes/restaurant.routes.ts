import { Router } from "express";
import {
  createRestaurant,
  getOwnerRestaurant,
  getRestaurantById,
  getRestaurants,
  updateOwnerRestaurant,
  updateRestaurantStatus
} from "@/controllers/restaurant.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";

const router = Router();

router.get("/", getRestaurants);
router.get("/owner/me", authenticate, authorize("SELLER", "ADMIN"), getOwnerRestaurant);
router.patch("/owner/me", authenticate, authorize("SELLER", "ADMIN"), updateOwnerRestaurant);
router.get("/:id", getRestaurantById);
router.post("/", authenticate, authorize("SELLER"), createRestaurant);
router.patch("/:id/status", authenticate, authorize("ADMIN"), updateRestaurantStatus);

export default router;

import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus
} from "@/controllers/order.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";

const router = Router();

router.post("/", authenticate, authorize("CUSTOMER", "ADMIN", "SELLER"), createOrder);
router.get("/me", authenticate, authorize("CUSTOMER", "ADMIN", "SELLER"), getMyOrders);
router.get("/seller", authenticate, authorize("SELLER", "ADMIN"), getSellerOrders);
router.patch("/:id/status", authenticate, authorize("SELLER", "ADMIN"), updateOrderStatus);

export default router;

import { Router } from "express";
import { validateCouponCode } from "@/controllers/coupon.controller";

const router = Router();

router.get("/validate", validateCouponCode);

export default router;

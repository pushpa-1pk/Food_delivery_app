import { Router } from "express";
import { getDashboard, getOwnerAnalytics, getOwnerCustomers, getOwnerDashboard } from "@/controllers/admin.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";

const router = Router();

router.get("/dashboard", authenticate, authorize("ADMIN"), getDashboard);
router.get("/owner/dashboard", authenticate, authorize("SELLER", "ADMIN"), getOwnerDashboard);
router.get("/owner/customers", authenticate, authorize("SELLER", "ADMIN"), getOwnerCustomers);
router.get("/owner/analytics", authenticate, authorize("SELLER", "ADMIN"), getOwnerAnalytics);

export default router;

import { Router } from "express";
import { addMenuItem, deleteMenuItem, toggleMenuItem, updateMenuItem } from "@/controllers/menu.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";

const router = Router();

router.post("/", authenticate, authorize("SELLER", "ADMIN"), addMenuItem);
router.put("/:id", authenticate, authorize("SELLER", "ADMIN"), updateMenuItem);
router.patch("/:id/toggle", authenticate, authorize("SELLER", "ADMIN"), toggleMenuItem);
router.delete("/:id", authenticate, authorize("SELLER", "ADMIN"), deleteMenuItem);

export default router;

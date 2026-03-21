import { Router } from "express";
import { getMyNotifications, markMyNotificationRead, deleteMyNotification } from "@/controllers/notification.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMyNotifications);
router.patch("/:id/read", authenticate, markMyNotificationRead);
router.delete("/:id", authenticate, deleteMyNotification);

export default router;

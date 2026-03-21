import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPassword,
  verifyEmail,
  verifyResetOtp,
  changePassword,
  updateSettings
} from "@/controllers/auth.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authRateLimiter } from "@/middlewares/rate-limiter.middleware";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/change-password", authenticate, changePassword);
router.patch("/settings", authenticate, updateSettings);
router.get("/me", authenticate, me);

export default router;

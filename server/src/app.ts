import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import authRoutes from "@/routes/auth.routes";
import restaurantRoutes from "@/routes/restaurant.routes";
import menuRoutes from "@/routes/menu.routes";
import orderRoutes from "@/routes/order.routes";
import reviewRoutes from "@/routes/review.routes";
import adminRoutes from "@/routes/admin.routes";
import couponRoutes from "@/routes/coupon.routes";
import uploadRoutes from "@/routes/upload.routes";
import notificationRoutes from "@/routes/notification.routes";
import { errorHandler } from "@/middlewares/error-handler.middleware";
import { env } from "@/config/env";
import { swaggerSpec } from "@/docs/swagger";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/make-me-owner", async (_req, res) => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const db = new PrismaClient();
      await db.user.update({
        where: { email: 'jaymalhartaste@gmail.com' },
        data: { role: 'ADMIN' }
      });
      res.json({ success: true, message: "ACCOUNT UPGRADED! YOU ARE NOW AN ADMIN. PLEASE DELETE THIS CODE FROM app.ts NOW." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/auth", authRoutes);
  app.use("/api/restaurants", restaurantRoutes);
  app.use("/api/menu", menuRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/notifications", notificationRoutes);

  app.use(errorHandler);

  return app;
}

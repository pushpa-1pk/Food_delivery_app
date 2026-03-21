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

  app.get("/api/seed-restaurant", async (_req, res) => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const db = new PrismaClient();
      
      const admin = await db.user.findUnique({ where: { email: 'jaymalhartaste@gmail.com' } });
      if (!admin) {
        return res.status(404).json({ error: "Admin account not found. Please register first." });
      }

      const existing = await db.restaurant.findFirst();
      if (existing) {
        return res.json({ success: true, message: "Restaurant already exists!", data: existing });
      }

      const restaurant = await db.restaurant.create({
        data: {
          sellerId: admin.id,
          name: "Jay Malhar",
          slug: "jay-malhar",
          description: "Authentic taste and delicious food delivery.",
          address: "Main Road",
          city: "Pune",
          openingHours: "9:00 AM - 11:00 PM",
          status: "APPROVED",
          categories: ["Veg", "Non-Veg", "Chinese"],
          images: ["/logo.jpeg"]
        }
      });

      res.json({ success: true, message: "MASTER RESTAURANT SEEDED! PLEASE DELETE THIS CODE FROM app.ts NOW.", data: restaurant });
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

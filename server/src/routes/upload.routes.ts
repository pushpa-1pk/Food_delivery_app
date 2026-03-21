import { Router } from "express";
import { getUploadSignature } from "@/controllers/upload.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";

const router = Router();

router.get("/signature", authenticate, authorize("SELLER", "ADMIN"), getUploadSignature);

export default router;

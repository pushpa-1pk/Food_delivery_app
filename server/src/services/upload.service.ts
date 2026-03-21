import crypto from "crypto";
import { env } from "@/config/env";
import { ApiError } from "@/utils/api-error";

export async function getCloudinaryUploadSignature(folder = "jay-malhar") {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new ApiError(500, "Cloudinary is not configured correctly");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${env.cloudinaryApiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex");

  return {
    cloudName: env.cloudinaryCloudName,
    apiKey: env.cloudinaryApiKey,
    timestamp,
    folder,
    signature,
    uploadUrl: `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`
  };
}

export async function uploadImage(fileName: string) {
  return {
    url: `https://res.cloudinary.com/${env.cloudinaryCloudName || "demo"}/image/upload/${fileName}`
  };
}

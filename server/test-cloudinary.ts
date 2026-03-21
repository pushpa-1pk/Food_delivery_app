import { v2 as cloudinary } from "cloudinary";
import { env } from "./src/config/env";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret
});

async function run() {
  console.log("Configured Cloud:", env.cloudinaryCloudName);
  try {
    const res = await cloudinary.uploader.upload("https://picsum.photos/200/300", {
      folder: "jay-malhar/test"
    });
    console.log("Success:", res.secure_url);
  } catch (err) {
    console.error("Upload error:", err);
  }
}

run();

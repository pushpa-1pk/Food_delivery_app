import { catchAsync } from "@/utils/catch-async";
import { getCloudinaryUploadSignature } from "@/services/upload.service";

export const getUploadSignature = catchAsync(async (req, res) => {
  const folder = typeof req.query.folder === "string" ? req.query.folder : "jay-malhar";
  const data = await getCloudinaryUploadSignature(folder);
  res.json({ data });
});

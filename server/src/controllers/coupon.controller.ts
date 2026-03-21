import { catchAsync } from "@/utils/catch-async";
import { validateCoupon } from "@/services/coupon.service";

export const validateCouponCode = catchAsync(async (req, res) => {
  const code = String(req.query.code || "");
  const subtotal = Number(req.query.subtotal || 0);
  const coupon = validateCoupon(code, subtotal);

  if (!coupon) {
    return res.status(404).json({ message: "Coupon is not valid" });
  }

  res.json({ data: coupon });
});

import { prisma } from "@/config/database";

export type CouponResult = {
  id: string;
  code: string;
  discountPercent: number;
  discountAmount: number;
  subtotal: number;
  totalAfterDiscount: number;
};

export async function validateCoupon(code: string, subtotal: number): Promise<CouponResult | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized || subtotal <= 0) {
    return null;
  }

  const coupon = await prisma.coupon.findFirst({
    where: {
      code: normalized,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
    }
  });

  if (!coupon) {
    return null;
  }

  const discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
  return {
    id: coupon.id,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    discountAmount,
    subtotal,
    totalAfterDiscount: Math.max(subtotal - discountAmount, 0)
  };
}

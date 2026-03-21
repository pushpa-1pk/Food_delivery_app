import crypto from "crypto";
import { ApiError } from "@/utils/api-error";
import { env } from "@/config/env";

export async function processPayment(totalPrice: number, method: string) {
  if (method === "COD") {
    return {
      provider: "cash-on-delivery",
      status: "PENDING",
      paymentOrderId: null,
      amount: totalPrice
    };
  }

  if (totalPrice <= 0) {
    throw new ApiError(400, "Invalid payment amount");
  }

  if (env.paymentProvider === "razorpay") {
    if (!env.razorpayKeyId || !env.razorpayKeySecret) {
      throw new ApiError(500, "Razorpay is not configured correctly");
    }

    return {
      provider: "razorpay",
      status: "PENDING",
      paymentOrderId: `order_${crypto.randomBytes(10).toString("hex")}`,
      amount: totalPrice,
      keyId: env.razorpayKeyId,
      currency: "INR"
    };
  }

  return {
    provider: "mock-gateway",
    status: "PAID",
    paymentOrderId: `mock_${crypto.randomBytes(8).toString("hex")}`,
    amount: totalPrice
  };
}

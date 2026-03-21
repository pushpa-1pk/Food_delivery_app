import bcrypt from "bcryptjs";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { prisma } from "@/config/database";
import { catchAsync } from "@/utils/catch-async";
import { loginSchema, registerSchema } from "@/utils/validators";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/utils/tokens";
import { ApiError } from "@/utils/api-error";
import { sendEmail } from "@/services/email.service";

function setAuthCookies(res: any, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax", secure: false });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "lax", secure: false });
}

export const register = catchAsync(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });

  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "Email already in use");
  }

  const password = await bcrypt.hash(data.password, 10);
  const emailVerifyToken = crypto.randomBytes(24).toString("hex");
  const user = await prisma.user.create({
    data: {
      ...data,
      password,
      emailVerifyToken
    }
  });

  await sendEmail(
    user.email,
    "Verify your Jay Malhar account",
    `<p>Use this token to verify your email: <strong>${emailVerifyToken}</strong></p>`
  );

  res.status(StatusCodes.CREATED).json({
    message: "Registration successful. Please verify your email.",
    data: { id: user.id, email: user.email, role: user.role }
  });
});

export const login = catchAsync(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  setAuthCookies(res, accessToken, refreshToken);

  res.json({
    message: "Login successful",
    data: {
      user: payload,
      accessToken
    }
  });
});

export const refresh = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token missing");
  }

  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.id } });

  if (!user || user.refreshToken !== token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
  res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax", secure: false });
  res.json({ message: "Token refreshed", data: { accessToken } });
});

export const logout = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const payload = verifyRefreshToken(token);
    await prisma.user.update({
      where: { id: payload.id },
      data: { refreshToken: null }
    }).catch(() => undefined);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.body as { token: string };
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid verification token");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null
    }
  });

  res.json({ message: "Email verified successfully" });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body as { email: string };
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    res.json({ message: "If the account exists, reset instructions have been sent." });
    return;
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      passwordResetToken: resetToken,
      passwordResetTokenExpires: new Date(Date.now() + 5 * 60 * 1000)
    }
  });

  await sendEmail(
    user.email,
    "Reset your Jay Malhar password",
    `<p>Your OTP to reset your password is: <strong>${resetToken}</strong>. It will expire shortly.</p>`
  );

  res.json({ message: "If the account exists, reset instructions have been sent." });
});

export const verifyResetOtp = catchAsync(async (req, res) => {
  const { email, token } = req.body as { email: string; token: string };
  const user = await prisma.user.findFirst({
    where: { 
      email,
      passwordResetToken: token,
      passwordResetTokenExpires: { gt: new Date() }
    }
  });

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP");
  }

  res.json({ message: "OTP verified successfully", success: true });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { email, token, password } = req.body as { email: string; token: string; password: string };
  const user = await prisma.user.findFirst({ 
    where: { 
      email, 
      passwordResetToken: token,
      passwordResetTokenExpires: { gt: new Date() }
    } 
  });

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid reset token");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
      refreshToken: null
    }
  });

  res.json({ message: "Password reset successful" });
});

export const me = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      pushNotifications: true,
      emailNotifications: true
    }
  });

  res.json({ data: user });
});

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user?.id } });

  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Incorrect current password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, refreshToken: null }
  });

  res.json({ message: "Password updated successfully. Please login again." });
});

export const updateSettings = catchAsync(async (req, res) => {
  const { pushNotifications, emailNotifications } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user?.id },
    data: {
      pushNotifications: pushNotifications ?? undefined,
      emailNotifications: emailNotifications ?? undefined
    }
  });
  res.json({ message: "Settings updated successfully", data: user });
});

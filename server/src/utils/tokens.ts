import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "@/config/env";

type TokenPayload = {
  id: string;
  email: string;
  role: Role;
};

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn } as SignOptions);
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn } as SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwtAccessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;
}

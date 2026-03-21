import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

let io: SocketIOServer;

export function initSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"]
    }
  });

  io.use((socket, next) => {
    const cookiesStr = socket.handshake.headers.cookie;
    let token = socket.handshake.auth?.token;
    
    if (!token && cookiesStr) {
      token = cookiesStr.split(';').map(c => c.trim()).find(c => c.startsWith('accessToken='))?.split('=')[1];
    }

    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, env.jwtAccessSecret) as { id: string, role: string };
      socket.data.user = { userId: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user?.userId;
    const role = socket.data.user?.role;
    
    if (userId) {
      socket.join(userId);
      logger.info(`Socket connected and joined individual room: ${userId}`);
    }
    if (role) {
      socket.join(`role_${role}`);
      logger.info(`Socket joined role room: role_${role}`);
    }

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${userId}`);
    });
  });

  return io;
}

export function getIo() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

import { createApp } from "./app";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { initSocket } from "@/services/socket.service";
import http from "http";

const app = createApp();
const server = http.createServer(app);
initSocket(server);

server.listen(env.port, () => {
  logger.info(`Server running on http://localhost:${env.port}`);
});

import { createServer } from "node:http";

import { Server } from "socket.io";

import { loadServerConfig } from "@slow-dating/config";

import { createApp } from "./app.js";
import { createAuth } from "./auth.js";
import { LocalRepository } from "./localRepository.js";
import { PrismaRepository } from "./prismaRepository.js";
import {
  type ClientToServerEvents,
  registerRealtime,
  type ServerToClientEvents,
} from "./realtime.js";

const config = loadServerConfig(process.env);
const repository =
  config.STORAGE_DRIVER === "postgres"
    ? new PrismaRepository(config.DATABASE_URL)
    : new LocalRepository(config.DATA_FILE);
await repository.initialize();

const auth = createAuth(config.AUTH_SECRET, repository);
const app = createApp({
  auth,
  repository,
  storageDriver: config.STORAGE_DRIVER,
  webOrigin: config.WEB_ORIGIN,
});
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: config.WEB_ORIGIN,
    methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"],
});

registerRealtime(io, repository, auth);

httpServer.listen(config.PORT, "0.0.0.0", () => {
  console.log(
    `Slow Dating API listening on http://localhost:${config.PORT} (${config.STORAGE_DRIVER})`,
  );
});

function shutdown() {
  io.close(() => {
    httpServer.close(() => {
      process.exit(0);
    });
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

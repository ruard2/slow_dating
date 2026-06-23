import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

import { Server } from "socket.io";

import { loadServerConfig } from "@slow-dating/config";

// Laad een lokale .env (repo-root of apps/api) indien aanwezig, zodat geheimen
// zoals OPENAI_API_KEY niet in de shell of in git hoeven te staan.
for (const relative of ["../.env", "../../../.env"]) {
  try {
    process.loadEnvFile(fileURLToPath(new URL(relative, import.meta.url)));
  } catch {
    // Geen .env op dit pad — prima.
  }
}

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
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: false,
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
    httpServer.close(async () => {
      await repository.close();
      process.exit(0);
    });
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

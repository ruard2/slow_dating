import { createServer } from "node:http";

import { Server } from "socket.io";

import { loadServerConfig } from "@slow-dating/config";

import { createApp } from "./app.js";

const config = loadServerConfig(process.env);
const app = createApp({
  webOrigin: config.WEB_ORIGIN,
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.WEB_ORIGIN,
    methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"],
});

io.on("connection", (socket) => {
  socket.emit("system:ready", {
    socketId: socket.id,
  });
});

httpServer.listen(config.PORT, "0.0.0.0", () => {
  console.log(`Slow Dating API listening on http://localhost:${config.PORT}`);
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

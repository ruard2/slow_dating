import type { Server } from "socket.io";

import { realtimeClientEventSchema } from "@slow-dating/contracts";

import type { AppRepository } from "./domain.js";
import type { ReturnTypeCreateAuth } from "./types.js";

interface SocketData {
  installationId: string;
  pairId: string | null;
}

interface RealtimeAcknowledgement {
  ok: boolean;
  duplicate?: boolean;
  error?: string;
}

export interface ClientToServerEvents {
  event(
    event: unknown,
    acknowledge?: (result: RealtimeAcknowledgement) => void,
  ): void;
}

export interface ServerToClientEvents {
  event(event: unknown): void;
  "system:ready"(payload: {
    socketId: string;
    installationId: string;
    pairId: string | null;
  }): void;
}

export function registerRealtime(
  io: Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>,
  repository: AppRepository,
  auth: ReturnTypeCreateAuth,
) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.accessToken;
      if (typeof token !== "string") {
        throw new Error("Token ontbreekt.");
      }
      const installationId = await auth.verifyToken(token);
      const pair = await repository.getPairForInstallation(installationId);
      socket.data.installationId = installationId;
      socket.data.pairId = pair?.id ?? null;
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const { installationId, pairId } = socket.data;
    if (pairId) {
      await repository.markPresence(installationId, true);
      await socket.join(`pair:${pairId}`);
      socket.to(`pair:${pairId}`).emit("event", {
        id: `presence:${installationId}:${Date.now()}`,
        type: "pair.presence",
        version: 1,
        pairId,
        sentAt: new Date().toISOString(),
        payload: { installationId, online: true },
      });
    }

    socket.emit("system:ready", {
      socketId: socket.id,
      installationId,
      pairId,
    });

    socket.on("event", async (rawEvent, acknowledge) => {
      const reply =
        typeof acknowledge === "function" ? acknowledge : () => undefined;
      try {
        const event = realtimeClientEventSchema.parse(rawEvent);
        const currentPair =
          await repository.getPairForInstallation(installationId);
        if (!currentPair || currentPair.id !== socket.data.pairId) {
          reply({ ok: false, error: "pair_required" });
          return;
        }
        if (currentPair.members.length !== 2) {
          reply({ ok: false, error: "complete_pair_required" });
          return;
        }
        if (await repository.hasProcessedEvent(event.id)) {
          reply({ ok: true, duplicate: true });
          return;
        }

        if (event.type === "chat.send") {
          const message = await repository.createMessage(
            installationId,
            event.payload.clientId,
            event.payload.text,
          );
          io.to(`pair:${currentPair.id}`).emit("event", {
            id: event.id,
            type: "chat.message",
            version: 1,
            pairId: currentPair.id,
            sentAt: message.sentAt,
            payload: message,
          });
        } else {
          if (event.type === "call.signal") {
            const callAccess = await repository.getCallAccess(installationId);
            if (!callAccess.unlocked) {
              reply({ ok: false, error: "call_locked" });
              return;
            }
          }
          socket.to(`pair:${currentPair.id}`).emit("event", {
            ...event,
            pairId: currentPair.id,
            sentAt: new Date().toISOString(),
            senderInstallationId: installationId,
          });
        }

        await repository.markEventProcessed(event.id);
        reply({ ok: true });
      } catch {
        reply({ ok: false, error: "invalid_event" });
      }
    });

    socket.on("disconnect", () => {
      void repository.markPresence(installationId, false);
      if (!pairId) {
        return;
      }
      socket.to(`pair:${pairId}`).emit("event", {
        id: `presence:${installationId}:${Date.now()}`,
        type: "pair.presence",
        version: 1,
        pairId,
        sentAt: new Date().toISOString(),
        payload: { installationId, online: false },
      });
    });
  });
}

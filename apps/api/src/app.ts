import { fileURLToPath } from "node:url";

import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import { ZodError } from "zod";

import {
  createGameRunSchema,
  guestSessionRequestSchema,
  joinPairSchema,
  sendMessageSchema,
  updateGameRunSchema,
  updateProfileSchema,
} from "@slow-dating/contracts";

import type { AuthenticatedRequest } from "./auth.js";
import type { ReturnTypeCreateAuth } from "./types.js";
import type { AppRepository } from "./domain.js";
import { DomainError } from "./domain.js";
import {
  legacyCommBridge,
  legacySdClientBridge,
} from "./legacyBridgeScripts.js";

const legacyFrontendDirectory = fileURLToPath(
  new URL("../../../legacy/koppel-frontend/", import.meta.url),
);

export interface CreateAppOptions {
  auth: ReturnTypeCreateAuth;
  repository: AppRepository;
  storageDriver: "local" | "postgres";
  webOrigin: string;
}

function installationId(request: Request) {
  return (request as AuthenticatedRequest).installationId;
}

export function createApp({
  auth,
  repository,
  storageDriver,
  webOrigin,
}: CreateAppOptions) {
  const app = express();

  app.disable("x-powered-by");
  app.get("/legacy/sd-client.js", (_request, response) => {
    response.type("application/javascript").send(legacySdClientBridge);
  });
  app.get("/legacy/comm.js", (_request, response) => {
    response.type("application/javascript").send(legacyCommBridge);
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false,
    }),
  );
  app.use(cors({ origin: webOrigin }));
  app.use(express.json({ limit: "250kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({
      ok: true,
      service: "api",
      version: "0.2.0",
      storage: storageDriver,
    });
  });

  app.post("/api/auth/guest", async (request, response) => {
    const input = guestSessionRequestSchema.parse(request.body);
    response
      .status(201)
      .json(await auth.createGuestSession(input.installationSecret));
  });

  app.get("/api/profile", auth.requireAuth, async (request, response) => {
    response.json(await repository.getProfile(installationId(request)));
  });

  app.patch("/api/profile", auth.requireAuth, async (request, response) => {
    const input = updateProfileSchema.parse(request.body);
    const changes = {
      ...(input.displayName === undefined
        ? {}
        : { displayName: input.displayName }),
      ...(input.bio === undefined ? {} : { bio: input.bio }),
      ...(input.avatarColor === undefined
        ? {}
        : { avatarColor: input.avatarColor }),
    };
    response.json(
      await repository.updateProfile(installationId(request), changes),
    );
  });

  app.get("/api/pairs/current", auth.requireAuth, async (request, response) => {
    response.json(
      await repository.getPairForInstallation(installationId(request)),
    );
  });

  app.post("/api/pairs", auth.requireAuth, async (request, response) => {
    response
      .status(201)
      .json(await repository.createPair(installationId(request)));
  });

  app.post("/api/pairs/join", auth.requireAuth, async (request, response) => {
    const { code } = joinPairSchema.parse(request.body);
    response.json(await repository.joinPair(installationId(request), code));
  });

  app.delete("/api/pairs/current", auth.requireAuth, async (request, response) => {
    await repository.disconnectPair(installationId(request));
    response.status(204).end();
  });

  app.get("/api/messages", auth.requireAuth, async (request, response) => {
    response.json(await repository.listMessages(installationId(request)));
  });

  app.post("/api/messages", auth.requireAuth, async (request, response) => {
    const input = sendMessageSchema.parse(request.body);
    response
      .status(201)
      .json(
        await repository.createMessage(
          installationId(request),
          input.clientId,
          input.text,
        ),
      );
  });

  app.post("/api/game-runs", auth.requireAuth, async (request, response) => {
    const input = createGameRunSchema.parse(request.body);
    response
      .status(201)
      .json(
        await repository.createGameRun(installationId(request), input),
      );
  });

  app.get("/api/progress", auth.requireAuth, async (request, response) => {
    response.json(
      await repository.getWorldProgress(installationId(request)),
    );
  });

  app.patch(
    "/api/game-runs/:runId",
    auth.requireAuth,
    async (request, response) => {
      const input = updateGameRunSchema.parse(request.body);
      const runId = request.params.runId;
      if (typeof runId !== "string") {
        throw new DomainError("Ongeldige spelsessie.", 400);
      }
      const changes = {
        ...(input.state === undefined ? {} : { state: input.state }),
        ...(input.result === undefined ? {} : { result: input.result }),
        ...(input.status === undefined ? {} : { status: input.status }),
      };
      response.json(
        await repository.updateGameRun(
          installationId(request),
          runId,
          changes,
        ),
      );
    },
  );

  app.use(
    "/legacy",
    express.static(legacyFrontendDirectory, {
      fallthrough: false,
      index: false,
    }),
  );

  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction,
    ) => {
      void _next;
      if (error instanceof ZodError) {
        response.status(400).json({
          error: "Ongeldige invoer.",
          issues: error.issues,
        });
        return;
      }
      if (error instanceof DomainError) {
        response.status(error.statusCode).json({ error: error.message });
        return;
      }
      console.error(error);
      response.status(500).json({ error: "Onverwachte serverfout." });
    },
  );

  return app;
}

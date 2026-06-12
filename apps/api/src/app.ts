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
  activityEventSchema,
  callConsentRequestSchema,
  completePasswordResetSchema,
  createGameRunSchema,
  guestSessionRequestSchema,
  gameActionRequestSchema,
  joinPairSchema,
  loginSchema,
  profileDataExportSchema,
  profileInsightsSchema,
  recordActivitySchema,
  registerAccountSchema,
  requestPasswordResetSchema,
  relationshipGameResultSchema,
  sendMessageSchema,
  updateGameRunSchema,
  updateProfileSchema,
  verifyEmailSchema,
  waitingAnswerRequestSchema,
  waitingSessionRequestSchema,
} from "@slow-dating/contracts";
import { findPlayableGame } from "@slow-dating/content";

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

const REFRESH_COOKIE = "slow_dating_refresh";

function readCookie(request: Request, name: string) {
  const cookies = request.header("cookie")?.split(";") ?? [];
  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(value.join("="));
    }
  }
  return undefined;
}

function setRefreshCookie(response: Response, token: string) {
  response.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1_000,
    path: "/api/auth",
  });
}

function createRateLimiter(limit: number, windowMs: number) {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  return (request: Request, response: Response, next: NextFunction) => {
    const key = `${request.ip}:${request.path}`;
    const timestamp = Date.now();
    const current = attempts.get(key);
    if (!current || current.resetAt <= timestamp) {
      attempts.set(key, { count: 1, resetAt: timestamp + windowMs });
      next();
      return;
    }
    if (current.count >= limit) {
      response.setHeader(
        "retry-after",
        Math.ceil((current.resetAt - timestamp) / 1_000),
      );
      response.status(429).json({ error: "Te veel pogingen. Probeer later opnieuw." });
      return;
    }
    current.count += 1;
    next();
  };
}

export function createApp({
  auth,
  repository,
  storageDriver,
  webOrigin,
}: CreateAppOptions) {
  const app = express();
  const authRateLimit = createRateLimiter(
    process.env.NODE_ENV === "production" ? 10 : 1_000,
    15 * 60 * 1_000,
  );

  app.disable("x-powered-by");
  app.get("/legacy/sd-client.js", (_request, response) => {
    response
      .set("Cache-Control", "no-store")
      .type("application/javascript")
      .send(legacySdClientBridge);
  });
  app.get("/legacy/comm.js", (_request, response) => {
    response
      .set("Cache-Control", "no-store")
      .type("application/javascript")
      .send(legacyCommBridge);
  });
  app.get("/legacy/world.html", (_request, response) => {
    response
      .type("html")
      .send("<!doctype html><script>top.location.replace('/')</script>");
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false,
    }),
  );
  app.use(cors({ origin: webOrigin, credentials: true }));
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

  app.post("/api/auth/register", authRateLimit, auth.requireAuth, async (request, response) => {
    const input = registerAccountSchema.parse(request.body);
    const result = await auth.register(installationId(request), input);
    setRefreshCookie(response, result.refreshToken);
    response.status(201).json(result.session);
  });

  app.post("/api/auth/login", authRateLimit, async (request, response) => {
    const input = loginSchema.parse(request.body);
    const result = await auth.login(input.email, input.password);
    setRefreshCookie(response, result.refreshToken);
    response.json(result.session);
  });

  app.post("/api/auth/refresh", async (request, response) => {
    const refreshToken = readCookie(request, REFRESH_COOKIE);
    if (!refreshToken) {
      response.status(204).end();
      return;
    }
    const result = await auth.refresh(refreshToken);
    setRefreshCookie(response, result.refreshToken);
    response.json(result.session);
  });

  app.post("/api/auth/logout", async (request, response) => {
    await auth.logout(readCookie(request, REFRESH_COOKIE));
    response.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
    response.status(204).end();
  });

  app.post("/api/auth/verify-email", async (request, response) => {
    const input = verifyEmailSchema.parse(request.body);
    response.json(await auth.verifyEmail(input.token));
  });

  app.post("/api/auth/password-reset/request", authRateLimit, async (request, response) => {
    const input = requestPasswordResetSchema.parse(request.body);
    await auth.requestPasswordReset(input.email);
    response.status(202).json({ accepted: true });
  });

  app.post("/api/auth/password-reset/complete", authRateLimit, async (request, response) => {
    const input = completePasswordResetSchema.parse(request.body);
    await auth.resetPassword(input.token, input.password);
    response.status(204).end();
  });

  if (storageDriver === "local" && process.env.NODE_ENV !== "production") {
    app.get("/api/dev/mail-outbox", async (_request, response) => {
      response.json(await repository.listDevelopmentMail());
    });
  }

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

  app.get("/api/profile/activity", auth.requireAuth, async (request, response) => {
    response.json(await repository.listActivity(installationId(request)));
  });

  app.get("/api/profile/insights", auth.requireAuth, async (request, response) => {
    response.json(
      profileInsightsSchema.parse(
        await repository.getProfileInsights(installationId(request)),
      ),
    );
  });

  app.get("/api/profile/export", auth.requireAuth, async (request, response) => {
    const ownerId = installationId(request);
    const archives = await repository.listRelationshipArchives(ownerId);
    const currentPair = await repository.getPairForInstallation(ownerId);
    response.json(
      profileDataExportSchema.parse({
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        profile: await repository.getProfile(ownerId),
        insights: await repository.getProfileInsights(ownerId),
        currentRelationship: currentPair
          ? {
              pair: currentPair,
              messages: await repository.listRelationshipMessages(
                ownerId,
                currentPair.id,
              ),
              results: await repository.listRelationshipGameResults(
                ownerId,
                currentPair.id,
              ),
            }
          : null,
        relationships: await Promise.all(
          archives.map(async (archive) => ({
            archive,
            messages: await repository.listRelationshipMessages(
              ownerId,
              archive.id,
            ),
            results: await repository.listRelationshipGameResults(
              ownerId,
              archive.id,
            ),
          })),
        ),
        activity: await repository.listActivity(ownerId),
      }),
    );
  });

  app.post("/api/profile/activity", auth.requireAuth, async (request, response) => {
    const input = recordActivitySchema.parse(request.body);
    response.status(201).json(
      activityEventSchema.parse(
        await repository.recordActivity(installationId(request), {
          clientEventId: input.clientEventId,
          category: input.category,
          type: input.type,
          payload: input.payload,
          ...(input.gameRunId === undefined
            ? {}
            : { gameRunId: input.gameRunId }),
        }),
      ),
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

  app.post("/api/pairs/developer", auth.requireAuth, async (request, response) => {
    if (process.env.NODE_ENV === "production") {
      throw new DomainError("Beheerdersmodus is lokaal niet beschikbaar.", 404);
    }
    response
      .status(201)
      .json(await repository.activateDeveloperPair(installationId(request)));
  });

  app.post("/api/pairs/join", auth.requireAuth, async (request, response) => {
    const { code } = joinPairSchema.parse(request.body);
    response.json(await repository.joinPair(installationId(request), code));
  });

  app.delete("/api/pairs/current", auth.requireAuth, async (request, response) => {
    await repository.disconnectPair(installationId(request));
    response.status(204).end();
  });

  app.get("/api/relationships/archives", auth.requireAuth, async (request, response) => {
    response.json(
      await repository.listRelationshipArchives(installationId(request)),
    );
  });

  app.get(
    "/api/relationships/:pairId/messages",
    auth.requireAuth,
    async (request, response) => {
      const pairId = request.params.pairId;
      if (typeof pairId !== "string") {
        throw new DomainError("Ongeldig relatiearchief.", 400);
      }
      response.json(
        await repository.listRelationshipMessages(
          installationId(request),
          pairId,
        ),
      );
    },
  );

  app.get(
    "/api/relationships/:pairId/results",
    auth.requireAuth,
    async (request, response) => {
      const pairId = request.params.pairId;
      if (typeof pairId !== "string") {
        throw new DomainError("Ongeldig relatiearchief.", 400);
      }
      response.json(
        relationshipGameResultSchema.array().parse(
          await repository.listRelationshipGameResults(
            installationId(request),
            pairId,
          ),
        ),
      );
    },
  );

  app.post(
    "/api/game-runs/:runId/actions",
    auth.requireAuth,
    async (request, response) => {
      const runId = request.params.runId;
      if (typeof runId !== "string") {
        throw new DomainError("Ongeldige spelsessie.", 400);
      }
      const action = gameActionRequestSchema.parse(request.body);
      response.status(201).json(
        await repository.applyGameAction(
          installationId(request),
          runId,
          {
            id: action.id,
            expectedRevision: action.expectedRevision,
            type: action.type,
            payload: action.payload,
            state: action.state,
            ...(action.status === undefined ? {} : { status: action.status }),
            ...(action.result === undefined ? {} : { result: action.result }),
          },
        ),
      );
    },
  );

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
    const game = findPlayableGame(input.gameId);
    if (!game) {
      throw new DomainError("Dit spel is nog niet beschikbaar.", 404);
    }
    if (input.version !== game.version) {
      throw new DomainError("Deze spelversie wordt niet ondersteund.", 409);
    }
    response
      .status(201)
      .json(
        await repository.createGameRun(installationId(request), {
          gameId: game.id,
          mode: "couple",
          version: game.version,
        }),
      );
  });

  app.get(
    "/api/game-runs/active/:gameId",
    auth.requireAuth,
    async (request, response) => {
      const gameId = request.params.gameId;
      if (typeof gameId !== "string" || !gameId) {
        throw new DomainError("Ongeldig spel.", 400);
      }
      response.json(
        await repository.getActiveGameRun(installationId(request), gameId),
      );
    },
  );

  app.get("/api/progress", auth.requireAuth, async (request, response) => {
    response.json(
      await repository.getWorldProgress(installationId(request)),
    );
  });

  app.post("/api/waiting/session/start", auth.requireAuth, async (request, response) => {
    const input = waitingSessionRequestSchema.parse(request.body);
    await repository.startWaitingSession(installationId(request), input.gameRunId);
    response.status(204).end();
  });

  app.post("/api/waiting/session/end", auth.requireAuth, async (request, response) => {
    const input = waitingSessionRequestSchema.parse(request.body);
    await repository.endWaitingSession(installationId(request), input.gameRunId);
    response.status(204).end();
  });

  app.post("/api/waiting/answers", auth.requireAuth, async (request, response) => {
    const input = waitingAnswerRequestSchema.parse(request.body);
    await repository.saveWaitingAnswer(installationId(request), input);
    response.status(204).end();
  });

  app.get("/api/waiting/stats", auth.requireAuth, async (request, response) => {
    response.json(await repository.getWaitingStats(installationId(request)));
  });

  app.post(
    "/api/worlds/:world/purchase",
    auth.requireAuth,
    async (request, response) => {
      if (process.env.NODE_ENV === "production") {
        throw new DomainError(
          "Aankopen worden in productie uitsluitend via de betaalprovider bevestigd.",
          501,
        );
      }
      const world = Number(request.params.world);
      response.json(
        await repository.purchaseWorld(installationId(request), world),
      );
    },
  );

  app.get("/api/calls/access", auth.requireAuth, async (request, response) => {
    response.json(await repository.getCallAccess(installationId(request)));
  });

  app.post("/api/calls/access/request", auth.requireAuth, async (request, response) => {
    response.json(await repository.requestCallAccess(installationId(request)));
  });

  app.post("/api/calls/access/answer", auth.requireAuth, async (request, response) => {
    const input = callConsentRequestSchema.parse(request.body);
    response.json(
      await repository.answerCallAccess(
        installationId(request),
        input.answer,
      ),
    );
  });

  app.delete("/api/calls/access", auth.requireAuth, async (request, response) => {
    response.json(await repository.relockCalls(installationId(request)));
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

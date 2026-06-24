
import { fileURLToPath } from "node:url";

import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import { z, ZodError } from "zod";

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
  createBlockSchema,
  createReportSchema,
  createRouteInvitationSchema,
  respondRouteInvitationSchema,
  sendMessageSchema,
  updateGameRunSchema,
  updateProfileSchema,
  verifyEmailSchema,
  waitingAnswerRequestSchema,
  waitingSessionRequestSchema,
} from "@slow-dating/contracts";
import { findPlayableGame } from "@slow-dating/content";

import { aiProfileEnabled, augmentInsightsWithAi } from "./aiProfile.js";

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

const dateSummaryRequestSchema = z.object({
  objects: z.array(
    z.object({
      label: z.string().min(1).max(80),
      category: z.string().min(1).max(80),
      tags: z.array(z.string().max(40)).max(12).default([]),
      christian: z.boolean().default(false),
    }),
  ).min(2).max(16),
});

const dateSummaryResponseSchema = z.object({
  summary: z.string().min(1).max(900),
});

const DATE_SUMMARY_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
  },
  required: ["summary"],
} as const;

const DATE_SUMMARY_SYSTEM_PROMPT = `Je schrijft voor een slow-dating-app een korte date-samenvatting in het Nederlands.

DOEL:
- Maak van de gekozen objecten één echt uitvoerbaar date-idee.
- Het moet klinken alsof iemand met smaak en een beetje humor dit aan het stel teruggeeft.
- Licht, warm, nuchter, speels. Niet therapeutisch.

VASTE START:
- De tekst begint exact met: "Jullie date:"

BELANGRIJK:
- Som de objecten NIET mechanisch op.
- Noem niet alles. Kies 4 tot 7 objecten die samen een logisch plan vormen.
- Groepeer dingen natuurlijk: eten/drinken, buiten, actief, knus, cultuur, geloof.
- Als keuzes botsen, maak daar mild grappig iets van.
- Als er veel eten/drinken gekozen is, benoem dat luchtig zonder te oordelen.
- Als christelijke objecten gekozen zijn, verwerk geloof natuurlijk en warm, zonder preektoon.
- Geen analyse van hun relatie.
- Geen zinnen als "dit zegt dat jullie..." of "jullie zijn duidelijk...".
- Geen cliché-eindzin zoals "een date om nooit te vergeten".
- Maximaal 75 woorden.

STIJL:
- Eenvoudig Nederlands.
- Concreet genoeg om uit te voeren.
- Mag één droog grapje bevatten.
- Niet te zoet, niet zalvend, niet poëtisch doen om het poëtisch doen.

OUTPUT:
- Geef uitsluitend JSON volgens het schema.`;

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
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowed = [webOrigin, "capacitor://localhost", "http://localhost"];
        callback(null, !origin || allowed.includes(origin));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "250kb" }));
  app.use("/api", (_request, response, next) => {
    response.set("Cache-Control", "no-store");
    next();
  });

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
    const changes = updateProfileSchema.parse(request.body);
    response.json(
      await repository.updateProfile(installationId(request), changes),
    );
  });

  app.get("/api/profile/activity", auth.requireAuth, async (request, response) => {
    response.json(await repository.listActivity(installationId(request)));
  });

  app.get("/api/profile/insights", auth.requireAuth, async (request, response) => {
    const ownerId = installationId(request);
    let insights = await repository.getProfileInsights(ownerId);
    if (aiProfileEnabled()) {
      const pair = await repository.getPairForInstallation(ownerId);
      if (pair && pair.members.length === 2) {
        const owner = pair.members.find((m) => m.installationId === ownerId);
        const partner = pair.members.find((m) => m.installationId !== ownerId);
        const results = await repository.listRelationshipGameResults(
          ownerId,
          pair.id,
        );
        const tempo = await repository.getPairTempo(pair.id);
        const facts = (p: {
          coreValues: string[];
          interests: string[];
          relationIntention: string | null;
          lifeStage: string | null;
          christianLayer: boolean;
        }) => ({
          kernwaarden: p.coreValues,
          interesses: p.interests,
          relatie_intentie: p.relationIntention,
          levensfase: p.lifeStage,
          christelijke_laag: p.christianLayer,
        });
        const ownerProfile = await repository.getProfile(ownerId);
        const partnerProfile = partner
          ? await repository.getProfile(partner.installationId)
          : null;
        const partnerId = partner?.installationId ?? "";
        const ownerFacts = facts(ownerProfile);
        const partnerFacts = partnerProfile ? facts(partnerProfile) : undefined;
        insights = await augmentInsightsWithAi(insights, results, {
          ownerId,
          ownerName: owner?.displayName ?? "jij",
          partnerId,
          partnerName: partner?.displayName ?? "je partner",
          tempo,
          ownerProfile: ownerFacts,
          ...(partnerFacts ? { partnerProfile: partnerFacts } : {}),
        });
      }
    }
    response.json(profileInsightsSchema.parse(insights));
  });

  app.get("/api/introductions", auth.requireAuth, async (request, response) => {
    response.json(
      await repository.suggestIntroductions(installationId(request)),
    );
  });

  app.get(
    "/api/route-invitations",
    auth.requireAuth,
    async (request, response) => {
      response.json(
        await repository.listRouteInvitations(installationId(request)),
      );
    },
  );

  app.post(
    "/api/route-invitations",
    auth.requireAuth,
    async (request, response) => {
      const input = createRouteInvitationSchema.parse(request.body);
      response.status(201).json(
        await repository.createRouteInvitation(
          installationId(request),
          input.toInstallationId,
          input.message,
        ),
      );
    },
  );

  app.post(
    "/api/route-invitations/:id/respond",
    auth.requireAuth,
    async (request, response) => {
      const input = respondRouteInvitationSchema.parse(request.body);
      response.json(
        await repository.respondToRouteInvitation(
          installationId(request),
          String(request.params.id),
          input.accept,
        ),
      );
    },
  );

  app.get("/api/blocks", auth.requireAuth, async (request, response) => {
    response.json(
      await repository.listBlockedInstallationIds(installationId(request)),
    );
  });

  app.post("/api/blocks", auth.requireAuth, async (request, response) => {
    const input = createBlockSchema.parse(request.body);
    await repository.blockInstallation(
      installationId(request),
      input.installationId,
    );
    response.status(204).end();
  });

  app.post("/api/reports", auth.requireAuth, async (request, response) => {
    const input = createReportSchema.parse(request.body);
    await repository.reportInstallation(
      installationId(request),
      input.installationId,
      input.reason,
      input.note,
    );
    response.status(204).end();
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

  app.post("/api/ai/date-summary", auth.requireAuth, async (request, response) => {
    const input = dateSummaryRequestSchema.parse(request.body);
    if (!process.env.OPENAI_API_KEY) {
      console.warn("[date-summary] OPENAI_API_KEY ontbreekt; frontend gebruikt fallback.");
      throw new DomainError("AI-samenvatting is lokaal niet ingesteld.", 503);
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const result = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model:
            process.env.AI_DATE_MODEL ??
            process.env.AI_PROFILE_MODEL ??
            "gpt-4o",
          messages: [
            { role: "system", content: DATE_SUMMARY_SYSTEM_PROMPT },
            {
              role: "user",
              content: JSON.stringify({
                opdracht:
                  "Maak een korte samenvatting van deze gezamenlijk geplande date. Gebruik de volgorde als lichte indicatie, maar maak er vooral een soepel, uitvoerbaar plan van.",
                gekozen_objecten_in_volgorde: input.objects.map((object, index) => ({
                  volgorde: index + 1,
                  label: object.label,
                  categorie: object.category,
                  tags: object.tags,
                  christelijk: object.christian,
                })),
              }),
            },
          ],
          temperature: 0.72,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "kleine_date_samenvatting",
              strict: true,
              schema: DATE_SUMMARY_RESPONSE_SCHEMA,
            },
          },
        }),
      });
      if (!result.ok) {
        const detail = await result.text().catch(() => "");
        console.warn(
          `[date-summary] OpenAI gaf ${result.status}: ${detail.slice(0, 500)}`,
        );
        throw new DomainError("AI-samenvatting lukte niet.", 502);
      }
      const data = (await result.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content ?? "{}";
      response.json(dateSummaryResponseSchema.parse(JSON.parse(text)));
    } finally {
      clearTimeout(timeout);
    }
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

  if (process.env.NODE_ENV === "production") {
    const webDist = fileURLToPath(
      new URL("../../../apps/web/dist/", import.meta.url),
    );
    app.use(express.static(webDist, { maxAge: "7d" }));
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (
        req.path.startsWith("/api/") ||
        req.path.startsWith("/legacy/") ||
        req.path.startsWith("/socket.io/")
      ) {
        next();
        return;
      }
      res.sendFile("index.html", { root: webDist });
    });
  }

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

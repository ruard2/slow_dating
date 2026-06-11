import { z } from "zod";

import {
  callAccessSchema,
  gameRunSchema,
  guestSessionSchema,
  messageSchema,
  pairSchema,
  profileSchema,
  relationshipArchiveSchema,
  worldProgressSchema,
  type GuestSession,
} from "@slow-dating/contracts";

let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestInit = {},
) {
  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(body.error ?? `API-fout ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return schema.parse(await response.json());
}

export async function startGuestSession(): Promise<GuestSession> {
  const storageKey = "slow-dating-installation-secret";
  let installationSecret = localStorage.getItem(storageKey);
  if (!installationSecret) {
    installationSecret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem(storageKey, installationSecret);
  }
  const session = await request(
    "/api/auth/guest",
    guestSessionSchema,
    {
      method: "POST",
      body: JSON.stringify({ installationSecret }),
    },
  );
  setAccessToken(session.accessToken);
  return session;
}

export async function refreshAccountSession(): Promise<GuestSession> {
  const session = await request(
    "/api/auth/refresh",
    guestSessionSchema.optional(),
    { method: "POST", body: "{}" },
  );
  if (!session) {
    throw new Error("Geen bestaande accountsessie.");
  }
  setAccessToken(session.accessToken);
  return session;
}

export const api = {
  register: (input: {
    email: string;
    password: string;
    displayName: string;
  }) =>
    request("/api/auth/register", guestSessionSchema, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (email: string, password: string) =>
    request("/api/auth/login", guestSessionSchema, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request("/api/auth/logout", z.undefined(), {
      method: "POST",
      body: "{}",
    }),
  requestPasswordReset: (email: string) =>
    request("/api/auth/password-reset/request", z.object({ accepted: z.literal(true) }), {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  completePasswordReset: (token: string, password: string) =>
    request("/api/auth/password-reset/complete", z.undefined(), {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  verifyEmail: (token: string) =>
    request("/api/auth/verify-email", guestSessionSchema, {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  getProfile: () => request("/api/profile", profileSchema),
  updateProfile: (changes: Record<string, string>) =>
    request("/api/profile", profileSchema, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }),
  getPair: () => request("/api/pairs/current", pairSchema.nullable()),
  createPair: () =>
    request("/api/pairs", pairSchema, { method: "POST", body: "{}" }),
  activateDeveloperPair: () =>
    request("/api/pairs/developer", pairSchema, {
      method: "POST",
      body: "{}",
    }),
  joinPair: (code: string) =>
    request("/api/pairs/join", pairSchema, {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  disconnectPair: () =>
    request("/api/pairs/current", z.undefined(), { method: "DELETE" }),
  getRelationshipArchives: () =>
    request("/api/relationships/archives", z.array(relationshipArchiveSchema)),
  getRelationshipMessages: (pairId: string) =>
    request(`/api/relationships/${pairId}/messages`, z.array(messageSchema)),
  getMessages: () => request("/api/messages", z.array(messageSchema)),
  sendMessage: (clientId: string, text: string) =>
    request("/api/messages", messageSchema, {
      method: "POST",
      body: JSON.stringify({ clientId, text }),
    }),
  createGameRun: (gameId: string, version: number) =>
    request("/api/game-runs", gameRunSchema, {
      method: "POST",
      body: JSON.stringify({ gameId, mode: "couple", version }),
    }),
  getActiveGameRun: (gameId: string) =>
    request(`/api/game-runs/active/${encodeURIComponent(gameId)}`, gameRunSchema.nullable()),
  completeGameRun: (runId: string, result: Record<string, unknown> = {}) =>
    request(`/api/game-runs/${runId}`, gameRunSchema, {
      method: "PATCH",
      body: JSON.stringify({ status: "completed", result }),
    }),
  getProgress: () => request("/api/progress", worldProgressSchema),
  purchaseWorld: (world: number) =>
    request(`/api/worlds/${world}/purchase`, worldProgressSchema, {
      method: "POST",
      body: "{}",
    }),
  getCallAccess: () => request("/api/calls/access", callAccessSchema),
  requestCallAccess: () =>
    request("/api/calls/access/request", callAccessSchema, {
      method: "POST",
      body: "{}",
    }),
  answerCallAccess: (answer: "yes" | "no") =>
    request("/api/calls/access/answer", callAccessSchema, {
      method: "POST",
      body: JSON.stringify({ answer }),
    }),
  relockCalls: () =>
    request("/api/calls/access", callAccessSchema, { method: "DELETE" }),
};

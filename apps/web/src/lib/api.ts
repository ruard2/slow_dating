import { z } from "zod";

import {
  gameRunSchema,
  guestSessionSchema,
  messageSchema,
  pairSchema,
  profileSchema,
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

export const api = {
  getProfile: () => request("/api/profile", profileSchema),
  updateProfile: (changes: Record<string, string>) =>
    request("/api/profile", profileSchema, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }),
  getPair: () => request("/api/pairs/current", pairSchema.nullable()),
  createPair: () =>
    request("/api/pairs", pairSchema, { method: "POST", body: "{}" }),
  joinPair: (code: string) =>
    request("/api/pairs/join", pairSchema, {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  disconnectPair: () =>
    request("/api/pairs/current", z.undefined(), { method: "DELETE" }),
  getMessages: () => request("/api/messages", z.array(messageSchema)),
  sendMessage: (clientId: string, text: string) =>
    request("/api/messages", messageSchema, {
      method: "POST",
      body: JSON.stringify({ clientId, text }),
    }),
  createGameRun: (gameId: string, mode: "solo" | "couple", version: number) =>
    request("/api/game-runs", gameRunSchema, {
      method: "POST",
      body: JSON.stringify({ gameId, mode, version }),
    }),
};

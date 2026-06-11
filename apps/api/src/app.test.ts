import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "./app.js";
import { createAuth } from "./auth.js";
import { LocalRepository } from "./localRepository.js";

async function createTestApp() {
  const repository = new LocalRepository(
    join(tmpdir(), `slow-dating-${randomUUID()}.json`),
  );
  await repository.initialize();
  const auth = createAuth(
    "test-secret-with-at-least-thirty-two-characters",
    repository,
  );
  return createApp({
    auth,
    repository,
    storageDriver: "local",
    webOrigin: "http://localhost:5173",
  });
}

describe("Slow Dating API", () => {
  it("returns the typed health response", async () => {
    const response = await request(await createTestApp()).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      service: "api",
      version: "0.2.0",
      storage: "local",
    });
  });

  it("creates a guest session and only updates its own profile", async () => {
    const app = await createTestApp();
    const session = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "a".repeat(64) });

    expect(session.status).toBe(201);
    const updated = await request(app)
      .patch("/api/profile")
      .set("authorization", `Bearer ${session.body.accessToken}`)
      .send({ displayName: "Ruard" });

    expect(updated.status).toBe(200);
    expect(updated.body.displayName).toBe("Ruard");
    expect(updated.body.id).toBe(session.body.installationId);
  });
});

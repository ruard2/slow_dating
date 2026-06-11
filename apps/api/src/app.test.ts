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

  it("completes a game run idempotently and never reopens it", async () => {
    const app = await createTestApp();
    const session = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "z".repeat(64) });
    const auth = { authorization: `Bearer ${session.body.accessToken}` };
    const created = await request(app)
      .post("/api/game-runs")
      .set(auth)
      .send({ gameId: "waarden", mode: "solo", version: 1 });

    const completed = await request(app)
      .patch(`/api/game-runs/${created.body.id}`)
      .set(auth)
      .send({ status: "completed", result: { answer: 1 } });
    const repeated = await request(app)
      .patch(`/api/game-runs/${created.body.id}`)
      .set(auth)
      .send({ status: "completed", result: { answer: 2 } });
    const reopened = await request(app)
      .patch(`/api/game-runs/${created.body.id}`)
      .set(auth)
      .send({ status: "active" });
    const progress = await request(app).get("/api/progress").set(auth);

    expect(completed.status).toBe(200);
    expect(repeated.status).toBe(200);
    expect(repeated.body.result).toEqual({ answer: 1 });
    expect(reopened.status).toBe(409);
    expect(progress.body.completedGames).toBe(1);
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

  it("registers an account and rotates its refresh session", async () => {
    const app = await createTestApp();
    const agent = request.agent(app);
    const guest = await agent
      .post("/api/auth/guest")
      .send({ installationSecret: "b".repeat(64) });

    const registered = await agent
      .post("/api/auth/register")
      .set("authorization", `Bearer ${guest.body.accessToken}`)
      .send({
        displayName: "Account Tester",
        email: "account@example.test",
        password: "Professioneel123",
      });

    expect(registered.status).toBe(201);
    expect(registered.body.account.email).toBe("account@example.test");
    expect(registered.headers["set-cookie"]?.[0]).toContain("HttpOnly");

    const refreshed = await agent.post("/api/auth/refresh").send({});
    expect(refreshed.status).toBe(200);
    expect(refreshed.body.installationId).toBe(guest.body.installationId);
  });

  it("verifies email and resets a password with one-time tokens", async () => {
    const app = await createTestApp();
    const guest = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "e".repeat(64) });
    await request(app)
      .post("/api/auth/register")
      .set("authorization", `Bearer ${guest.body.accessToken}`)
      .send({
        displayName: "Recovery Tester",
        email: "recovery@example.test",
        password: "OudWachtwoord123",
      });
    const verificationMail = await request(app).get("/api/dev/mail-outbox");
    const verifyToken = verificationMail.body.find(
      (mail: { type: string }) => mail.type === "verify_email",
    ).token;
    const verified = await request(app)
      .post("/api/auth/verify-email")
      .send({ token: verifyToken });
    expect(verified.body.account.emailVerified).toBe(true);

    await request(app)
      .post("/api/auth/password-reset/request")
      .send({ email: "recovery@example.test" });
    const resetMail = await request(app).get("/api/dev/mail-outbox");
    const resetToken = resetMail.body.findLast(
      (mail: { type: string }) => mail.type === "password_reset",
    ).token;
    const reset = await request(app)
      .post("/api/auth/password-reset/complete")
      .send({ token: resetToken, password: "NieuwWachtwoord456" });
    expect(reset.status).toBe(204);

    const reused = await request(app)
      .post("/api/auth/password-reset/complete")
      .send({ token: resetToken, password: "NogEenWachtwoord789" });
    expect(reused.status).toBe(400);
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "recovery@example.test", password: "NieuwWachtwoord456" });
    expect(login.status).toBe(200);
  });

  it("blocks chat until a pair has two members and archives on disconnect", async () => {
    const app = await createTestApp();
    const first = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "c".repeat(64) });
    const second = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "d".repeat(64) });
    const firstAuth = { authorization: `Bearer ${first.body.accessToken}` };
    const secondAuth = { authorization: `Bearer ${second.body.accessToken}` };
    const pair = await request(app).post("/api/pairs").set(firstAuth).send({});

    const blocked = await request(app)
      .post("/api/messages")
      .set(firstAuth)
      .send({ clientId: "before-pair", text: "Te vroeg" });
    expect(blocked.status).toBe(409);

    await request(app)
      .post("/api/pairs/join")
      .set(secondAuth)
      .send({ code: pair.body.code });
    const callAccess = await request(app).get("/api/calls/access").set(firstAuth);
    expect(callAccess.body).toMatchObject({
      completedGames: 0,
      conditionsMet: false,
      unlocked: false,
    });
    const prematureCallRequest = await request(app)
      .post("/api/calls/access/request")
      .set(firstAuth)
      .send({});
    expect(prematureCallRequest.status).toBe(409);
    const prematureWorldPurchase = await request(app)
      .post("/api/worlds/2/purchase")
      .set(firstAuth)
      .send({});
    expect(prematureWorldPurchase.status).toBe(403);
    await request(app)
      .post("/api/messages")
      .set(firstAuth)
      .send({ clientId: "after-pair", text: "Bewaard bericht" });
    await request(app).delete("/api/pairs/current").set(firstAuth);

    const archives = await request(app)
      .get("/api/relationships/archives")
      .set(firstAuth);
    expect(archives.status).toBe(200);
    expect(archives.body[0].messageCount).toBe(1);
    expect(archives.body[0].disconnectedAt).toBeTruthy();
  });
});

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
    expect(response.headers["cache-control"]).toBe("no-store");
  });

  it("completes a game run idempotently and never reopens it", async () => {
    const app = await createTestApp();
    const session = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "z".repeat(64) });
    const partner = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "y".repeat(64) });
    const auth = { authorization: `Bearer ${session.body.accessToken}` };
    const partnerAuth = {
      authorization: `Bearer ${partner.body.accessToken}`,
    };
    const pair = await request(app).post("/api/pairs").set(auth).send({});
    await request(app)
      .post("/api/pairs/join")
      .set(partnerAuth)
      .send({ code: pair.body.code });
    const lobby = await request(app)
      .post("/api/game-runs")
      .set(auth)
      .send({ gameId: "waarden", mode: "couple", version: 2 });
    const created = await request(app)
      .post("/api/game-runs")
      .set(partnerAuth)
      .send({ gameId: "waarden", mode: "couple", version: 2 });
    const completionId = randomUUID();

    const completed = await request(app)
      .post(`/api/game-runs/${created.body.id}/actions`)
      .set(auth)
      .send({
        id: completionId,
        expectedRevision: created.body.revision,
        type: "waarden.completed",
        payload: { answer: 1 },
        state: { ...created.body.state, answer: 1 },
        status: "completed",
        result: { answer: 1 },
      });
    const repeated = await request(app)
      .post(`/api/game-runs/${created.body.id}/actions`)
      .set(auth)
      .send({
        id: completionId,
        expectedRevision: created.body.revision,
        type: "waarden.completed",
        payload: { answer: 2 },
        state: { ...created.body.state, answer: 2 },
        status: "completed",
        result: { answer: 2 },
      });
    const reopened = await request(app)
      .patch(`/api/game-runs/${created.body.id}`)
      .set(auth)
      .send({ status: "active" });
    const progress = await request(app).get("/api/progress").set(auth);

    expect(lobby.body.status).toBe("lobby");
    expect(created.body.status).toBe("active");
    expect(completed.status).toBe(201);
    expect(repeated.status).toBe(201);
    expect(repeated.body.result).toEqual({ answer: 1 });
    expect(reopened.status).toBe(409);
    expect(progress.body.completedGames).toBe(1);
  });

  it("persists game actions idempotently and rejects stale revisions", async () => {
    const app = await createTestApp();
    const first = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "r".repeat(64) });
    const second = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "s".repeat(64) });
    const outsider = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "t".repeat(64) });
    const firstAuth = {
      authorization: `Bearer ${first.body.accessToken}`,
    };
    const secondAuth = {
      authorization: `Bearer ${second.body.accessToken}`,
    };
    const outsiderAuth = {
      authorization: `Bearer ${outsider.body.accessToken}`,
    };
    const pair = await request(app).post("/api/pairs").set(firstAuth).send({});
    await request(app)
      .post("/api/pairs/join")
      .set(secondAuth)
      .send({ code: pair.body.code });
    const lobby = await request(app)
      .post("/api/game-runs")
      .set(firstAuth)
      .send({ gameId: "waarden", mode: "couple", version: 2 });
    const run = await request(app)
      .post("/api/game-runs")
      .set(secondAuth)
      .send({ gameId: "waarden", mode: "couple", version: 2 });
    const action = {
      id: randomUUID(),
      expectedRevision: run.body.revision,
      type: "waarden.choice.selected",
      payload: { value: "eerlijkheid" },
      state: {
        ...run.body.state,
        selections: { [first.body.installationId]: ["eerlijkheid"] },
      },
    };

    const applied = await request(app)
      .post(`/api/game-runs/${run.body.id}/actions`)
      .set(firstAuth)
      .send(action)
      .expect(201);
    const duplicate = await request(app)
      .post(`/api/game-runs/${run.body.id}/actions`)
      .set(firstAuth)
      .send(action)
      .expect(201);
    await request(app)
      .post(`/api/game-runs/${run.body.id}/actions`)
      .set(secondAuth)
      .send({
        ...action,
        id: randomUUID(),
        payload: { value: "vrijheid" },
      })
      .expect(409);
    await request(app)
      .post(`/api/game-runs/${run.body.id}/actions`)
      .set(outsiderAuth)
      .send({
        ...action,
        id: randomUUID(),
        expectedRevision: applied.body.revision,
      })
      .expect(404);
    const restored = await request(app)
      .get("/api/game-runs/active/waarden")
      .set(secondAuth)
      .expect(200);

    expect(applied.body.revision).toBe(run.body.revision + 1);
    expect(lobby.body.status).toBe("lobby");
    expect(run.body.status).toBe("active");
    expect(duplicate.body.revision).toBe(applied.body.revision);
    expect(restored.body.state).toEqual(action.state);
  });

  it("stores central waiting-room activity and returns personal stats", async () => {
    const app = await createTestApp();
    const first = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "w".repeat(64) });
    const second = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "v".repeat(64) });
    const firstAuth = {
      authorization: `Bearer ${first.body.accessToken}`,
    };
    const secondAuth = {
      authorization: `Bearer ${second.body.accessToken}`,
    };
    const pair = await request(app).post("/api/pairs").set(firstAuth).send({});
    await request(app)
      .post("/api/pairs/join")
      .set(secondAuth)
      .send({ code: pair.body.code });
    const run = await request(app)
      .post("/api/game-runs")
      .set(firstAuth)
      .send({ gameId: "waarden", mode: "couple", version: 2 });

    await request(app)
      .post("/api/waiting/session/start")
      .set(firstAuth)
      .send({ gameRunId: run.body.id })
      .expect(204);
    await request(app)
      .post("/api/waiting/answers")
      .set(firstAuth)
      .send({
        gameRunId: run.body.id,
        waitingGameId: "fluitvogel-test",
        answerId: "merel",
        answerLabel: "Merel",
        shareLevel: "soft_share",
      })
      .expect(204);

    const stats = await request(app)
      .get("/api/waiting/stats")
      .set(firstAuth)
      .expect(200);

    expect(stats.body.totalWaitCount).toBe(1);
    expect(stats.body.totalGamesPlayed).toBe(1);
    expect(stats.body.recentGameIds).toEqual(["fluitvogel-test"]);

    await request(app)
      .post("/api/waiting/session/end")
      .set(firstAuth)
      .send({ gameRunId: run.body.id })
      .expect(204);

    const recorded = await request(app)
      .post("/api/profile/activity")
      .set(firstAuth)
      .send({
        clientEventId: "waarden-choice-1",
        category: "game",
        type: "legacy.partner_progress",
        gameRunId: run.body.id,
        payload: { choice: "eerlijkheid" },
      })
      .expect(201);
    const repeated = await request(app)
      .post("/api/profile/activity")
      .set(firstAuth)
      .send({
        clientEventId: "waarden-choice-1",
        category: "game",
        type: "legacy.partner_progress",
        gameRunId: run.body.id,
        payload: { choice: "anders" },
      })
      .expect(201);
    const activity = await request(app)
      .get("/api/profile/activity")
      .set(firstAuth)
      .expect(200);
    const partnerActivity = await request(app)
      .get("/api/profile/activity")
      .set(secondAuth)
      .expect(200);

    expect(repeated.body.id).toBe(recorded.body.id);
    expect(activity.body.map((event: { type: string }) => event.type)).toEqual(
      expect.arrayContaining([
        "waiting.started",
        "waiting.answer.saved",
        "waiting.ended",
        "legacy.partner_progress",
      ]),
    );
    expect(
      activity.body.find(
        (event: { type: string }) => event.type === "legacy.partner_progress",
      ).payload,
    ).toEqual({ choice: "eerlijkheid" });
    expect(partnerActivity.body).toEqual([]);
  });

  it("activates the local 1111 developer pair outside production", async () => {
    const app = await createTestApp();
    const session = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "x".repeat(64) });
    const auth = { authorization: `Bearer ${session.body.accessToken}` };

    const pair = await request(app)
      .post("/api/pairs/developer")
      .set(auth)
      .send({});
    const run = await request(app)
      .post("/api/game-runs")
      .set(auth)
      .send({ gameId: "waarden", mode: "couple", version: 2 });
    const progress = await request(app).get("/api/progress").set(auth);

    expect(pair.status).toBe(201);
    expect(pair.body.developerMode).toBe(true);
    expect(pair.body.members.map((member: { displayName: string }) => member.displayName))
      .toContain("Testpartner");
    expect(run.body.state.readyInstallationIds).toHaveLength(2);
    expect(progress.body).toMatchObject({
      eligibleWorlds: [1, 2, 3, 4, 5],
      purchasedWorlds: [1, 2, 3, 4, 5],
      unlockedWorlds: [1, 2, 3, 4, 5],
    });
  });

  it("rejects planned and profile entries as game runs", async () => {
    const app = await createTestApp();
    const session = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "q".repeat(64) });
    const auth = { authorization: `Bearer ${session.body.accessToken}` };

    await request(app).post("/api/pairs/developer").set(auth).send({});

    await request(app)
      .post("/api/game-runs")
      .set(auth)
      .send({ gameId: "grot", mode: "couple", version: 1 })
      .expect(404);
    await request(app)
      .post("/api/game-runs")
      .set(auth)
      .send({ gameId: "profiel", mode: "couple", version: 1 })
      .expect(404);
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

  it("projects semantic profile insights and keeps archived results private", async () => {
    const app = await createTestApp();
    const first = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "i".repeat(64) });
    const second = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "j".repeat(64) });
    const outsider = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "k".repeat(64) });
    const firstAuth = { authorization: `Bearer ${first.body.accessToken}` };
    const secondAuth = { authorization: `Bearer ${second.body.accessToken}` };
    const outsiderAuth = {
      authorization: `Bearer ${outsider.body.accessToken}`,
    };
    const pair = await request(app).post("/api/pairs").set(firstAuth).send({});
    await request(app)
      .post("/api/pairs/join")
      .set(secondAuth)
      .send({ code: pair.body.code });
    await request(app)
      .post("/api/game-runs")
      .set(firstAuth)
      .send({ gameId: "waarden", mode: "couple", version: 2 });
    const run = await request(app)
      .post("/api/game-runs")
      .set(secondAuth)
      .send({ gameId: "waarden", mode: "couple", version: 2 });
    const result = {
      schemaVersion: 1,
      selections: {
        [first.body.installationId]: ["eerlijkheid", "familie", "rust"],
        [second.body.installationId]: ["eerlijkheid", "humor", "avontuur"],
      },
      sharedValues: ["eerlijkheid"],
      completedAt: "2026-06-12T10:00:00.000Z",
    };
    await request(app)
      .post(`/api/game-runs/${run.body.id}/actions`)
      .set(firstAuth)
      .send({
        id: randomUUID(),
        expectedRevision: run.body.revision,
        type: "waarden.game.completed",
        payload: {},
        state: run.body.state,
        status: "completed",
        result,
      });

    const insights = await request(app)
      .get("/api/profile/insights")
      .set(firstAuth);
    const exported = await request(app)
      .get("/api/profile/export")
      .set(firstAuth);
    expect(insights.status).toBe(200);
    expect(insights.body.personal.values).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ valueId: "eerlijkheid", occurrences: 1 }),
      ]),
    );
    expect(insights.body.currentRelationship).toMatchObject({
      pairId: pair.body.id,
      sharedValues: ["eerlijkheid"],
    });
    expect(exported.body.insights.personal.completedRuns).toBe(1);

    await request(app).delete("/api/pairs/current").set(firstAuth);
    const archivedResults = await request(app)
      .get(`/api/relationships/${pair.body.id}/results`)
      .set(firstAuth);
    const blockedResults = await request(app)
      .get(`/api/relationships/${pair.body.id}/results`)
      .set(outsiderAuth);
    const afterDisconnect = await request(app)
      .get("/api/profile/insights")
      .set(firstAuth);

    expect(archivedResults.status).toBe(200);
    expect(archivedResults.body).toHaveLength(1);
    expect(blockedResults.status).toBe(404);
    expect(afterDisconnect.body.personal.completedRuns).toBe(1);
    expect(afterDisconnect.body.currentRelationship).toBeNull();
  });

  it("allows a member to form a new pair without exposing the old relationship", async () => {
    const app = await createTestApp();
    const first = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "n".repeat(64) });
    const oldPartner = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "o".repeat(64) });
    const newPartner = await request(app)
      .post("/api/auth/guest")
      .send({ installationSecret: "p".repeat(64) });
    const firstAuth = { authorization: `Bearer ${first.body.accessToken}` };
    const oldAuth = {
      authorization: `Bearer ${oldPartner.body.accessToken}`,
    };
    const newAuth = {
      authorization: `Bearer ${newPartner.body.accessToken}`,
    };
    const oldPair = await request(app)
      .post("/api/pairs")
      .set(firstAuth)
      .send({});
    await request(app)
      .post("/api/pairs/join")
      .set(oldAuth)
      .send({ code: oldPair.body.code });
    await request(app).delete("/api/pairs/current").set(firstAuth).expect(204);

    const newPair = await request(app)
      .post("/api/pairs")
      .set(firstAuth)
      .send({});
    await request(app)
      .post("/api/pairs/join")
      .set(newAuth)
      .send({ code: newPair.body.code });
    const current = await request(app)
      .get("/api/pairs/current")
      .set(firstAuth)
      .expect(200);
    const newPartnerArchives = await request(app)
      .get("/api/relationships/archives")
      .set(newAuth)
      .expect(200);
    const ownerArchives = await request(app)
      .get("/api/relationships/archives")
      .set(firstAuth)
      .expect(200);

    expect(current.body.id).toBe(newPair.body.id);
    expect(newPartnerArchives.body).toEqual([]);
    expect(ownerArchives.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: oldPair.body.id })]),
    );
  });
});

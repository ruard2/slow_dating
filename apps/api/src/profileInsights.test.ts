import { describe, expect, it } from "vitest";

import type { GameRun, WaitingStats } from "@slow-dating/contracts";

import { buildProfileInsights } from "./profileInsights.js";

const ownerId = "11111111-1111-4111-8111-111111111111";
const oldPartnerId = "22222222-2222-4222-8222-222222222222";
const newPartnerId = "33333333-3333-4333-8333-333333333333";
const oldPairId = "44444444-4444-4444-8444-444444444444";
const newPairId = "55555555-5555-4555-8555-555555555555";

const waiting: WaitingStats = {
  totalWaitCount: 2,
  totalWaitSeconds: 180,
  totalGamesPlayed: 3,
  recentGameIds: ["vraag-1"],
  badges: [],
};

function completedWaardenRun(
  id: string,
  pairId: string,
  partnerId: string,
  completedAt: string,
): GameRun {
  return {
    id,
    gameId: "waarden",
    version: 2,
    mode: "couple",
    pairId,
    installationId: ownerId,
    status: "completed",
    revision: 4,
    state: {},
    result: {
      schemaVersion: 1,
      selections: {
        [ownerId]: ["eerlijkheid", "familie", "rust"],
        [partnerId]: ["eerlijkheid", "humor", "avontuur"],
      },
      sharedValues: ["eerlijkheid"],
      completedAt,
    },
    startedAt: completedAt,
    completedAt,
  };
}

describe("buildProfileInsights", () => {
  it("recalculates deterministically from semantic results", () => {
    const input = {
      installationId: ownerId,
      completedRuns: [
        completedWaardenRun(
          "66666666-6666-4666-8666-666666666666",
          oldPairId,
          oldPartnerId,
          "2026-06-10T10:00:00.000Z",
        ),
      ],
      waiting,
      currentPair: null,
      generatedAt: "2026-06-12T10:00:00.000Z",
    };

    expect(buildProfileInsights(input)).toEqual(buildProfileInsights(input));
  });

  it("keeps personal history but isolates the current relationship", () => {
    const insights = buildProfileInsights({
      installationId: ownerId,
      completedRuns: [
        completedWaardenRun(
          "66666666-6666-4666-8666-666666666666",
          oldPairId,
          oldPartnerId,
          "2026-06-10T10:00:00.000Z",
        ),
        completedWaardenRun(
          "77777777-7777-4777-8777-777777777777",
          newPairId,
          newPartnerId,
          "2026-06-12T10:00:00.000Z",
        ),
      ],
      waiting,
      currentPair: {
        id: newPairId,
        memberIds: [ownerId, newPartnerId],
        partnerName: "Nieuwe partner",
      },
      generatedAt: "2026-06-12T12:00:00.000Z",
    });

    expect(insights.personal.completedRuns).toBe(2);
    expect(
      insights.personal.values.find(
        ({ valueId }) => valueId === "eerlijkheid",
      )?.occurrences,
    ).toBe(2);
    expect(insights.currentRelationship).toMatchObject({
      pairId: newPairId,
      partnerName: "Nieuwe partner",
      completedRuns: 1,
      sharedValues: ["eerlijkheid"],
    });
    expect(
      insights.currentRelationship?.provenance.map(({ pairId }) => pairId),
    ).toEqual([newPairId]);
  });

  it("ignores unvalidated generic result payloads", () => {
    const invalidRun = completedWaardenRun(
      "88888888-8888-4888-8888-888888888888",
      oldPairId,
      oldPartnerId,
      "2026-06-10T10:00:00.000Z",
    );
    invalidRun.result = { clicked: "something" };

    const insights = buildProfileInsights({
      installationId: ownerId,
      completedRuns: [invalidRun],
      waiting,
      currentPair: null,
      generatedAt: "2026-06-12T12:00:00.000Z",
    });

    expect(insights.personal.completedRuns).toBe(0);
    expect(insights.personal.values).toEqual([]);
  });
});

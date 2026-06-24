import { describe, expect, it } from "vitest";

import type { GameRun, WaitingStats } from "@slow-dating/contracts";

import {
  buildProfileInsights,
  relationshipGameResults,
} from "./profileInsights.js";

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

function completedWorld3Run(
  gameId: string,
  index: number,
  result: Record<string, unknown> = {},
): GameRun {
  const completedAt = `2026-06-${20 + index}T10:00:00.000Z`;
  return {
    id: `a0000000-0000-4000-8000-00000000000${index}`,
    gameId,
    version: 1,
    mode: "couple",
    pairId: newPairId,
    installationId: ownerId,
    status: "completed",
    revision: 4,
    state: {},
    result: {
      schemaVersion: 1,
      ownerId,
      partnerId: newPartnerId,
      choices: {
        [ownerId]: [`keuze-jij-${gameId}`],
        [newPartnerId]: [`keuze-partner-${gameId}`],
      },
      reflection: `reflectie ${gameId}`,
      ...result,
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

  it("unlocks profile one after five different games from world one", () => {
    const gameIds = [
      "waarden",
      "lach-samen",
      "kennismaking",
      "familiedorp",
      "kwaliteiten",
    ];
    const runs = gameIds.map((gameId, index) => {
      const run = completedWaardenRun(
        `${index + 1}0000000-0000-4000-8000-00000000000${index + 1}`,
        newPairId,
        newPartnerId,
        `2026-06-${10 + index}T10:00:00.000Z`,
      );
      run.gameId = gameId;
      if (gameId !== "waarden") {
        run.version = 1;
        run.result = { schemaVersion: 1, choice: `keuze-${index + 1}` };
      }
      return run;
    });

    const insights = buildProfileInsights({
      installationId: ownerId,
      completedRuns: runs,
      waiting,
      currentPair: {
        id: newPairId,
        memberIds: [ownerId, newPartnerId],
        partnerName: "Nieuwe partner",
      },
      generatedAt: "2026-06-15T12:00:00.000Z",
    });

    expect(insights.chapters[0]).toMatchObject({
      world: 1,
      available: true,
      status: "provisional",
      completedGameCount: 5,
    });
    expect(insights.chapters[0]?.cards.length).toBeGreaterThan(3);
    expect(insights.chapters[1]).toMatchObject({
      world: 2,
      available: false,
    });
  });

  it("keeps profile three locked below five completed world-three games", () => {
    const runs = [
      "geldbrug",
      "winkelmandje",
      "liefdestaal",
      "stressmeter",
    ].map((gameId, index) => completedWorld3Run(gameId, index + 1));

    const insights = buildProfileInsights({
      installationId: ownerId,
      completedRuns: runs,
      waiting,
      currentPair: {
        id: newPairId,
        memberIds: [ownerId, newPartnerId],
        partnerName: "Nieuwe partner",
      },
      generatedAt: "2026-06-24T12:00:00.000Z",
    });

    expect(insights.chapters[2]).toMatchObject({
      world: 3,
      available: false,
      completedGameCount: 4,
      requiredGames: 5,
    });
    expect(insights.chapters[2]?.gameResultAppendix).toBeUndefined();
  });

  it("unlocks profile three after five completed world-three games and keeps appendix data", () => {
    const gameIds = [
      "geldbrug",
      "winkelmandje",
      "liefdestaal",
      "stressmeter",
      "huishoudtafel",
    ];
    const runs = gameIds.map((gameId, index) =>
      completedWorld3Run(gameId, index + 1, {
        marker: `volledige-data-${gameId}`,
      }),
    );

    const insights = buildProfileInsights({
      installationId: ownerId,
      completedRuns: runs,
      waiting,
      currentPair: {
        id: newPairId,
        memberIds: [ownerId, newPartnerId],
        partnerName: "Nieuwe partner",
      },
      generatedAt: "2026-06-24T12:00:00.000Z",
    });

    const chapter = insights.chapters[2];
    expect(chapter).toMatchObject({
      world: 3,
      available: true,
      completedGameCount: 5,
      requiredGames: 5,
    });
    expect(chapter?.dataCoverage).toMatchObject({
      requiredGames: 5,
      completedGameCount: 5,
      gamesUsed: gameIds,
    });
    expect(chapter?.gameResultAppendix?.map((item) => item.gameId)).toEqual(
      gameIds,
    );
    expect(chapter?.gameResultAppendix?.[0]?.result).toMatchObject({
      marker: "volledige-data-geldbrug",
    });
    expect(chapter?.overviewSummary).toContain("samenleven concreet");
  });
});

describe("relationshipGameResults", () => {
  it("bewaart ook gevalideerde provenance voor andere spelresultaten", () => {
    const run = completedWaardenRun(
      "99999999-9999-4999-8999-999999999999",
      newPairId,
      newPartnerId,
      "2026-06-13T10:00:00.000Z",
    );
    run.gameId = "kernkwadranten";
    run.version = 2;
    run.result = {
      schemaVersion: 1,
      profiles: {
        [ownerId]: {
          qualities: ["Daadkracht", "Empathie"],
          allergy: "Passiviteit",
        },
      },
      rounds: [],
      completedAt: "2026-06-13T10:00:00.000Z",
    };

    expect(relationshipGameResults([run])).toEqual([
      {
        provenance: {
          gameRunId: run.id,
          gameId: "kernkwadranten",
          gameVersion: 2,
          resultSchemaVersion: 1,
          pairId: newPairId,
          completedAt: "2026-06-13T10:00:00.000Z",
        },
        result: run.result,
      },
    ]);
  });
});

import { randomUUID } from "node:crypto";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { AppRepository } from "./domain.js";
import { LocalRepository } from "./localRepository.js";
import { PrismaRepository } from "./prismaRepository.js";

interface RepositoryFixture {
  repository: AppRepository;
  cleanup(): Promise<void>;
}

type RepositoryFactory = () => Promise<RepositoryFixture>;

function repositoryContract(name: string, factory: RepositoryFactory) {
  describe(name, () => {
    it("preserves the same identity, pair, game and archive behavior", async () => {
      const fixture = await factory();
      const repository = fixture.repository;
      try {
        const suffix = randomUUID();
        const first = await repository.findOrCreateInstallation(
          `contract-first-${suffix}`,
        );
        const second = await repository.findOrCreateInstallation(
          `contract-second-${suffix}`,
        );
        await repository.updateProfile(first.id, { displayName: "Eerste" });
        await repository.updateProfile(second.id, { displayName: "Tweede" });

        const createdPair = await repository.createPair(first.id);
        const joinedPair = await repository.joinPair(second.id, createdPair.code);
        expect(joinedPair.members).toHaveLength(2);

        const firstMessage = await repository.createMessage(
          first.id,
          `contract-message-${suffix}`,
          "Een bewaard contractbericht.",
        );
        const repeatedMessage = await repository.createMessage(
          first.id,
          `contract-message-${suffix}`,
          "Dit duplicaat mag niet worden opgeslagen.",
        );
        expect(repeatedMessage.id).toBe(firstMessage.id);

        await repository.createGameRun(first.id, {
          gameId: "waarden",
          mode: "couple",
          version: 2,
        });
        const run = await repository.createGameRun(second.id, {
          gameId: "waarden",
          mode: "couple",
          version: 2,
        });
        await repository.startWaitingSession(first.id, run.id);
        await repository.saveWaitingAnswer(first.id, {
          gameRunId: run.id,
          waitingGameId: "contract-vraag",
          answerId: "antwoord-a",
          answerLabel: "Antwoord A",
          shareLevel: "soft_share",
        });
        await repository.endWaitingSession(first.id, run.id);

        const completedAt = new Date().toISOString();
        const completed = await repository.applyGameAction(first.id, run.id, {
          id: randomUUID(),
          expectedRevision: run.revision,
          type: "waarden.game.completed",
          payload: {},
          state: run.state,
          status: "completed",
          result: {
            schemaVersion: 1,
            selections: {
              [first.id]: ["eerlijkheid", "familie", "rust"],
              [second.id]: ["eerlijkheid", "humor", "avontuur"],
            },
            sharedValues: ["eerlijkheid"],
            completedAt,
          },
        });
        expect(completed.status).toBe("completed");

        const insights = await repository.getProfileInsights(first.id);
        expect(insights.personal.completedRuns).toBe(1);
        expect(insights.personal.waiting.totalGamesPlayed).toBe(1);
        expect(insights.currentRelationship?.sharedValues).toEqual([
          "eerlijkheid",
        ]);

        await repository.disconnectPair(first.id);
        const archives = await repository.listRelationshipArchives(first.id);
        expect(archives).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: createdPair.id,
              messageCount: 1,
              completedGames: 1,
            }),
          ]),
        );
        const results = await repository.listRelationshipGameResults(
          first.id,
          createdPair.id,
        );
        expect(results).toHaveLength(1);
        expect(results[0]?.provenance).toMatchObject({
          gameId: "waarden",
          gameVersion: 2,
          resultSchemaVersion: 1,
        });
        expect(
          (await repository.getProfileInsights(first.id)).personal.completedRuns,
        ).toBe(1);
      } finally {
        await repository.close();
        await fixture.cleanup();
      }
    });
  });
}

repositoryContract("LocalRepository contract", async () => {
  const filePath = join(tmpdir(), `slow-dating-contract-${randomUUID()}.json`);
  const repository = new LocalRepository(filePath);
  await repository.initialize();
  return {
    repository,
    cleanup: () => rm(filePath, { force: true }),
  };
});

describe.skipIf(process.env.RUN_POSTGRES_CONTRACTS !== "1")(
  "PrismaRepository contract",
  () => {
    repositoryContract("PostgreSQL", async () => {
      const repository = new PrismaRepository(
        process.env.DATABASE_URL ??
          "postgresql://slowdating:slowdating@127.0.0.1:5432/slowdating",
      );
      await repository.initialize();
      return { repository, cleanup: async () => {} };
    });
  },
);

import { hashPassword } from "./auth.js";
import { hashInstallationSecret } from "./localRepository.js";
import { PrismaRepository } from "./prismaRepository.js";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://slowdating:slowdating@127.0.0.1:5432/slowdating";
const repository = new PrismaRepository(databaseUrl);

await repository.initialize();
try {
  const ruard = await repository.findOrCreateInstallation(
    hashInstallationSecret("seed-ruard-installation-secret".padEnd(64, "!")),
  );
  const partner = await repository.findOrCreateInstallation(
    hashInstallationSecret("seed-partner-installation-secret".padEnd(64, "!")),
  );
  await repository.createAccount(
    ruard.id,
    "ruard@example.test",
    await hashPassword("Professioneel123"),
    "Ruard",
  );
  await repository.createAccount(
    partner.id,
    "partner@example.test",
    await hashPassword("Professioneel123"),
    "Testpartner",
  );
  const pair = await repository.createPair(ruard.id);
  await repository.joinPair(partner.id, pair.code);
  await repository.createGameRun(ruard.id, {
    gameId: "waarden",
    mode: "couple",
    version: 2,
  });
  const run = await repository.createGameRun(partner.id, {
    gameId: "waarden",
    mode: "couple",
    version: 2,
  });
  const completedAt = new Date().toISOString();
  await repository.applyGameAction(ruard.id, run.id, {
    id: "00000000-0000-4000-8000-000000000001",
    expectedRevision: run.revision,
    type: "waarden.game.completed",
    payload: {},
    state: run.state,
    status: "completed",
    result: {
      schemaVersion: 1,
      selections: {
        [ruard.id]: ["eerlijkheid", "familie", "rust"],
        [partner.id]: ["eerlijkheid", "humor", "avontuur"],
      },
      sharedValues: ["eerlijkheid"],
      completedAt,
    },
  });
  await repository.createMessage(
    ruard.id,
    "seed-welcome-message",
    "Welkom in de lokale PostgreSQL-testrelatie.",
  );
  console.log(
    `Seed gereed: ${ruard.id}, ${partner.id}, relatie ${pair.id}, run ${run.id}.`,
  );
} finally {
  await repository.close();
}

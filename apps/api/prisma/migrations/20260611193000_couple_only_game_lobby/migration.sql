ALTER TABLE "Pair"
ADD COLUMN "developerMode" BOOLEAN NOT NULL DEFAULT false;

UPDATE "GameRun" SET "status" = 'abandoned' WHERE "status" = 'active';
ALTER TABLE "GameRun" ADD COLUMN "lobbyKey" TEXT;
CREATE UNIQUE INDEX "GameRun_lobbyKey_key" ON "GameRun"("lobbyKey");

DELETE FROM "GameRun" WHERE "mode" = 'solo';

ALTER TYPE "GameMode" RENAME TO "GameMode_old";
CREATE TYPE "GameMode" AS ENUM ('couple');
ALTER TABLE "GameRun"
ALTER COLUMN "mode" TYPE "GameMode"
USING ("mode"::text::"GameMode");
DROP TYPE "GameMode_old";

CREATE TABLE "WaitingSession" (
  "id" TEXT NOT NULL,
  "pairId" TEXT NOT NULL,
  "gameRunId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP(3),
  CONSTRAINT "WaitingSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WaitingAnswer" (
  "id" TEXT NOT NULL,
  "waitingSessionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "waitingGameId" TEXT NOT NULL,
  "answerId" TEXT NOT NULL,
  "answerLabel" TEXT NOT NULL,
  "shareLevel" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WaitingAnswer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WaitingSession_gameRunId_userId_key" ON "WaitingSession"("gameRunId", "userId");
CREATE INDEX "WaitingSession_userId_startedAt_idx" ON "WaitingSession"("userId", "startedAt");
CREATE INDEX "WaitingAnswer_userId_createdAt_idx" ON "WaitingAnswer"("userId", "createdAt");
ALTER TABLE "WaitingSession" ADD CONSTRAINT "WaitingSession_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WaitingSession" ADD CONSTRAINT "WaitingSession_gameRunId_fkey" FOREIGN KEY ("gameRunId") REFERENCES "GameRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WaitingSession" ADD CONSTRAINT "WaitingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Installation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WaitingAnswer" ADD CONSTRAINT "WaitingAnswer_waitingSessionId_fkey" FOREIGN KEY ("waitingSessionId") REFERENCES "WaitingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WaitingAnswer" ADD CONSTRAINT "WaitingAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Installation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TYPE "GameRunStatus" ADD VALUE IF NOT EXISTS 'lobby' BEFORE 'active';

ALTER TABLE "GameRun"
ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "GameRun"
ALTER COLUMN "status" SET DEFAULT 'lobby';

CREATE TABLE "GameAction" (
  "id" TEXT NOT NULL,
  "gameRunId" TEXT NOT NULL,
  "installationId" TEXT NOT NULL,
  "revision" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GameAction_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GameAction_gameRunId_revision_key"
ON "GameAction"("gameRunId", "revision");

CREATE INDEX "GameAction_gameRunId_createdAt_idx"
ON "GameAction"("gameRunId", "createdAt");

ALTER TABLE "GameAction"
ADD CONSTRAINT "GameAction_gameRunId_fkey"
FOREIGN KEY ("gameRunId") REFERENCES "GameRun"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GameAction"
ADD CONSTRAINT "GameAction_installationId_fkey"
FOREIGN KEY ("installationId") REFERENCES "Installation"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "clientEventId" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "pairId" TEXT,
    "gameRunId" TEXT,
    "gameId" TEXT,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ActivityEvent_installationId_clientEventId_key"
ON "ActivityEvent"("installationId", "clientEventId");

CREATE INDEX "ActivityEvent_installationId_occurredAt_idx"
ON "ActivityEvent"("installationId", "occurredAt");

CREATE INDEX "ActivityEvent_pairId_occurredAt_idx"
ON "ActivityEvent"("pairId", "occurredAt");

CREATE INDEX "ActivityEvent_gameRunId_occurredAt_idx"
ON "ActivityEvent"("gameRunId", "occurredAt");

ALTER TABLE "ActivityEvent"
ADD CONSTRAINT "ActivityEvent_installationId_fkey"
FOREIGN KEY ("installationId") REFERENCES "Installation"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ActivityEvent"
ADD CONSTRAINT "ActivityEvent_pairId_fkey"
FOREIGN KEY ("pairId") REFERENCES "Pair"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ActivityEvent"
ADD CONSTRAINT "ActivityEvent_gameRunId_fkey"
FOREIGN KEY ("gameRunId") REFERENCES "GameRun"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

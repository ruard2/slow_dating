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

-- Slow-dating kennismakingen: uitnodigingen tot een gezamenlijke route (twee ja's).
CREATE TYPE "RouteInvitationStatus" AS ENUM ('pending', 'accepted', 'declined', 'expired');

CREATE TABLE "RouteInvitation" (
  "id" TEXT NOT NULL,
  "fromInstallationId" TEXT NOT NULL,
  "toInstallationId" TEXT NOT NULL,
  "message" TEXT NOT NULL DEFAULT '',
  "status" "RouteInvitationStatus" NOT NULL DEFAULT 'pending',
  "pairId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "respondedAt" TIMESTAMP(3),
  CONSTRAINT "RouteInvitation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RouteInvitation_toInstallationId_status_idx"
  ON "RouteInvitation" ("toInstallationId", "status");

CREATE INDEX "RouteInvitation_fromInstallationId_status_idx"
  ON "RouteInvitation" ("fromInstallationId", "status");

ALTER TABLE "RouteInvitation"
  ADD CONSTRAINT "RouteInvitation_fromInstallationId_fkey"
  FOREIGN KEY ("fromInstallationId") REFERENCES "Installation" ("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RouteInvitation"
  ADD CONSTRAINT "RouteInvitation_toInstallationId_fkey"
  FOREIGN KEY ("toInstallationId") REFERENCES "Installation" ("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

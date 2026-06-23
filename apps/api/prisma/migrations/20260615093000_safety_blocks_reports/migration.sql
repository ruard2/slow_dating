-- Veiligheid: blokkeren en rapporteren.
CREATE TABLE "Block" (
  "id" TEXT NOT NULL,
  "byInstallationId" TEXT NOT NULL,
  "blockedInstallationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Block_byInstallationId_blockedInstallationId_key"
  ON "Block" ("byInstallationId", "blockedInstallationId");
CREATE INDEX "Block_byInstallationId_idx" ON "Block" ("byInstallationId");
CREATE INDEX "Block_blockedInstallationId_idx" ON "Block" ("blockedInstallationId");

CREATE TABLE "Report" (
  "id" TEXT NOT NULL,
  "byInstallationId" TEXT NOT NULL,
  "targetInstallationId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "note" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Report_targetInstallationId_idx" ON "Report" ("targetInstallationId");

ALTER TABLE "Block"
  ADD CONSTRAINT "Block_byInstallationId_fkey"
  FOREIGN KEY ("byInstallationId") REFERENCES "Installation" ("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Block"
  ADD CONSTRAINT "Block_blockedInstallationId_fkey"
  FOREIGN KEY ("blockedInstallationId") REFERENCES "Installation" ("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Report"
  ADD CONSTRAINT "Report_byInstallationId_fkey"
  FOREIGN KEY ("byInstallationId") REFERENCES "Installation" ("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Report"
  ADD CONSTRAINT "Report_targetInstallationId_fkey"
  FOREIGN KEY ("targetInstallationId") REFERENCES "Installation" ("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

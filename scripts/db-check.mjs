import { compose, run } from "./db-tools.mjs";

compose("up", "-d", "--wait", "postgres");
run("npm", [
  "exec",
  "--workspace",
  "@slow-dating/api",
  "--",
  "prisma",
  "migrate",
  "reset",
  "--force",
  "--config",
  "prisma.config.ts",
]);
run(
  "npm",
  ["run", "test:repository", "--workspace", "@slow-dating/api"],
  { env: { RUN_POSTGRES_CONTRACTS: "1" } },
);
run("npm", [
  "exec",
  "--workspace",
  "@slow-dating/api",
  "--",
  "prisma",
  "migrate",
  "reset",
  "--force",
  "--config",
  "prisma.config.ts",
]);
run("npm", ["run", "db:seed", "--workspace", "@slow-dating/api"]);

console.log("PostgreSQL-migraties, repositorycontracten en seed zijn groen.");

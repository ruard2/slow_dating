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
run("npm", ["run", "db:seed", "--workspace", "@slow-dating/api"]);

console.log("PostgreSQL is gereset, gemigreerd en gevuld met testdata.");

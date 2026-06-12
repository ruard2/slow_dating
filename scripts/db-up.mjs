import { compose } from "./db-tools.mjs";

compose("up", "-d", "--wait", "postgres");
console.log("PostgreSQL luistert op 127.0.0.1:5432.");

import { compose } from "./db-tools.mjs";

compose("down");
console.log("De lokale PostgreSQL-container is gestopt.");

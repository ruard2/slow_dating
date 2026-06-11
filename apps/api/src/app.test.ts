import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "./app.js";

describe("GET /api/health", () => {
  it("returns the typed health response", async () => {
    const response = await request(
      createApp({
        webOrigin: "http://localhost:5173",
      }),
    ).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      service: "api",
      version: "0.1.0",
    });
  });
});

import { describe, expect, it } from "vitest";

import { realtimeEventSchema, waardenResultSchema } from "./index";

describe("realtimeEventSchema", () => {
  it("accepts the shared event envelope", () => {
    expect(
      realtimeEventSchema.parse({
        id: "event-1",
        type: "system.ready",
        version: 1,
        pairId: "pair-1",
        sentAt: "2026-06-11T08:00:00.000Z",
        payload: {
          ready: true,
        },
      }),
    ).toMatchObject({
      id: "event-1",
      version: 1,
    });
  });
});

describe("waardenResultSchema", () => {
  it("requires a versioned semantic result for both players", () => {
    const first = "11111111-1111-4111-8111-111111111111";
    const second = "22222222-2222-4222-8222-222222222222";
    expect(
      waardenResultSchema.parse({
        schemaVersion: 1,
        selections: {
          [first]: ["eerlijkheid", "familie", "rust"],
          [second]: ["eerlijkheid", "humor", "avontuur"],
        },
        sharedValues: ["eerlijkheid"],
        completedAt: "2026-06-12T10:00:00.000Z",
      }),
    ).toMatchObject({ schemaVersion: 1 });
  });
});

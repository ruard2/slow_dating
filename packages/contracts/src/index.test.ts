import { describe, expect, it } from "vitest";

import { realtimeEventSchema } from "./index";

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

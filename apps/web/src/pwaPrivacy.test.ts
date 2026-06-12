import { describe, expect, it } from "vitest";

import { pwaWorkbox } from "../vite.config";

describe("PWA privacy", () => {
  it("never runtime-caches API, socket or legacy responses", () => {
    expect(pwaWorkbox.runtimeCaching).toEqual([]);
    for (const path of ["/api/profile", "/socket.io/", "/legacy/waarden.html"]) {
      expect(
        pwaWorkbox.navigateFallbackDenylist.some((pattern) =>
          pattern.test(path),
        ),
      ).toBe(true);
    }
  });
});

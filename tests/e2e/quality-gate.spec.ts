import { expect, test, type Page } from "@playwright/test";

async function activateAdmin(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Partner koppelen" }).click();
  await page.getByPlaceholder("ABC234 of 1111").fill("1111");
  await page.getByRole("button", { name: "Open beheerdersmodus" }).click();
}

test("restores the lobby after refresh and reconnects after going offline", async ({
  context,
  page,
}) => {
  await activateAdmin(page);
  await page.getByRole("button", { name: "Sluiten" }).click();
  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Afwezig" }).click();
  await page.goto("/games/waarden");
  await expect(page.getByText("Wachten op je reisgenoot...")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Wachten op je reisgenoot...")).toBeVisible();

  await context.setOffline(true);
  await expect(
    page.getByRole("button", { name: "Bellen toegestaan, partner offline" }),
  ).toBeVisible();
  await context.setOffline(false);
  await page.reload();
  await expect(page.getByText("Wachten op je reisgenoot...")).toBeVisible();

  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Aanwezig" }).click();
  await expect(page.locator("main[data-native-game='waarden']")).toBeVisible({
    timeout: 8_000,
  });
});

test("personal API responses are never cacheable", async ({ page }) => {
  const responses = new Map<string, string | undefined>();
  page.on("response", (response) => {
    const path = new URL(response.url()).pathname;
    if (path.startsWith("/api/")) {
      responses.set(path, response.headers()["cache-control"]);
    }
  });
  await page.goto("/profile");
  await expect(
    page.getByRole("heading", { name: "Profielinzichten" }),
  ).toBeVisible();

  for (const [path, cacheControl] of responses) {
    expect(cacheControl, path).toBe("no-store");
  }
  const cachedRequests = await page.evaluate(async () => {
    const keys = await caches.keys();
    const urls = (
      await Promise.all(
        keys.map(async (key) => {
          const cache = await caches.open(key);
          return (await cache.keys()).map((request) => request.url);
        }),
      )
    ).flat();
    return urls.filter((url) => new URL(url).pathname.startsWith("/api/"));
  });
  expect(cachedRequests).toEqual([]);
});

test("dialogs support keyboard focus and Escape", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Bekijk wereld 2: Verdieping" }).focus();
  await page.keyboard.press("Enter");
  const unlockDialog = page.getByRole("dialog", {
    name: "Wereld 2 vrijschakelen",
  });
  await expect(unlockDialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Misschien later" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(unlockDialog).toBeHidden();

  await page.getByRole("button", { name: "Opties openen" }).focus();
  await page.keyboard.press("Enter");
  const settingsDialog = page.getByRole("dialog", { name: "Opties" });
  await expect(settingsDialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Sluiten" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(settingsDialog).toBeHidden();
});

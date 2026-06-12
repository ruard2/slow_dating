import { expect, test } from "@playwright/test";

test("opens the built shell offline without caching personal API data", async ({
  context,
  page,
}) => {
  await page.goto("/");
  await expect(page.getByAltText("Kaart van wereld 1")).toBeVisible();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();

  const apiEntries = await page.evaluate(async () => {
    const cacheNames = await caches.keys();
    const requests = (
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          const cache = await caches.open(cacheName);
          return cache.keys();
        }),
      )
    ).flat();
    return requests
      .map((request) => request.url)
      .filter((url) => new URL(url).pathname.startsWith("/api/"));
  });
  expect(apiEntries).toEqual([]);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#root")).toBeAttached();
  await expect(page).toHaveTitle(/Slow Dating/i);
});

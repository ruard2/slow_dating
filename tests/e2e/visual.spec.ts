import { expect, test, type Page } from "@playwright/test";

test.skip(
  process.env.SKIP_VISUAL === "1",
  "Visuele regressie draait in de vaste Windows-job.",
);

async function activateAdmin(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Partner koppelen" }).click();
  await page.getByPlaceholder("ABC234 of 1111").fill("1111");
  await page.getByRole("button", { name: "Open beheerdersmodus" }).click();
}

test("world map visual baseline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByAltText("Kaart van wereld 1")).toBeVisible();
  await expect(page).toHaveScreenshot("world-map.png", {
    animations: "disabled",
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});

test("waiting room visual baseline", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await activateAdmin(page);
  await page.getByRole("button", { name: "Sluiten" }).click();
  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Afwezig" }).click();
  await page.goto("/games/waarden");
  await expect(page.getByText("Wachten op je reisgenoot...")).toBeVisible();
  await expect(page).toHaveScreenshot("waiting-room.png", {
    animations: "disabled",
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});

test("waarden visual baseline", async ({ page }) => {
  await activateAdmin(page);
  await page.goto("/games/waarden");
  await expect(page.locator("main[data-native-game='waarden']")).toBeVisible();
  await expect(page).toHaveScreenshot("waarden-selection.png", {
    animations: "disabled",
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});

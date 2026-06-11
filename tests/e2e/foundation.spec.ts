import { expect, test, type Page } from "@playwright/test";

async function createAccount(
  page: Page,
  name: string,
  email: string,
) {
  await page.getByLabel("Naam").fill(name);
  await page.getByLabel("E-mailadres").fill(email);
  await page.getByLabel("Wachtwoord").fill("Professioneel123");
  await page.getByRole("button", { name: "Account maken" }).click();
  await expect(
    page.getByRole("heading", { name: "Maak je persoonlijke account" }),
  ).toBeHidden({ timeout: 15_000 });
}

test("loads the world map without console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Slow Dating" })).toHaveCount(0);
  await expect(page.getByAltText("Kaart van wereld 1")).toBeVisible();
  await expect(page.getByAltText("Kaart van wereld 2")).toBeAttached();
  await expect(page.getByLabel("Voortgang wereldkaart")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Je waarden", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Je waarden", exact: true }).click();
  await expect(page).toHaveURL(/\/games\/waarden$/);
  expect(consoleErrors).toEqual([]);
});

test("persists the guest profile after refresh", async ({ page }) => {
  await page.goto("/profile");
  await page.getByLabel("Naam").fill("Browser Tester");
  await page.getByLabel("Iets over jou").fill("Een lokaal testprofiel.");
  await page.getByRole("button", { name: "Opslaan" }).click();
  await expect(page.getByText("Profiel opgeslagen.")).toBeVisible();

  await page.reload();

  await expect(page.getByLabel("Naam")).toHaveValue("Browser Tester");
  await expect(page.getByLabel("Iets over jou")).toHaveValue(
    "Een lokaal testprofiel.",
  );
});

test("starts an adapted legacy game inside the permanent shell", async ({
  page,
}) => {
  await page.goto("/games/waarden");
  await page.getByRole("button", { name: "Alleen" }).click();
  await page.getByRole("button", { name: "Begin" }).click();

  const game = page.frameLocator("iframe[title='Je waarden']");
  await expect(
    game.getByRole("heading", { name: "Waarden", exact: true }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Chat" })).toBeVisible();
});

test("pairs two browsers and delivers chat exactly once", async ({
  browser,
  isMobile,
}) => {
  test.skip(isMobile, "De twee-browserflow draait eenmaal op desktop.");
  const firstContext = await browser.newContext();
  const secondContext = await browser.newContext();
  const first = await firstContext.newPage();
  const second = await secondContext.newPage();

  await first.goto("/");
  await first.getByRole("button", { name: "Koppel" }).click();
  await first.getByRole("button", { name: "Maak een code" }).click();
  const code = (await first.locator("[class*='pairCode']").innerText()).trim();

  await second.goto("/");
  await second.getByRole("button", { name: "Koppel" }).click();
  await second.getByPlaceholder("ABC234").fill(code);
  await second.getByRole("button", { name: "Code gebruiken" }).click();
  await createAccount(
    second,
    "Browser Twee",
    `twee-${Date.now()}@example.test`,
  );

  await first.reload();
  await createAccount(
    first,
    "Browser Een",
    `een-${Date.now()}@example.test`,
  );
  await first.getByRole("button", { name: "Chat" }).click();
  await second.getByRole("button", { name: "Chat" }).click();
  await second.getByPlaceholder("Schrijf iets...").fill("Hallo vanuit browser twee");
  await second.getByRole("button", { name: "Stuur" }).click();

  await expect(first.getByText("Hallo vanuit browser twee")).toHaveCount(1);
  await first.getByRole("button", { name: "Sluiten" }).click();
  await first.getByRole("button", { name: "Koppel" }).click();
  await first.getByRole("button", { name: "Ontkoppelen" }).click();
  await first.getByRole("link", { name: "Profiel" }).click();
  await expect(first.getByRole("heading", { name: "Relatiearchieven" })).toBeVisible();
  await expect(first.getByText("1 berichten · 0 ontdekkingen")).toBeVisible();

  await firstContext.close();
  await secondContext.close();
});

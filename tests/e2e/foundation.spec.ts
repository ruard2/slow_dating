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
  const geometry = await page.getByLabel("Wereld 1 met spellen").evaluate((card) => {
    const image = card.querySelector("img");
    const hotspot = card.querySelector("a");
    const cardBox = card.getBoundingClientRect();
    const imageBox = image?.getBoundingClientRect();
    const hotspotBox = hotspot?.getBoundingClientRect();
    return {
      cardRatio: cardBox.width / cardBox.height,
      imageRatio: imageBox ? imageBox.width / imageBox.height : 0,
      hotspotInside:
        Boolean(hotspotBox) &&
        (hotspotBox?.left ?? 0) >= cardBox.left &&
        (hotspotBox?.right ?? 0) <= cardBox.right &&
        (hotspotBox?.top ?? 0) >= cardBox.top &&
        (hotspotBox?.bottom ?? 0) <= cardBox.bottom,
    };
  });
  expect(Math.abs(geometry.cardRatio - geometry.imageRatio)).toBeLessThan(0.001);
  expect(geometry.hotspotInside).toBe(true);
  await page.getByRole("button", { name: "Inzoomen" }).click();
  await expect(page.getByTestId("world-one-map-inner")).toHaveAttribute(
    "style",
    /scale\(1\.25\)/,
  );
  await page.getByRole("button", { name: "Zoom herstellen" }).click();
  await page.getByRole("button", { name: "Bekijk wereld 2: Verdieping" }).click();
  const unlockDialog = page.getByRole("dialog", {
    name: "Wereld 2 vrijschakelen",
  });
  await expect(unlockDialog).toBeVisible();
  await expect(unlockDialog.getByText("0 / 5", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Misschien later" }).click();
  await page.getByRole("button", { name: "Ga naar wereld 1: Het Beginland" }).click();
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

test("opens all seven world games inside the permanent icon shell", async ({
  page,
}) => {
  test.setTimeout(60_000);
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Partner koppelen" }).click();
  await page.getByPlaceholder("ABC234 of 1111").fill("1111");
  await page.getByRole("button", { name: "Open beheerdersmodus" }).click();

  const games = [
    { id: "waarden", title: "Je waarden", visibleText: "Dit zijn mijn 3" },
    { id: "lach-samen", title: "Lach samen", visibleText: "1 / 15" },
    {
      id: "kennismaking",
      title: "Leer elkaar kennen",
      visibleText: "Hoe lang kennen jullie elkaar al?",
    },
    { id: "familiedorp", title: "Familiedorp", visibleText: "Zo werkt het" },
    {
      id: "kwaliteiten",
      title: "Jullie kwaliteiten",
      visibleText: "",
      visibleSelector: ".screen.active .swipe-next",
    },
    {
      id: "stille-vijver",
      title: "Stille vijver",
      visibleText: "",
      visibleSelector: ".screen.active h1",
    },
    {
      id: "brug-ontdekking",
      title: "Brug van ontdekking",
      visibleText: "",
      visibleSelector: ".screen.active h1",
    },
  ];

  for (const game of games) {
    await page.goto(`/games/${game.id}`);
    const frame = page.frameLocator(`iframe[title='${game.title}']`);
    const activeContent = "visibleSelector" in game
      ? frame.locator(game.visibleSelector)
      : frame.getByText(game.visibleText, { exact: false });
    await expect(activeContent).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Wachten op je reisgenoot...")).toHaveCount(0);
    await expect(
      frame.getByText("Doe mee met koppelcode", { exact: false }),
    ).toHaveCount(0);
    await expect(
      frame.locator(
        "a[href$='world.html'],button[onclick*='world.html']",
      ),
    ).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Terug naar de kaart" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chat openen" })).toBeVisible();
    await expect(
      page.locator("nav[aria-label='Vaste appbediening'] button[data-call-state]"),
    ).toHaveAttribute("data-call-state", "ready");
    await expect(page.getByRole("button", { name: "Opties openen" })).toBeVisible();

    if (game.id === "waarden") {
      await frame.locator(".chip").nth(0).click();
      await frame.locator(".chip").nth(1).click();
      await frame.locator(".chip").nth(2).click();
      await frame.getByRole("button", { name: /Dit zijn mijn 3/ }).click();
    } else if (game.id === "lach-samen") {
      await frame.locator("#btn-a").click();
    } else if (game.id === "kennismaking") {
      await frame.locator("#duur-choices button").first().click();
      await frame.locator("#kennis-choices button").first().click();
      await frame.getByRole("button", { name: "Dit klopt ✦" }).click();
      await expect(frame.getByText("Wat gaan jullie doen?")).toBeVisible();
    } else if (game.id === "familiedorp") {
      await frame.getByRole("button", { name: "Bouw mijn dorp →" }).click();
    } else if (game.id === "kwaliteiten") {
      await frame.locator(".screen.active .swipe-next").click();
    } else if (game.id === "stille-vijver") {
      await frame.locator(".screen.active .mode-card").first().click();
    } else if (game.id === "brug-ontdekking") {
      await frame.locator(".screen.active .stone-item").first().click();
      await frame.getByRole("button", { name: "Kies deze steen" }).click();
    }
    await expect(frame.locator("body")).toBeVisible();
  }
  expect(consoleErrors).toEqual([]);
});

test("sends the obsolete legacy world route back to the app", async ({ page }) => {
  await page.goto("/legacy/world.html");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByAltText("Kaart van wereld 1")).toBeVisible();
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
  await first.getByRole("button", { name: "Opties openen" }).click();
  await first.getByRole("button", { name: "Partner koppelen" }).click();
  await first.getByRole("button", { name: "Maak een code" }).click();
  const code = (await first.locator("[class*='pairCode']").innerText()).trim();

  await second.goto("/");
  await second.getByRole("button", { name: "Opties openen" }).click();
  await second.getByRole("button", { name: "Partner koppelen" }).click();
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
  await expect(
    first.getByRole("button", { name: "Chat openen", exact: true }),
  ).toBeVisible();
  await expect(
    second.getByRole("button", { name: "Chat openen", exact: true }),
  ).toBeVisible();
  await first.goto("/games/waarden");
  await expect(first.getByText("Wachten op je reisgenoot...")).toBeVisible();
  await expect(first.getByText("Browser Twee", { exact: true })).toBeVisible();
  await first.locator("[class*='waitingOptions'] button").first().click();
  await expect(first.getByRole("button", { name: "Nog eentje" })).toBeEnabled();
  await first.getByRole("button", { name: "Chat openen" }).click();
  await expect(first.getByPlaceholder("Schrijf iets...")).toBeVisible();
  await first.getByRole("button", { name: "Chat openen" }).click();
  await second.goto("/games/waarden");
  await expect(first.getByText("Browser Twee is er!")).toBeVisible();
  await expect(first.locator("iframe[title='Je waarden']")).toBeVisible({ timeout: 8_000 });
  await expect(second.locator("iframe[title='Je waarden']")).toBeVisible();
  await first.getByRole("button", { name: "Chat openen" }).click();
  await second.getByRole("button", { name: "Chat openen" }).click();
  await second.getByPlaceholder("Schrijf iets...").fill("Hallo vanuit browser twee");
  await second.getByRole("button", { name: "Bericht versturen" }).click();

  await expect(first.getByText("Hallo vanuit browser twee")).toHaveCount(1);
  await expect(
    first.locator("[class*='messages'] article[data-own='false']"),
  ).toContainText("Hallo vanuit browser twee");
  await expect(
    second.locator("[class*='messages'] article[data-own='true']"),
  ).toContainText("Hallo vanuit browser twee");
  await expect(
    second.getByRole("textbox", { name: "Bericht", exact: true }),
  ).toBeVisible();
  await first.getByRole("button", { name: "Chat openen" }).click();
  await second.getByPlaceholder("Schrijf iets...").fill("Nog een ongelezen bericht");
  await second.getByRole("button", { name: "Bericht versturen" }).click();
  await expect(
    first.getByRole("button", { name: "Chat openen, 1 ongelezen" }),
  ).toBeVisible();
  await first.getByRole("button", { name: "Chat openen, 1 ongelezen" }).click();
  await expect(first.getByRole("button", { name: "Chat openen" })).toBeVisible();
  await first.getByRole("button", { name: "Sluiten" }).click();
  await first.getByRole("button", { name: "Opties openen" }).click();
  await first.getByRole("button", { name: "Koppeling beheren" }).click();
  await first.getByRole("button", { name: "Ontkoppelen" }).click();
  await first.getByRole("button", { name: "Opties openen" }).click();
  await first.getByRole("link", { name: "Profiel beheren" }).click();
  await expect(first.getByRole("heading", { name: "Relatiearchieven" })).toBeVisible();
  await expect(first.getByText(/2 berichten.*0 ontdekkingen/)).toBeVisible();

  await firstContext.close();
  await secondContext.close();
});

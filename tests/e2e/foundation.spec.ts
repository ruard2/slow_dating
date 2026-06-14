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
  ).toBeHidden({ timeout: 30_000 });
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
      imageRatio: imageBox ? imageBox.width / imageBox.height : 0,
      naturalImageRatio:
        image?.naturalWidth && image.naturalHeight
          ? image.naturalWidth / image.naturalHeight
          : 0,
      hotspotInside:
        Boolean(hotspotBox) &&
        Boolean(imageBox) &&
        (hotspotBox?.left ?? 0) >= (imageBox?.left ?? cardBox.left) &&
        (hotspotBox?.right ?? 0) <= (imageBox?.right ?? cardBox.right) &&
        (hotspotBox?.top ?? 0) >= (imageBox?.top ?? cardBox.top) &&
        (hotspotBox?.bottom ?? 0) <= (imageBox?.bottom ?? cardBox.bottom),
    };
  });
  expect(
    Math.abs(geometry.naturalImageRatio - geometry.imageRatio),
  ).toBeLessThan(0.001);
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
  await expect(
    page.getByRole("heading", { name: "Profielinzichten" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Exporteer mijn gegevens" }),
  ).toBeVisible();
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
    {
      id: "waarden",
      title: "Je waarden",
      visibleText: "",
      visibleSelector: "[aria-label='Kies jouw drie waarden']",
      native: true,
    },
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
    if ("native" in game && game.native) {
      await expect(page.locator(game.visibleSelector)).toBeVisible({
        timeout: 15_000,
      });
      await expect(page.getByText("Wachten op je reisgenoot...")).toHaveCount(0);
      await expect(page.getByRole("link", { name: "Terug naar de kaart" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Chat openen" })).toBeVisible();
      await expect(
        page.locator("nav[aria-label='Vaste appbediening'] button[data-call-state]"),
      ).toHaveAttribute("data-call-state", "ready");
      await page.getByRole("button", { name: "Eerlijkheid kiezen" }).click();
      await page.getByRole("button", { name: "Trouw kiezen" }).click();
      await page.getByRole("button", { name: "Familie kiezen" }).click();
      await page.getByRole("button", { name: "Dit zijn mijn drie waarden" }).click();
      await expect(page.getByRole("button", { name: "Ontdekking afronden" })).toBeVisible();
      continue;
    }
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

    if (game.id === "lach-samen") {
      await frame.locator("#btn-a").click();
    } else if (game.id === "kennismaking") {
      await frame.locator("#duur-choices button").first().click();
      await frame.locator("#kennis-choices button").first().click();
      await frame.getByRole("button", { name: "Dit klopt" }).click();
      await expect(frame.getByText("Gesprekken bij het vuur")).toBeVisible();
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

test("lets an admin simulate an absent and arriving test partner", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Partner koppelen" }).click();
  await page.getByPlaceholder("ABC234 of 1111").fill("1111");
  await page.getByRole("button", { name: "Open beheerdersmodus" }).click();
  await page.getByRole("button", { name: "Sluiten" }).click();

  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Afwezig" }).click();
  await expect(page.getByText("Je krijgt eerst de centrale wachtkamer.")).toBeVisible();
  await page.getByRole("button", { name: "Sluiten" }).click();

  await page.goto("/games/waarden");
  await expect(page.getByText("Wachten op je reisgenoot...")).toBeVisible();
  await expect(page.getByText("Testpartner", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Aanwezig" }).click();
  await expect(page.getByText("Testpartner is er!")).toBeVisible();
  await expect(page.locator("main[data-native-game='waarden']")).toBeVisible({
    timeout: 8_000,
  });
});

test("restores the active game run after a refresh", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Opties openen" }).click();
  await page.getByRole("button", { name: "Partner koppelen" }).click();
  await page.getByPlaceholder("ABC234 of 1111").fill("1111");
  await page.getByRole("button", { name: "Open beheerdersmodus" }).click();

  await page.goto("/games/waarden");
  await expect(page.getByRole("button", { name: "Eerlijkheid kiezen" })).toBeVisible();
  await page.getByRole("button", { name: "Eerlijkheid kiezen" }).click();

  const nativeGame = page.locator("main[data-native-game='waarden']");
  await expect(nativeGame).toHaveAttribute("data-game-revision", /^[1-9]\d*$/);
  const runId = await nativeGame.getAttribute("data-game-run-id");
  const revision = await nativeGame.getAttribute("data-game-revision");

  await page.reload();
  const restoredGame = page.locator("main[data-native-game='waarden']");
  await expect(restoredGame).toBeVisible({ timeout: 8_000 });
  await expect(restoredGame).toHaveAttribute("data-game-run-id", runId ?? "");
  await expect(restoredGame).toHaveAttribute(
    "data-game-revision",
    revision ?? "",
  );
  await expect(page.getByRole("button", { name: "Eerlijkheid gekozen" })).toBeVisible();
});

test("pairs two browsers and delivers chat exactly once", async ({
  browser,
  isMobile,
}) => {
  test.setTimeout(60_000);
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
  await expect(first.locator("main[data-native-game='waarden']")).toBeVisible({ timeout: 8_000 });
  await expect(second.locator("main[data-native-game='waarden']")).toBeVisible();
  await first.getByRole("button", { name: "Eerlijkheid kiezen" }).click();
  const firstGame = first.locator("main[data-native-game='waarden']");
  const secondGame = second.locator("main[data-native-game='waarden']");
  await expect(firstGame).toHaveAttribute("data-game-revision", /^[1-9]\d*$/);
  const sharedRunId = await firstGame.getAttribute("data-game-run-id");
  await expect(secondGame).toHaveAttribute("data-game-run-id", sharedRunId ?? "");
  await expect.poll(async () => {
    const firstRevision = await firstGame.getAttribute("data-game-revision");
    const secondRevision = await secondGame.getAttribute("data-game-revision");
    return firstRevision === secondRevision ? firstRevision : null;
  }, { timeout: 8_000 }).toMatch(/^[1-9]\d*$/);
  const sharedRevision = Number(
    await firstGame.getAttribute("data-game-revision"),
  );
  await second.reload();
  const restoredSecondGame = second.locator("main[data-native-game='waarden']");
  await expect(restoredSecondGame).toHaveAttribute(
    "data-game-run-id",
    sharedRunId ?? "",
  );
  await expect.poll(async () =>
    Number(await restoredSecondGame.getAttribute("data-game-revision")),
  ).toBeGreaterThanOrEqual(sharedRevision);
  await expect.poll(async () => {
    const firstRevision = await firstGame.getAttribute("data-game-revision");
    const secondRevision = await restoredSecondGame.getAttribute(
      "data-game-revision",
    );
    return firstRevision === secondRevision ? firstRevision : null;
  }, { timeout: 8_000 }).toMatch(/^[1-9]\d*$/);
  await first.getByRole("button", { name: "Trouw kiezen" }).click();
  await first.getByRole("button", { name: "Familie kiezen" }).click();
  await first.getByRole("button", { name: "Dit zijn mijn drie waarden" }).click();
  await second.getByRole("button", { name: "Eerlijkheid kiezen" }).click();
  await second.getByRole("button", { name: "Rust kiezen" }).click();
  await second.getByRole("button", { name: "Groei kiezen" }).click();
  await second.getByRole("button", { name: "Dit zijn mijn drie waarden" }).click();
  await expect(
    first.getByRole("button", { name: "Ontdekking afronden" }),
  ).toBeVisible({ timeout: 8_000 });
  await expect(
    second.getByRole("button", { name: "Ontdekking afronden" }),
  ).toBeVisible();
  await first.getByRole("button", { name: "Ontdekking afronden" }).click();
  await expect(first).toHaveURL(/\/$/);
  await expect(first.getByText("1 / 5 ontdekkingen")).toBeVisible();
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
  await expect(first.getByText(/2 berichten.*1 ontdekking/)).toBeVisible();

  await firstContext.close();
  await secondContext.close();
});

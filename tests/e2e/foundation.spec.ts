import { expect, test } from "@playwright/test";

test("loads the modular foundation and reaches the API", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Slow Dating" }),
  ).toBeVisible();
  await expect(page.getByText("API verbonden")).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

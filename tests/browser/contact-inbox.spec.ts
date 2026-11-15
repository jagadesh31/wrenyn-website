import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test("contact submission reaches the admin inbox", async ({ page }) => {
  test.setTimeout(60_000);
  const secret = process.env.WRENYN_TEST_ADMIN_SECRET;
  const password = process.env.WRENYN_TEST_ADMIN_PASSWORD;
  if (!secret || !password) {
    throw new Error("Set WRENYN_TEST_ADMIN_SECRET and WRENYN_TEST_ADMIN_PASSWORD for the test inbox.");
  }

  const email = "wrenyn-smoke@example.com";
  const message = `Contact inbox smoke test ${randomUUID()}`;
  await page.goto("/contact");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Your message").fill(message);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("Your message is with us.", { timeout: 20_000 });

  await page.goto("/admin");
  await page.getByLabel("Secret", { exact: true }).fill(secret);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  const search = page.getByRole("searchbox", { name: "Search contact requests" });
  await expect(search).toBeVisible({ timeout: 20_000 });
  await search.fill(message);
  const request = page.locator("article").filter({ hasText: message });
  await expect(request).toHaveCount(1);
  const reply = await request.getByRole("link", { name: email }).getAttribute("href");
  expect(decodeURIComponent(reply ?? "")).toContain(`mailto:${email}?subject=Re: `);
});

import { expect, test } from "@playwright/test";

for (const width of [320, 390, 1440]) {
  test(`public pages fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/products/kexoz", "/products/ochiro", "/contact"]) {
      expect((await page.goto(path))?.ok(), path).toBe(true);
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        scrollbar: getComputedStyle(document.documentElement).scrollbarWidth,
      }));
      expect(layout.overflow, path).toBeLessThanOrEqual(1);
      expect(layout.scrollbar, path).not.toBe("none");
      if (path === "/") {
        const heroBottom = await page.locator(".company-hero").evaluate(hero => hero.getBoundingClientRect().bottom);
        expect(heroBottom).toBeGreaterThanOrEqual(899);
      }
    }
  });
}

test("Products menu supports keyboard navigation and dismissal", async ({ page }) => {
  await page.goto("/");
  const trigger = page.locator("summary").filter({ hasText: "Products" });
  const product = page.getByRole("link", { name: /Kexoz Share builds/ });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(product).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(product).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/products\/kexoz$/);
  await expect(page.getByRole("link", { name: "Start with Kexoz" }))
    .toHaveAttribute("href", "https://kexoz.dev/docs#quickstart");
  const preview = page.locator("video[aria-label='Kexoz pinned feedback demo']");
  await preview.scrollIntoViewIfNeeded();
  await preview.evaluate(async (element: HTMLVideoElement) => {
    element.muted = true;
    await element.play();
  });
  await expect.poll(() => preview.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
});

test("mobile contact form shows failure and supports retry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  const email = "wrenyn-smoke@example.com";
  const message = "A mobile contact form check.";
  let attempts = 0;
  await page.route("**/api/contact", async route => {
    expect(route.request().postDataJSON()).toMatchObject({ email, message });
    attempts += 1;
    await route.fulfill(attempts === 1
      ? { status: 503, json: { error: "Please try again shortly." } }
      : { json: { ok: true } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Share your idea/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Email").fill(email);
  await dialog.getByLabel("Your message").fill(message);
  await dialog.getByRole("button", { name: "Send message" }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Please try again shortly.");
  await dialog.getByRole("button", { name: "Send message" }).click();
  await expect(dialog.getByRole("status")).toContainText("Your message is with us.");
  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(dialog).toBeHidden();
});

import { defineConfig } from "@playwright/test";

const remoteUrl = process.env.WRENYN_TEST_URL;
const localUrl = "http://127.0.0.1:3190";

export default defineConfig({
  testDir: "./tests/browser",
  use: { baseURL: remoteUrl || localUrl, reducedMotion: "reduce" },
  webServer: remoteUrl ? undefined : {
    command: "npm run start -- --hostname 127.0.0.1 --port 3190",
    url: localUrl,
  },
});

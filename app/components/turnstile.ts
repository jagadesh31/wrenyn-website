type TurnstileApi = {
  render(el: HTMLElement, options: Record<string, unknown>): string | undefined;
  reset(id: string): void;
  remove(id: string): void;
};

declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_TIMEOUT_MS = 30_000;

let scriptLoad: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  scriptLoad ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile unavailable")));
    s.onerror = () => {
      scriptLoad = null;
      s.remove();
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptLoad;
}

export type Challenge = {
  /** Resolves with a token, waiting for the check (or the visitor's click) if it hasn't finished yet. */
  token(): Promise<string>;
  /** Tokens are single-use: call after every submission so the next attempt gets a fresh one. */
  consume(): void;
  remove(): void;
};

export function mountTurnstile(el: HTMLElement, siteKey: string, action: string): Challenge {
  let api: TurnstileApi | undefined;
  let id: string | undefined;
  let token = "";
  let error: Error | null = null;
  let removed = false;
  let waiters: { resolve: (t: string) => void; reject: (e: Error) => void }[] = [];

  const settle = () => {
    if (!token && !error) return;
    const pending = waiters;
    waiters = [];
    for (const w of pending) token ? w.resolve(token) : w.reject(error!);
  };

  loadTurnstile()
    .then((ts) => {
      if (removed) return;
      api = ts;
      id = ts.render(el, {
        sitekey: siteKey,
        action,
        appearance: "always",
        size: "flexible",
        theme: "light",
        "refresh-expired": "auto",
        callback: (t: string) => { token = t; error = null; settle(); },
        "expired-callback": () => { token = ""; },
        "error-callback": () => { error = new Error("Verification failed"); settle(); return true; },
      });
    })
    .catch((e: Error) => { error = e; settle(); });

  return {
    token() {
      if (token) return Promise.resolve(token);
      if (error) {
        const e = error;
        // A widget error is retried with a fresh challenge; a script load failure stays until the modal reopens.
        if (api && id) { error = null; api.reset(id); }
        return Promise.reject(e);
      }
      return new Promise<string>((resolve, reject) => {
        const timer = setTimeout(() => {
          waiters = waiters.filter((w) => w.resolve !== done);
          reject(new Error("Verification timed out"));
        }, TOKEN_TIMEOUT_MS);
        const done = (t: string) => { clearTimeout(timer); resolve(t); };
        waiters.push({ resolve: done, reject: (e) => { clearTimeout(timer); reject(e); } });
      });
    },
    consume() {
      token = "";
      if (api && id) api.reset(id);
    },
    remove() {
      removed = true;
      if (api && id) api.remove(id);
      error = new Error("Closed");
      settle();
    },
  };
}

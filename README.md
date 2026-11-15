# Wrenyn website

Company site for Wrenyn, with individual product pages for Kexoz and Ochiro.

## Local development

```sh
npm install
npm run dev
```

The public pages work without database configuration. The contact form needs a PostgreSQL connection to save requests.

## Contact requests

Configure the variables shown in `.env.example` in `.env.local` or your hosting environment:

- `DATABASE_URL`: PostgreSQL connection for contact requests and existing site data.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile keys for the site's hostname. The public key must be set before building. Production rejects unverified submissions when these are missing.
- `ADMIN_SECRET` and `ADMIN_PASSWORD`: protect the admin area.

The contact form accepts any valid email address, an optional name, a topic, and a message. Requests are saved to `contact_requests`; the table is created automatically by the existing database setup with row-level security enabled. `/admin` shows a searchable inbox with a reply link to open your email app. Submissions do not send email or enroll visitors in a newsletter. Existing waitlist records remain accessible in the admin area.

### Inbox ownership

The primary owner checks `/admin` each business day and replies from the team mailbox. During absences, the backup covers the inbox. Use the mailbox’s sent history to see which requests have already received a reply. Keep the owner contact details in the internal handoff.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

Tests require Node.js 22.6 or newer. The unit tests cover contact input validation, including company email addresses and length limits.

### Browser checks

Build the site without Turnstile keys for the standalone UI checks. These checks cover responsive layouts, the Products menu by keyboard, and the mobile contact dialog with simulated server responses.

```sh
npx playwright install chromium
npm run build
npm run test:browser
```

### Contact inbox check

Use a local production build with an isolated PostgreSQL database, test admin credentials, and [Cloudflare Turnstile test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/). Configure the public key before building, and configure the secret key on the server.

Supply `WRENYN_TEST_ADMIN_SECRET` and `WRENYN_TEST_ADMIN_PASSWORD` through your environment. Then run `npm run test:contact-inbox`. It starts the local production build, saves a uniquely marked test request, checks that it appears in the searchable admin inbox, and verifies the reply address and subject.

### Release checks

The **Verify website** GitHub Actions workflow runs the unit tests, production build with TypeScript checks, and Chromium browser checks on pushes and pull requests.

`/products` and `/about` intentionally have no page. The Products menu links to individual product routes.

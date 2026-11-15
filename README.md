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

## Checks

```sh
npm run typecheck
npm test
npm run build
```

Tests require Node.js 22.6 or newer. The test suite covers contact input validation, including company email addresses and length limits. A real submission and admin-inbox check also require the database and verification configuration above.

`/products` and `/about` intentionally have no page. The Products menu links to individual product routes.

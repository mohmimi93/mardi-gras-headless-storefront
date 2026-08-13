# Mardi Gras Apparel: Odoo catalog integration

This package connects the Next.js storefront catalog to the custom Odoo 19
headless API on the Odoo.sh staging database.

## Install on Windows

1. Stop the development server with `Ctrl+C`.
2. Extract this ZIP into the root of `mardi-gras-headless-storefront` and choose
   **Replace the files in the destination**.
3. Delete `src\middleware.ts` if it still exists. Next.js 16 uses
   `src\proxy.ts` from this package instead.
4. In PowerShell, from the repository folder, create your local environment
   file:

   ```powershell
   Copy-Item .env.example .env.local
   notepad .env.local
   ```

5. Put these values in `.env.local`:

   ```dotenv
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ODOO_BASE_URL=https://logoexpress-staging-36327286.dev.odoo.com
   ODOO_HEADLESS_API_TOKEN=PASTE_A_NEW_TOKEN_HERE
   ```

   Do not add quotes and do not put spaces around `=`. The API token is a
   server-only secret. Never prefix it with `NEXT_PUBLIC_`, commit it, or paste
   it in chat. Revoke the token previously shared in chat and generate a new
   one before using this file.

6. Install the added dependency and start the site:

   ```powershell
   npm install
   npm run dev
   ```

7. Open `http://localhost:3000`, then test the home page, Shop, a category, a
   product, and search.

## What is connected

- Odoo product list and pagination
- Product detail and variants
- Public product categories
- Odoo product/category images
- Storefront search
- Odoo USD prices
- Inventory status returned by the current API

The browser never receives the Odoo API token. Requests are made from the
Next.js server. If Odoo environment variables are absent, the starter's local
JSON repositories remain available as a development fallback.

## Current scope

Cart interaction remains local in the browser. Checkout and customer accounts
are intentionally disabled until the matching Odoo API stages are implemented.
Stripe and UPS are therefore not activated by this package.

## Commit with GitHub Desktop

After the local tests pass, use this commit summary:

```text
Connect storefront catalog to Odoo staging
```

Commit to your storefront branch and push it to GitHub. Never select or commit
`.env.local`; it is already ignored by Git.

# Honchar Collective

Website and inventory system for Honchar Collective — authentic luxury handbags,
shoes, watches, jewelry, and ready-to-wear, bought in the United States and
delivered to customers in the Dominican Republic.

Built on the same foundation as the Honchar Auto site (same store-first flow,
dashboard, metrics, and lead handling), re-themed in black and gold and
re-modelled for luxury resale and importing.

Two halves:

- **The public site** — a landing page with highlighted rows (The Edit, Just in,
  Arriving soon, designers), a full shop page with faceted filtering, and detail
  pages built around WhatsApp, authenticity, and layaway.
- **The dashboard** at `/admin` — where the team adds, edits, and removes pieces,
  records landed costs, uploads photos, works through leads, and reads the metrics.
  No developer needed.

## What's different from Honchar Auto

| Honchar Auto | Honchar Collective |
| --- | --- |
| Year / make / model / body type | Brand / name / category, plus size, color, material, hardware |
| New / Used / Certified | New / Excellent / Very Good / Good / Fair, with what each grade means |
| Truck specs (GVWR, CDL, axle…) | Authenticity (flag, staff-only serial, shopper note) and "comes with" (box, dust bag, receipt…) |
| — | **Import tracking**: each piece is *In the DR* or *In transit* with an expected arrival date. In-transit pieces can be reserved before they land and have their own homepage row and filter. |
| — | **Landed cost**: purchase price + shipping/customs per piece (staff-only), live profit/margin in the editor, and margin + gross profit on the dashboard |
| — | **WhatsApp** is the primary contact everywhere, and every tap is tracked per piece and shown on the dashboard alongside form enquiries |
| Financing calculator | Interest-free **layaway** calculator (deposit %, number of payments, weekly/biweekly/monthly) |
| Sell / trade page | **Request an item** — personal sourcing from the US |
| Email required on enquiries | A WhatsApp number *or* an email is enough |
| Prices in USD | USD, with an approximate RD$ line under every price (rate set in `site.ts`) |

## Before going live

These are placeholders and must be replaced:

- **Phone / WhatsApp number, email, Instagram handle** in `src/lib/site.ts` — the
  number is a fictional 555 number.
- **Showroom address** (`address` in `site.ts`) — currently `null`, so the site
  says "Santo Domingo, by appointment".
- **USD → DOP rate** (`dopPerUsd` in `site.ts`).
- **Logo and hero photo** — see `public/README.md`. Until then, a typeset gold
  wordmark and a black hero with a gold glow are used.
- **Tracking IDs** — the Honchar Auto Google Ads and Meta pixel IDs were removed.
  Set `NEXT_PUBLIC_GOOGLE_ADS_ID` / `NEXT_PUBLIC_META_PIXEL_ID` for the
  Collective's own accounts to switch them on.

## Stack

| Piece      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Server Actions), TypeScript |
| Styling    | Tailwind CSS v4, Bodoni Moda + Jost                 |
| Database   | PostgreSQL via Prisma                               |
| Auth       | Email + password accounts, signed JWT session cookie |
| Photos     | Vercel Blob in production, `public/uploads` locally |

---

## Running it locally

You need Node 20+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env          # then fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET
npm run db:migrate            # create the tables
npm run db:seed               # optional: demo collection, traffic, leads + an owner login
npm run dev
```

Open http://localhost:3000. The dashboard is at http://localhost:3000/admin.

**First sign-in.** If no accounts exist, `/admin/login` shows a one-time setup form —
fill it in and you become the owner. If you ran the seed, sign in with
`owner@honcharcollective.com` / `collective1234` and change the password under **Team**.

### Useful commands

```bash
npm run dev         # development server
npm run build       # production build (generates the client, migrates, then builds)
npm run build:nodb  # build without touching the database
npm run start       # serve the production build
npm run lint        # eslint
npm run db:migrate  # create + apply a migration after editing the schema
npm run db:deploy   # apply existing migrations (used in production)
npm run db:seed     # reset items, leads, and visits to the demo set
npm run db:studio   # browse the database in a GUI
```

---

## Going live on Vercel

Roughly 20 minutes, all of it in the Vercel dashboard.

**1. Import the repo.** New Project → pick this repository → framework preset Next.js.
Set the **production branch** under Settings → Git to whichever branch you want live.

**2. Create the database.** Storage → create a Postgres store (Neon is Vercel's default)
→ connect it to this project. It injects the connection strings automatically.

**3. Create the Blob store.** Storage → Blob → connect to this project. This is
**required**, not optional — Vercel's filesystem is read-only, so without it every photo
upload fails.

**4. Add two environment variables** (Settings → Environment Variables):

| Name                    | Value                                              |
| ----------------------- | -------------------------------------------------- |
| `AUTH_SECRET`           | output of `openssl rand -base64 32` — required     |
| `NEXT_PUBLIC_SITE_URL`  | `https://yourdomain.com` — add once the domain is live |

You do **not** need to hand-copy database URLs. The build resolves whatever names your
provider injected (`DATABASE_URL`, `POSTGRES_PRISMA_URL`, `DATABASE_URL_UNPOOLED`,
`POSTGRES_URL_NON_POOLING`) and picks a pooled and a direct connection itself. If
something genuinely required is missing, the build stops with a message saying exactly
what to add — see `scripts/migrate.mjs`.

**5. Deploy.** The build runs the database migrations first, so the tables are created on
that first deploy.

**6. Create the owner account.** Visit `https://your-site/admin`. With no accounts in the
database yet, it shows a one-time setup form. Fill it in and you're the owner. That form
disappears permanently once an account exists.

**7. Add the domain.** Settings → Domains → add your domain. Vercel shows the exact
DNS records to paste at the registrar. Then set `NEXT_PUBLIC_SITE_URL` to the real domain
and redeploy so canonical links and the sitemap point at it.

### Putting up a test version first

A test site is the same deployment as production, minus the domain. Deploy to
Vercel and use the `*.vercel.app` URL it hands back — that URL is the test site.
Point the custom domain at it only when you're ready to go live.

Test and preview deployments protect themselves:

- **They are closed to search engines.** `robots.txt` returns `Disallow: /` on
  any non-production deployment, so sample inventory is never indexed under the
  boutique's name.
- **They say so on screen.** An amber bar across the top marks the site as a
  preview with sample data.

On Vercel this is automatic — `VERCEL_ENV` distinguishes production from
preview. Hosting elsewhere, set `NEXT_PUBLIC_SITE_ENV=test` on the test
deployment to get the same behaviour.

To keep the test site away from the public entirely, Vercel Pro's Deployment
Protection can require a login before the preview URL loads.

### After it's live

- **Search engines.** `robots.txt` and `sitemap.xml` are generated automatically, and the
  sitemap lists every published piece. Submit `https://yourdomain.com/sitemap.xml` in
  Google Search Console to speed up indexing.
- **The dashboard is excluded** from indexing at both the robots and page-metadata level.
- **Demo data.** Production starts empty. Don't run `npm run db:seed` against it — that
  command deletes all items, leads, and visit data before inserting the demo set.
- **Backups.** Neon keeps automatic point-in-time backups on paid tiers; on the free tier,
  take a periodic `pg_dump` if the inventory matters.

---

## Day-to-day: managing inventory

Everything lives under `/admin`.

**Add a piece.** Inventory → *Add a piece*. Only Brand, Name, Category, and Asking
price are required — fill in the rest whenever you have it. Drag photos onto the
upload box (or tap to browse from a phone); the first photo is the one shoppers
see in the grid. Portrait photos suit the 4:5 cards best.

**List it while it's still on the way.** Set *Where it is* to *In transit* and add
the expected arrival date. The listing shows "Arrives Nov 12", appears in the
*Arriving soon* row and filter, and asks shoppers to reserve it before it lands.
Switch it to *In the DR* when the box is unpacked.

**Record the landed cost.** Enter the US purchase price and the shipping + customs
cost. The editor shows the profit and margin at the asking price as you type.
These numbers are staff-only.

**Authenticity.** Tick *Inspected and authenticated* once the piece is checked. The
date code/serial is staff-only; the optional shopper note replaces the standard
authenticity text on the listing.

**Statuses.**

- **Live** — visible on the website.
- **Draft** — hidden from shoppers. Use this while you're still taking photos.
- **Sold** — stays online with a *Sold* badge and a "find me one" prompt, which is
  good for search traffic and sourcing requests. Hit *Relist* if it comes back.

**Price drops.** Lower a price and the old one is remembered automatically — the
listing then shows a green price-drop badge.

**Featured (★).** Puts a piece in *The Edit* on the homepage and at the top of the
shop's default sort.

**Copy.** Duplicates a listing as a draft — handy for the same bag in two colours.
Authentication is cleared on the copy, since it's per piece.

**The inventory screen** opens with four figures for the live collection: pieces
live (and how many are in transit), stock at asking price, landed cost of stock,
and potential profit. Each row shows days listed, landed cost, and the last 30
days of views, WhatsApp taps, and leads — the quickest way to spot a piece that
needs a price cut.

**Leads.** Every enquiry from a listing, the layaway and request pages, or the
contact form lands under Leads with the piece it was about. A phone number opens
WhatsApp with a greeting already typed. Mark them contacted or closed as you work
through them; the nav badge counts the new ones.

**Team.** Owners can add staff accounts and change their own password. Staff can
manage inventory and leads but not the team.

## Performance metrics

The metrics page has nine numbers, for any time window, with an optional
comparison against the period before:

| Metric | Where it comes from |
| ------ | ------------------- |
| Avg. days on market | Time between a piece first going **Live** and being marked **Sold** |
| Avg. sold vs. asking | Sale price as a share of the price it was *first* listed at |
| Longest listed | Oldest piece still live, and which one |
| Avg. margin | (Sale price − landed cost) ÷ sale price, across sales with a cost recorded |
| Gross profit | Sale price − landed cost, summed over the period |
| Form enquiries | Every enquiry received |
| WhatsApp taps | Taps on any WhatsApp button — most enquiries in the DR start here |
| Site visits | Distinct browsing sessions |
| Avg. time on site | Average session length |

Below them: where visitors came from (Instagram, Google, WhatsApp, Facebook,
TikTok, direct…) and which pieces got looked at, with views, time on page,
enquiries, and WhatsApp taps per piece.

- **The listing clock starts when a piece goes Live**, not when it's created, so
  time spent as an unphotographed draft isn't counted against it.
- **Marking a piece sold asks for the final price**, and margin needs the landed
  cost. Both are optional, so they never block recording a sale, but a sale saved
  without them is left out of those averages rather than distorting them.

A metric with no data shows a dash and says why, rather than a zero.

### About the visitor tracking

Visits and WhatsApp/call taps are recorded by the site itself, into your own database. No third-party
analytics, no cookies, no IP addresses, no fingerprinting — a session id generated
in the browser and held in `sessionStorage`, the page path, and how long the visitor
stayed. Nothing that identifies a person, which is why there is no consent banner.

Obvious crawlers are filtered by user agent so they don't inflate the counts. Bots
that disguise themselves will still get through; the numbers are a good indicator,
not an audited figure.

Sessions last as long as a browser tab. Someone who returns tomorrow counts as a new
visit, which is the usual convention.

## Changing the boutique's details

Phone, WhatsApp, email, Instagram, address, hours, the exchange rate, the usual
shipping time, categories, suggested brands, and the "comes with" checklist all
live in one file: [`src/lib/site.ts`](src/lib/site.ts). Edit it and redeploy —
the header, footer, contact page, filters, and admin form all read from it.

**Spanish and English.** The public site opens in Spanish; the ES | EN toggle in
the header switches it and remembers the choice in a cookie. Every word of site
copy, in both languages, is in [`src/lib/i18n/dictionaries.ts`](src/lib/i18n/dictionaries.ts)
— edit the text there. Categories, conditions, and "comes with" options are stored
in English and only translated for display, using the tables at the bottom of each
dictionary; a new category added in `site.ts` needs a Spanish name added there too.
Piece names and descriptions are shown exactly as typed. The dashboard is English
only.

Layaway defaults (deposit, number of payments, minimum price) are in
[`src/lib/finance.ts`](src/lib/finance.ts).

The colours are in [`src/app/globals.css`](src/app/globals.css). The neutral
`ink` scale runs dark-to-light (ink-50 is the black page, ink-900 the ivory text),
and the `gold` scale holds the accent.

---

## How the shop page works

Filters are held in the URL (`/shop?category=Handbags&brand=Chanel&priceMax=5000`),
so results are shareable, bookmarkable, back-button friendly, and rendered on the
server for SEO. Option counts next to each filter are computed live against the rest
of the active filters, so you never click into an empty result set.

Filterable: keyword, availability (still available / sold), where it is (ready now /
arriving soon), category, designer, price, condition, size, and who it's for.

Pieces with no photos yet fall back to a gold line drawing of their category in
their colour, with the brand set underneath, so a half-photographed collection
still looks deliberate.

## Project layout

```
prisma/
  schema.prisma            data model
  seed.ts                  demo collection, traffic, and leads
scripts/
  migrate.mjs              resolves database env vars, migrates during deploy
src/
  app/
    (site)/                public site — landing, shop, detail, layaway, request, etc.
    admin/                 dashboard (login + inventory, leads, team)
    actions/               server actions: auth, items, leads, admin
    api/upload             photo uploads
    api/items              lookup for the saved-pieces page
  components/              shared UI; components/admin/* is dashboard-only
  lib/                     data access, auth, formatting, finance, site config
  proxy.ts                 redirects signed-out visitors away from /admin
  app/robots.ts            search-engine rules
  app/sitemap.ts           every public page plus one entry per listed piece
```

## Security notes

- Passwords are hashed with bcrypt (cost 12); sessions are signed JWTs in an
  httpOnly, sameSite=lax cookie that expires after 14 days.
- `src/proxy.ts` only checks that a session cookie exists — every admin page and
  server action independently re-verifies the token and reloads the user, so
  deleting an account revokes access immediately.
- All form input is validated with zod on the server before it touches the database.
- Public forms carry a honeypot field to absorb basic bot spam.

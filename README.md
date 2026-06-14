# waitlist-cloudflare

![METAREIGNITY Waitlist](/public/opengraph-image.png)

`waitlist-cloudflare` is a lightweight, high-performance, and secure Next.js 15 waitlist boilerplate designed for native serverless edge deployment on **Cloudflare Workers** using the **OpenNext Cloudflare adapter**. 

It uses **Cloudflare D1** as the primary SQL data store and **Upstash Redis** for edge rate-limiting.

**Live Demo:** [waitlist.metareignity.com](https://waitlist.metareignity.com)

---

## Core Features

- **Next.js 15 & React 19:** Built on Next.js `15.5.18` to guarantee compatibility and prevent handler bundling errors on Cloudflare Workers.
- **Cloudflare D1 Database:** Primary SQL database mapping waitlist records natively at the edge. Includes schema files and quick D1 migration commands.
- **Referral Tracking Swarm:** Auto-generates unique, lightweight referral codes for registrants and tracks referring nodes.
- **Upstash Redis rate limiting:** Implements sliding-window IP rate limiting to prevent spam submissions.

---

## Prerequisites & External Services Setup

To run this boilerplate, you need to configure the following services:

### 1. Cloudflare Account & D1 Database
1. Create a Cloudflare account.
2. Initialize your D1 SQL database:
   ```bash
   npx wrangler d1 create waitlist-db
   ```
3. Copy the generated `database_id` and name into your `wrangler.jsonc` file.

### 2. Upstash Redis
1. Create a serverless Redis database at [Upstash](https://upstash.com/).
2. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from your database details page.

---

## Local Development Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Meta-Reignity/waitlist-cloudflare.git
   cd waitlist-cloudflare
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure D1 Local Schema:**
   Apply the migration to initialize the SQLite database locally:
   ```bash
   npx wrangler d1 execute waitlist-db --file=schema.sql --local
   ```

4. **Environment Variables:**
   Create a local environment variables file `.dev.vars` in the root (Cloudflare equivalent of `.env.local` for local wrangler testing):
   ```env
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

5. **Start Development Server:**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Production Deployment

1. **Apply D1 Production Migration:**
   Create the database schema on your live Cloudflare D1 instance:
   ```bash
   npx wrangler d1 execute waitlist-db --file=schema.sql --remote
   ```

2. **Configure wrangler.jsonc Bindings:**
   Add D1 binding details and your custom domain target:
   ```jsonc
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "waitlist-db",
       "database_id": "<your-cloudflare-d1-db-uuid>"
     }
   ],
   "routes": [
     {
       "pattern": "waitlist.yourdomain.com",
       "custom_domain": true
     }
   ]
   ```

3. **Deploy live to Cloudflare:**
   Compile the Next.js bundle and upload the worker to Cloudflare:
   ```bash
   pnpm run deploy
   ```

4. **Configure Production Environment Variables:**
   Go to your Cloudflare Dashboard -> **Workers & Pages** -> Select **waitlist-cloudflare** -> **Settings** -> **Variables** -> Add all variables listed in your local `.dev.vars` file.

---

## LLM Compatibility
This repository includes an [llm.txt](llm.txt) file at the root containing standardized markdown context about the architecture, folder layout, and parameters for LLM-based coding agents (like Cursor, Gemini, Copilot) to ingest.

---

## License
Open-sourced and maintained by [METAREIGNITY](https://metareignity.com). Distributed under the [MIT License](LICENSE).

# waitlist-cloudflare

![METAREIGNITY Waitlist](/public/opengraph-image.png)

`waitlist-cloudflare` is a lightweight, high-performance, and secure Next.js 15 waitlist boilerplate designed for native serverless edge deployment on **Cloudflare Workers** using the **OpenNext Cloudflare adapter**. 

The stack is **100% Cloudflare-only** and requires zero external service configurations.

**Live Demo:** [waitlist.metareignity.com](https://waitlist.metareignity.com)

---

## Core Features

- **Next.js 15 & React 19:** Built on Next.js `15.5.18` to guarantee compatibility and prevent handler bundling errors on Cloudflare Workers.
- **Cloudflare D1 Database:** Primary SQL database mapping waitlist records natively at the edge. Includes schema files and quick D1 migration commands.
- **Referral Tracking Swarm:** Auto-generates unique, lightweight referral codes for registrants and tracks referring nodes.
- **Native D1 Rate Limiting:** Implements IP rate limiting natively inside Cloudflare D1 with a `rate_limits` table to prevent spam submissions, requiring no external databases or Redis instances.

---

## Prerequisites & Setup

To run this boilerplate, you only need a Cloudflare Account.

### Cloudflare Account & D1 Database
1. Create a Cloudflare account.
2. Authenticate the wrangler CLI locally:
   ```bash
   npx wrangler login
   ```
3. Initialize your D1 SQL database:
   ```bash
   npx wrangler d1 create waitlist-db
   ```
4. Copy the generated `database_id` and name into your `wrangler.jsonc` file.

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

4. **Start Development Server:**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` in your browser. (Note: No local `.env` or `.dev.vars` environment variables are needed!).

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

No production environment variables or secret keys are needed in the Cloudflare Dashboard!

---

## LLM Compatibility
This repository includes an [llm.txt](llm.txt) file at the root containing standardized markdown context about the architecture, folder layout, and parameters for LLM-based coding agents (like Cursor, Gemini, Copilot) to ingest.

---

## GitHub Repository Recommendations

To optimize your repository on GitHub, configure the **About** section on the right side of the repository page as follows:

*   **Description:** ⚡ 100% Cloudflare-Native Next.js 15 Waitlist Boilerplate. Powered by Cloudflare D1 SQL, edge rate-limiting, referral swarms, and interactive WebGL shaders. Zero external dependencies.
*   **Website:** `https://waitlist.metareignity.com`
*   **Topics:** `nextjs`, `react`, `cloudflare-workers`, `cloudflare-pages`, `cloudflare-d1`, `sqlite`, `waitlist`, `boilerplate`, `tailwindcss`, `webgl`

---

## Multi-Domain Deployment Strategy

If you want to maintain two separate sites (e.g., `waitlist.metareignity.com` as the waitlist boilerplate, and `metareignity.com` as your primary brand website) using the same code repository but with different configurations (`llm.txt`, custom domains, text copy), here are the two standard ways to manage this systematically:

### Option A: Config-Based Builds (Single Git Branch — Recommended)
Instead of maintaining separate git branches (which leads to merge conflicts over time), you keep all changes in a single branch (`main`) and split domain configurations into distinct files:

1. **Create Environment Configuration Files:**
   * Rename `wrangler.jsonc` to `wrangler.waitlist.jsonc` (for waitlist) and create a `wrangler.brand.jsonc` (for `metareignity.com`).
   * Create `public/llm.waitlist.txt` and `public/llm.brand.txt`.
2. **Add Custom Deploy Commands to `package.json`:**
   Add target deployment scripts that copy the correct configuration before running the OpenNext/Wrangler build:
   ```json
   "scripts": {
     "deploy:waitlist": "node scripts/switch-env.js waitlist && opennextjs-cloudflare build && opennextjs-cloudflare deploy",
     "deploy:brand": "node scripts/switch-env.js brand && opennextjs-cloudflare build && opennextjs-cloudflare deploy"
   }
   ```
This guarantees that you can deploy either site with a single command from `main`, without managing code drift across Git branches.

### Option B: Branch-Specific Commits (Multi-Branch Git Strategy)
If the two sites are highly divergent in content, use git branch staging:

1. **Branch Layout:**
   * `main`: Serves as the boilerplate and deploys to `waitlist.metareignity.com`.
   * `brand-site`: Derived from `main` but contains custom configurations and custom landing page text, deploying to `metareignity.com`.
2. **Git Workflow:**
   * Make core feature additions, security updates, and bug fixes on `main`.
   * When features are complete, merge `main` into `brand-site`:
     ```bash
     git checkout brand-site
     git merge main
     ```
   * **Handling Config Drift:** Use a `.gitattributes` merge driver (e.g., setting `wrangler.jsonc merge=ours` and `public/llm.txt merge=ours` inside a `.gitattributes` file) to ensure Git never overwrites the branch-specific configurations during merges.

---

## License
Open-sourced and maintained by [METAREIGNITY](https://metareignity.com). Distributed under the [MIT License](LICENSE).

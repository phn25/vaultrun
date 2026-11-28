# Learning Log

What I learned building VaultRun, one entry per step. Each entry: what we did, what I learned, why it matters, and how I'd say it in an interview.

---

## 2026-10-19 · Week 1 Session 1: Windows PC setup

### WSL2 + Ubuntu
- WSL2 is a lightweight Linux VM built into Windows.
- Code lives in the Linux home folder (`~/code`), not `/mnt/c`, because Linux reads its own files much faster.
- `apt` installs software; `sudo` runs a command as admin.
- **Why Linux at all?** Production (AWS, Docker, GitHub Actions) is Linux, so developing on Linux avoids path, line-ending and case-sensitivity surprises.
- **Interview:** "I develop in WSL2 so my local environment matches the Linux containers I deploy to."

### Git + SSH
- `git config --global` saves name and email in `~/.gitconfig`. The GitHub no-reply email keeps my personal address out of public history.
- SSH key pair: GitHub holds the public key; the private key (`~/.ssh/id_ed25519`) never leaves the PC.
- **Interview:** "I authenticate to GitHub with an ed25519 SSH key, so no passwords or tokens live in files."

### nvm + Node 24 LTS
- nvm installs Node in my home folder and lets each project pin its version (`.nvmrc`).
- LTS is the long-term-support line meant for production.
- **Interview:** "I pin the Node version per project so dev, CI and production match."

### pnpm
- A package manager like npm, faster and stricter (one shared store, no phantom dependencies).
- `package.json` lists dependencies and scripts; `pnpm install` downloads them, `pnpm dev` runs the dev server.
- npm now asks before running install scripts, a supply-chain defense.

### VS Code + WSL
- The window runs on Windows; the VS Code Server runs in Ubuntu next to the files and tools.
- The "WSL: Ubuntu" badge (bottom left) shows which side I'm on. If it's missing: click the blue `><` button → Connect to WSL, or run `code .` from the Ubuntu terminal.

### Docker Desktop
- An **image** is like a class (files on disk, uses no CPU/RAM); a **container** is like an object made from it (`docker run` ≈ `new`).
- A container is a running program in its own sealed box with its own files, software and network. It's lighter than a VM because it shares the Linux kernel.
- One image runs the same on my PC and on AWS: no more "works on my machine".
- `docker images` lists images; `docker ps -a` lists containers.
- "Permission denied on docker.sock" meant my session started before I joined the `docker` group; `wsl --shutdown` gave a fresh session.
- Daily routine: quit Docker Desktop after each session (hidden-icons ^ arrow near the clock) to free RAM.
- **Interview:** "I run dependencies like Postgres in Docker, so anyone can start the project with one command."

### Q&A
- **What is Next.js?** React builds screens from components; Next.js is the framework on top that adds pages/URLs, a server side and a production build.
- **What are Maven/Gradle?** Java build tools that download a project's libraries, then compile, test and package. pnpm does the same job for JavaScript.

---

## 2026-10-20 · Week 1 Session 2: repo and Next.js app

### Step 1: generate the app
- **What we did:** generated a Next.js + TypeScript app with `pnpm create next-app`.
- `create-next-app` is a starter kit: it sets up folders, config files and libraries, and runs `git init`.
- Flags (`--ts --eslint --tailwind --app --src-dir ...`) answer the setup questions in advance, so the setup is repeatable.
- `node_modules/` holds downloaded libraries and never goes into Git.
- `--import-alias "@/*"` lets me write `@/components/Button` instead of `../../components/Button`.
- **Why it matters:** I start from the framework's recommended setup, not a blank folder.
- **Interview:** "I bootstrapped the app with create-next-app using TypeScript, the App Router and Tailwind, so the project follows the framework's standard layout."

### Step 2: run it
- **What we did:** ran `pnpm dev` and opened http://localhost:3000.
- `pnpm dev` runs the `dev` script from `package.json`: a local development server with hot reload (the page updates when I save).
- WSL forwards `localhost` to Windows, so the Windows browser reaches the Linux server.
- **Why it matters:** edit, save, see is the loop for building every screen.
- **Interview:** "I run the Next.js dev server in WSL2 and test in the Windows browser, with hot reload for fast feedback."

### Step 3: config files
- **What we did:** added `.gitattributes`, `.nvmrc` and `.env.example`.
- `.gitattributes` (`* text=auto eol=lf`) stores text files with Linux line endings, so Windows and Mac don't fight.
- `.nvmrc` pins Node 24; `nvm use` reads it.
- `.env.example` lists required settings with no real values; real values go in `.env.local`, which Git ignores. `!.env.example` in `.gitignore` makes an exception so the example can be committed.
- **Why it matters:** anyone (or CI) can clone the repo and get the same Node version and line endings, and secrets stay out of Git.
- **Interview:** "I pin the runtime and line endings in the repo and keep secrets out of Git with a committed `.env.example` template."

### Q&A
- **page.tsx vs layout.tsx?** The layout is the frame that wraps every page and stays put (header, nav); the page is the content for one URL. The folder decides the URL: `src/app/machines/page.tsx` → `/machines`. Like Ember's `application.hbs` with `{{outlet}}` vs a route template.
- **VS Code terminal or Ubuntu terminal?** Same thing when the WSL badge shows. VS Code is just handier. Use a second tab for Git while `pnpm dev` runs.
- **What are secrets?** Passwords and keys the app uses to reach other services (database password, AI API key, AWS keys). Like house keys: anyone with a copy gets in. Real values go in `.env.local`; `.env.example` lists only the names.

### Step 4: learning log
- **What we did:** added `docs/LEARNING_LOG.md` (this file).
- Docs live at the repo root beside `src/`; `src/` is only for app code that gets built and shipped.
- This log is public; the project memory bank stays private, outside the repo.
- **Interview:** "I keep a learning log in the repo, so the history shows how I picked up each technology."

### Step 5: first commit
- **What we did:** committed the config files and this log.
- `git status` shows **modified** (tracked files that changed) vs **untracked** (new) files.
- `git add` puts changes in the staging area (the box); `git commit` seals it with a label, saved locally only.
- `git log --oneline` lists commits; `HEAD -> main` marks where I am.
- **Interview:** "I make small commits with clear messages, so the history tells the story of the project."

### Step 6: GitHub repo and first push
- **What we did:** created the empty public repo `phn25/vaultrun` and pushed `main`.
- Created it with no README, .gitignore or license, so GitHub's files don't clash with mine.
- Checked first that commits use the no-reply email, since public history is forever.
- `git remote add origin <url>` saves GitHub's address as `origin`; `git push -u origin main` uploads and remembers the link, so next time it's just `git push`.
- **Why it matters:** the code is backed up and the Mac can get it with `git clone`. Habit: `git pull` before starting, commit + push before stopping.
- **Interview:** "The repo has been public since day one, with only fake data and no secrets in its history."
---

## 2026-10-28 · Week 2 Session 1: Machines page

### Session start
- `git pull`, then `pnpm install`, then `pnpm dev`. Keep `pnpm dev` in one terminal tab and use a second tab for Git; Ctrl+C stops it.
- **Interview:** "I start every session by syncing with main, so I never build on stale code."

### TypeScript types
- `type Machine = {...}` describes the shape of an object. A union type (`"active" | "needs-service" | "offline"`) limits a value to fixed strings, so typos are flagged in the editor.
- `.ts` is plain logic/data; `.tsx` is a file with JSX.
- **Interview:** "I model domain data with TypeScript types, so invalid states are caught at compile time."

### Components, props, JSX
- A component is a function that takes props (its inputs, like Ember's `@machine`) and returns JSX: HTML-like markup inside JavaScript. `{ }` holds JavaScript; `className` replaces `class`.
- `Record<K, V>` is a typed map that must have every key (used for status → badge color).
- **Interview:** "I break the UI into small typed components driven by props."

### Pages and lists
- The folder sets the URL: `src/app/machines/page.tsx` → `/machines`. `/` is kept free for the dashboard.
- `machines.map(m => <MachineCard key={m.id} machine={m} />)` turns data into components (like Java's `stream().map()`); `key` lets React tell items apart.
- **Interview:** "I render lists by mapping typed data to reusable components."

### Tailwind + mobile-first
- Utility classes go on the element itself (`p-4`, `mt-4` = 16px; one step = 4px), so there's no separate CSS file to keep in sync.
- No prefix = all sizes (phones first); `sm:` = 640px+, `lg:` = 1024px+, each overriding the smaller rule.
- The parent handles layout; the component handles its own look.
- Test at phone width: DevTools (F12) → device toolbar (Ctrl+Shift+M).
- **Interview:** "I build mobile-first with Tailwind breakpoints and test at phone width first."

### Git
- `git restore <file>` puts a file back to its last committed version.
- **Interview:** "I commit one finished feature at a time with a message that says what it adds."

---

## 2026-10-29 · Week 1 concepts, revisited

### Git remotes
- `origin` is a nickname for the GitHub repo's address, not a branch; `main` is the branch.
- `-u` links local `main` to `origin/main`, so later a plain `git push` / `git pull` works.
- A new file shows as **untracked**; an edited tracked file shows as **changes not staged**.

### Secrets
- Keep `.env*` in `.gitignore` with a `!.env.example` exception; deleting the rule would expose the real `.env`.
- If a key is ever pushed, **revoke it first**. Deleting it in a later commit doesn't help: history keeps it and bots scan GitHub within minutes.

### layout.tsx vs page.tsx
- The layout is the frame on every page and renders `{children}`; each URL's `page.tsx` fills that slot.

### Docker "dependencies"
- Services the app talks to (Postgres, later Redis), not code libraries (pnpm handles those). One command starts them; deleting the container leaves the PC clean.

### nvm + .nvmrc
- `.nvmrc` says `24`; `nvm use` switches to it, so the PC, Mac, CI and server all match. Like a recipe that says "bake at 180°C" so every oven gives the same cake.

- **Interview (dev setup):** "I develop in WSL2 so my environment matches the Linux servers I deploy to. I pin Node 24 with nvm and `.nvmrc`, use pnpm for fast, strict installs, authenticate to GitHub with an SSH key, and keep secrets out of Git with a committed `.env.example`."

---

## 2026-11-01 · Week 2 Session 2: Vercel deploy and lint CI

### Vercel (continuous deployment)
- Vercel is connected to the GitHub repo: it runs `pnpm build` on its servers and hosts the result at a public URL.
- Every push to `main` redeploys automatically. No environment variables yet, because there are no secrets, and the demo uses fake data only.
- Vercel builds *and* hosts; Jenkins only builds what you script. GitHub Actions is the closer Jenkins match.
- **Interview:** "The public demo deploys automatically to Vercel on every push to main, using fake data only."

### CI with GitHub Actions
- CI = an automatic check on every push and pull request, like a head chef checking each dish before it leaves the kitchen. CD = carrying approved dishes out.
- A workflow is a YAML file in `.github/workflows/`. GitHub starts a fresh Linux machine, runs the steps, then throws it away.
- YAML: settings text where indentation shows nesting and `-` starts a list item.
- `ci.yml` uses the same Node (`.nvmrc`), pnpm (`packageManager`) and locked libraries (`--frozen-lockfile`) as my PC.
- **Interview:** "Every push and PR runs lint in GitHub Actions, using the same pinned Node and pnpm versions as local dev."

### ESLint
- Reads code without running it and flags likely bugs: unused variables, a missing `key` in `.map()`, `any` in TypeScript.
- Installed by `create-next-app --eslint` as a devDependency (a tool for building and checking, not shipped to users). Rules come from Next.js's packs in `eslint.config.mjs`.
- No output = pass. TypeScript checks types; ESLint checks patterns.

### Next.js vs React
- React = the building blocks (components). Next.js = the framework around them: URLs from folders, a server side, and a production build.

---

## 2026-11-05 · Week 3 Session 1: Postgres in Docker

- **Feature branches + PRs:** every feature gets its own branch and pull request, so CI (lint) and a Vercel preview run before anything reaches `main`. Squash merge = one clean commit per feature. *Interview:* "Every change goes through a PR with CI checks before it's merged."
- **Environment variables:** `DATABASE_URL` bundles user, password, host, port and database into one string. Real values live in `.env.local` (gitignored); `.env.example` lists only the names.
- **Docker Compose:** a committed recipe for containers. One `db` service runs Postgres 17 + pgvector, reads its settings from `.env.local`, listens only on `127.0.0.1:5432`, and keeps data in a named volume so it survives `docker compose down`. *Interview:* "Local dependencies run in Docker Compose, so setting up the project is one command."
- **psql:** `docker compose exec db psql -U vaultrun -d vaultrun` opens a SQL prompt inside the running container; `\dt` lists tables, `\q` quits.
- **pgvector:** a Postgres add-on for searching by meaning (not a separate database); it will power the repair assistant.
- **ORM choice:** an ORM translates between TypeScript and SQL with typed queries and migrations. Chose **Drizzle** over Prisma: SQL-like queries, schema in plain TypeScript, built-in pgvector support.

---

## 2026-11-07 · Week 3 Session 2: Drizzle, first migration, seed

- **Drizzle ORM:** translates TypeScript into SQL. `drizzle-orm` runs typed queries in the app; `drizzle-kit` is a dev tool that writes and runs migrations. `pg` is the Postgres driver (like JDBC).
  *Interview:* "I use Drizzle ORM with node-postgres, with the schema written in plain TypeScript."
- **dependencies vs devDependencies:** runtime libraries ship with the app; tools stay in development. pnpm blocks install scripts until approved (`pnpm approve-builds`, saved in `pnpm-workspace.yaml`), which defends against supply-chain attacks.
- **Schema:** `src/db/schema.ts` describes the table's shape (like a Hibernate `@Entity`); seed data fills it. Each column has a TypeScript name (`targetFloat`) and a SQL name (`target_float`).
- **Enums vs text:** a Postgres enum works like a `CHECK (status IN (...))` and guards data from every source, not only app code. Use an enum for states the app defines (`status`), and text for real-world lists that grow (areas, models).
  *Interview:* "I used enums only for app-defined states, so new equipment or areas don't need a migration."
- **Migrations:** numbered SQL change scripts in `drizzle/`, committed with the code. Schema = what you want, migration = the step, `migrate` = do it. Re-running is safe; applied files are tracked.
  *Interview:* "Schema changes go through versioned migrations, so every environment gets the same structure."
- **Debugging a hidden error:** when a tool hides the cause, connect with the plain driver to see the real message. Postgres reads `POSTGRES_PASSWORD` only when it first creates its volume.
- **Seed + db client:** `src/db/index.ts` is one shared connection pool. `pnpm db:seed` deletes, then inserts the 14 fake machines, so it's idempotent.
  *Interview:* "An idempotent seed script loads fake demo data, so real data never touches the repo."
- **pnpm build:** type-checks, compiles and pre-renders pages. Vercel runs it with no database, so pages must not query the DB at build time without a hosted database.

---

## 2026-11-12 · Week 4 Session 1: architecture doc, Neon, /machines reads Postgres

### Architecture doc (`docs/01-architecture.md`)
- A one-page map of the system: the parts, how they connect, and **why** each was chosen.
- Each decision is written with its reason **and** the alternative I rejected; the "instead of" shows the trade-off was weighed.
- Why TypeScript everywhere: one language for the app, worker and scripts, and types catch mistakes before the code runs.
- *Interview:* "I keep a short architecture doc in the repo with each major decision, its reason and the alternative I rejected."

### The cast so far
| Name | What it is |
| --- | --- |
| Postgres | the database |
| Docker | runs Postgres on my PC (dev) |
| Neon | runs Postgres in the cloud (public demo) |
| Drizzle | translates between TypeScript and SQL (like JPA/Hibernate, lighter) |
| Migrations | the steps that build the tables |
| Seed | fake starting data for an empty database |
| pnpm scripts | shortcuts in `package.json` that run Drizzle or the seed |
| Vercel | hosts the live demo |

### Neon: a hosted Postgres for the demo
- Vercel can't reach the Docker database on my PC, so the demo needs a database on the internet.
- Same migrations and seed, different `DATABASE_URL`: `VAR=value command` sets a variable for one command only and wins over `.env.local`.
- Separate dev (Docker) and production (Neon) databases: experiments never break the live site.
- `sslmode=verify-full`: encrypt the connection **and** check the server's certificate (its ID) so nothing can pretend to be the database.
- *Interview:* "I develop against Postgres in Docker and deploy to a hosted Postgres; the same Drizzle migrations build both, only DATABASE_URL changes."

### Secrets in Vercel
- Vercel's Environment Variables page is the hosted version of `.env.local`. The value is stored as **Secret** (unreadable after saving) for Production and Preview.
- *Interview:* "Secrets live in the host's environment variables, never in the repo; locally they're in a gitignored .env.local."

### /machines reads from the database
- `Machine` type comes from the table: `typeof machines.$inferSelect` (a row you read). `$inferInsert` is the shape for inserting (DB-filled columns optional). One place defines the shape.
- Before deleting a file, `grep -rn` for everything that imports it, move each use, then delete.
- The page is an async **Server Component**: it queries the DB on the server, so the password never reaches the browser.
- With Next.js 16 Cache Components: `await connection()` = "needs a real request, don't pre-build"; `loading.tsx` is the Suspense fallback shown while the data loads.
- **Partial prerendering (◐):** the frame is pre-built and appears instantly; the DB part streams in fresh on each visit.
- `pnpm dev` builds pages on the fly (forgiving); `pnpm build` builds the whole app optimized and type-checks everything, the same as Vercel does.
- *Interview:* "My pages are server components that query Postgres through Drizzle; with partial prerendering the static shell loads instantly and the data streams in behind a Suspense loading state."

---

## 2026-11-24 · Week 4 Session 2: machine detail page, security patch, serial number

### How the pieces connect
- The code is the same everywhere; only `DATABASE_URL` changes. On my PC it comes from `.env.local` (Docker Postgres); on Vercel it comes from Vercel's environment variables (Neon).
- Vercel runs the app; Neon stores the data. Locally, `pnpm dev` plays Vercel's part and Docker plays Neon's.
- The public demo (Vercel + Neon) only ever holds fake data. Riley's real app will run separately on AWS with its own private database and a login (Sprint 10).
- A push to GitHub starts CI (lint) and a Vercel preview build at the same time; merging to `main` updates the live demo.
- *Interview:* "Same code in every environment; config like DATABASE_URL comes from env vars, so dev uses Docker Postgres and production uses a hosted Postgres."

### Dynamic routes: one page for every machine
- A folder named `[id]` is a fill-in-the-blank: `src/app/machines/[id]/page.tsx` serves `/machines/m01`, `/machines/m02`, and so on.
- `const { id } = await params` reads the value from the URL (Next.js hands `params` over as a promise).
- `eq(machines.id, id)` is Drizzle for `WHERE id = 'm03'`; `const [machine] = ...` takes the first row.
- With partial prefetching on, every page that loads fresh data needs its own `loading.tsx` (a Suspense placeholder), or Next.js warns about "uncached data outside of Suspense".
- *Interview:* "Machine detail is a dynamic route; the server component reads the id from the URL and queries Postgres through Drizzle, with a Suspense loading state."

### notFound()
- `notFound()` hands over to Next.js's built-in 404 page in one line.
- Because the page streams (the frame is sent before the database answers), the status code has already gone out as 200, so Next.js marks the 404 page `noindex` instead.
- *Interview:* "Unknown IDs call notFound(); because the route streams, Next.js serves the 404 page with a noindex tag."

### Links and shared values
- `next/link` (imported here as `NextLink`) switches pages without a full reload and pre-loads the next page, so clicks feel instant.
- `export` works like Java's `public`: every file is private by default. `statusLabels` is exported once from `MachineCard.tsx` and imported by the detail page, so a label changes in one place.
- *Interview:* "Cards use next/link for client-side navigation with prefetching, and shared status labels live in one exported map."

### Security patch in its own pull request
- `pnpm add next@16.4.6 eslint-config-next@16.4.6` upgrades to exact versions and updates the lock file.
- One change per PR: the upgrade got its own branch (`chore/...`), so it's easy to review and easy to undo.
- *Interview:* "Dependency upgrades go in their own PR, so CI checks them in isolation and they're easy to roll back."

### Adding a column safely
- `serialNumber: text("serial_number")` with no `.notNull()` makes an optional column; the page shows "Not set" with `machine.serialNumber ?? "Not set"`.
- `pnpm db:generate` wrote the step (`ALTER TABLE "machines" ADD COLUMN "serial_number" text;`); `pnpm db:migrate` ran it.
- Database first, then code: Neon got the new column before the new code went live. An optional column is safe for the old code, which simply ignores it.
- Fake serials (`DEMO-SN-01` ...) are obviously fake, so they're never mistaken for real ones.
- *Interview:* "I apply additive migrations to the database before deploying the code that uses them, so every deploy is safe to roll out."

---

## 2026-11-24 (evening) · Sprint 2 catch-up: withdrawal history

### Why a withdrawals table
- One row per machine per day: how many withdrawals, dollars taken out, and fee revenue. In the real app it is filled by uploading the processor's report, never typed by hand.
- It is the history the forecast (how much to load) and the cash checks (last load minus withdrawals) are built on.
- *Interview:* "Daily transaction history per machine is the raw material for both the cash forecast and the balance checks."

### Foreign key
- `machineId: text("machine_id").notNull().references(() => machines.id)` means every row must point at a real machine; Postgres refuses `"m99"`.
- The migration Drizzle wrote ends with `FOREIGN KEY ("machine_id") REFERENCES "machines"("id")`.
- Delete order matters: the seed deletes `daily_transactions` before `machines`, because rows that point at a machine block deleting it.
- *Interview:* "Withdrawals reference machines through a foreign key, so the database enforces integrity, not just the app."

### Two names, one table
- `"daily_transactions"` is the table's name inside Postgres; `dailyTransactions` is the exported const my code uses (`db.insert(dailyTransactions)`, `.from(dailyTransactions)`). Like a JPA `@Entity` class mapped to a table.

### Fake history in the seed
- `fakeDailyTransactions()` builds 182 days × 14 machines = 2548 rows, busier on Fridays and Saturdays, with a fake $3 fee per withdrawal.
- *Interview:* "The seed generates six months of realistic fake withdrawals, so the public demo never needs real cash data."

### GROUP BY
- `date_trunc('week', date)` turns each day into the Monday of its week; `GROUP BY` that week with `sum(withdrawal_amount)` squashes 182 daily rows into about 26 weekly totals.
- The database does the adding up, so the page only receives about 26 numbers.
- *Interview:* "The database does the aggregation with GROUP BY, so the page only receives weekly totals instead of every daily row."

### A chart made of plain boxes
- Each bar is a `div` in a fixed-height box; its height is `this week ÷ the biggest week × 100%`, so the biggest week fills the box and the others are drawn relative to it.
- No chart library, nothing extra to download, and it stays a server component.
- *Interview:* "For one simple bar chart I used plain divs sized as a percentage of the max, instead of pulling in a chart library."

### Database first, again
- Neon got the new table and fake rows (` DATABASE_URL="..." pnpm db:migrate` / `db:seed`) before the code that reads them was merged, so the live demo never asked for a missing table.

---

## 2026-11-25 · Sprint 3: runs and the cash ledger

### Append-only ledger
- Every money move is one row in `cash_moves`: from (home / bank / run / machine), to, amount. Rows are never edited or deleted; a mistake is fixed by a new row with a note, like a checkbook.
- Balances (at home, in the bag) are sums of moves, never typed in, so they can't drift from the history.
- *Interview:* "Cash is an append-only ledger: balances are computed from moves, and corrections are new entries with a reason."

### The runs table
- One row per day out (a bank-only day counts too): date, start and end odometer, counted leftover, a note when the count differs, and a `run_status` enum (in-progress / finished).
- End odometer and the count are optional columns, filled in at finish. Miles aren't stored: end − start can always be worked out.
- Cash taken from home is not a column on the run; it's a home → run row in the ledger, so money lives in one place.
- *Interview:* "I don't store values I can compute, like miles from two odometer readings, so they can never disagree."

### Check constraint
- `check("amount_positive", sql\`${table.amount} > 0\`)` makes Postgres refuse a zero or negative amount, even if the app has a bug. The direction (from → to) carries the sign.
- *Interview:* "Key money rules live in the database as constraints, so bad data is refused at the source, not just in the UI."

### Optional foreign key
- `runId` and `machineId` reference real rows but have no `.notNull()`: blank is allowed (a move outside a run), a wrong id is not.

### Why the migration SQL is committed
- `pnpm db:generate` reads `schema.ts` and writes a new SQL file, once. `pnpm db:migrate` runs the committed SQL files a database hasn't had yet; each database keeps a list of the ones it has run.
- So the PC, the Mac, Neon and later AWS all get the exact same changes in the same order.
- *Interview:* "Migrations are committed SQL files, so every environment gets the same changes in the same order."

---

## 2026-11-25 · Week 5 Session 2: Start today screen

### Form validation in the browser
- `type="number"` + `inputMode="numeric"` gives a number keypad on a phone. `required`, `min={0}` and `step={1}` make the browser refuse empty, negative or decimal values before anything is sent.
- Each box's `name` (`startOdometer`, `cashFromHome`) is how the server reads it.
- In JSX, `{0}` means "a JavaScript value", here the number 0.

### Server action
- A function in a file that starts with `"use server"` runs only on the server. The form calls it with `action={startRun}` and the boxes arrive as `FormData` (`formData.get("startOdometer")`).
- The browser only gets a handle to call it, not the code, so the database password never reaches the phone.
- The server checks the numbers again (`Number.isInteger`, not negative), because browser checks can be skipped.
- *Interview:* "Forms post to a server action that validates input on the server and writes to the database; there's no separate API route to maintain."

### Transaction
- `db.transaction(async (tx) => { ... })` saves the `runs` row and the home → run `cash_moves` row together: if one fails, both are undone. Like a bank transfer, money never leaves without arriving.
- `.returning({ id: runs.id })` gets the new run's id back from Postgres in the same insert.
- $0 from home writes no cash row (the database's `amount_positive` check would refuse it, and a $0 move isn't a move).
- *Interview:* "Starting a run writes two rows in one transaction, so a run never exists without its starting cash."

### Redirect
- `redirect("/run/1")` sends the browser to the new run's page after saving. It works by throwing, so it goes after the transaction, not inside a try/catch.

### Dates and time zones
- Vercel's clock runs on UTC, where it's already tomorrow after 7 PM Eastern. `toLocaleDateString("en-CA", { timeZone: "America/New_York" })` gives today's date as `2026-11-25` in Riley's time zone.

### Balance from the ledger
- `/run/[id]` adds up the run's cash moves: into the run = plus, out of the run = minus. "In the bag" is never stored, so it can't drift from the history.
- *Interview:* "Cash on hand is derived from an append-only ledger, not stored in a balance column."

### No migration this time
- The code only used tables Neon already had, so there was no database-first step before merging.

---

## 2026-11-26 · Week 6 Session 1: bank stop

### Bank accounts table
- `bank_accounts` holds Riley's accounts: bank name, nickname, last 4 digits and `is_main`. Only the last 4 digits are stored, never the full number: enough to recognize the account, nothing useful if it leaks.
- `is_main` is a **boolean column** (true or false only). It marks the account she withdraws from (in real life her surcharge account, where the fees land and where she moves the machine accounts' money). It's set once and rarely changes; it only decides which account is picked by default.
- `cash_moves.bank_account_id` is an optional foreign key: filled for bank → run moves, blank for everything else.
- *Interview:* "I store only the last four digits of bank accounts and link each ledger row to its source account with an optional foreign key."

### Seed order and await
- The seed resets the database to the same fake starting point, so it can be run again and again (idempotent).
- Tables are cleared children first: `cash_moves` → `runs` → `daily_transactions` → `machines` → `bank_accounts`. A row that points at another table must go before the row it points at, or Postgres refuses.
- `await` makes each database call finish before the next line starts, so the order really holds.
- Re-seeding the demo also clears test runs strangers typed (the demo is writable until login in Sprint 10).
- *Interview:* "My seed clears tables in foreign-key order and reloads the same fake data, so the demo can be reset safely."

### Hidden input
- A hidden input (`type="hidden" name="runId"`) is a form box the user never sees. It sends the run's id with the form, so the server action knows which run the withdrawal belongs to.
- The server still checks it (`Number.isInteger`), since anything from the browser can be changed.

### revalidatePath
- After saving, `revalidatePath("/run/7")` tells Next.js that page's data changed, so it draws it again with the new totals. No manual refresh.
- After a form action succeeds, React clears the form's boxes, ready for the next entry.
- *Interview:* "The server action writes one ledger row and revalidates the page, so the new balance shows immediately."

### Database first, again
- New table + column = migration 0005. Neon got `pnpm db:migrate` + `pnpm db:seed` before merging, so the live site never asks for a column that doesn't exist yet.

---

## 2026-11-27 · Week 6 Session 2: vaulting stops and Finish run

### searchParams (the URL remembers choices)
- `searchParams` is the part of the address after `?`, like `/run/7?areas=South,North`. The page receives it as a Promise (`await searchParams`), the same way it receives `params`.
- "Are you doing an ATM run today?" and the picked areas live in the URL, not the database: they are screen choices, not records. A refresh keeps them, and no migration was needed.
- Each "+ area" button is just a link (`NextLink`) to the same page with one more area added to the end of the list, so the order she taps = her driving order.
- `NextLink` = Next.js's `Link` component (imported under our own name). It swaps in only what changes instead of reloading the whole page.
- *Interview:* "I kept temporary UI choices in the URL with searchParams, so they survive a refresh and need no database table."

### inArray (WHERE … IN)
- `inArray(machines.area, pickedAreas)` is Drizzle for `WHERE area IN ('South', 'North')`: one query for "machines in any of these areas".
- The result is then sorted by each area's position in `pickedAreas`, so stops follow the driving order.
- *Interview:* "I filtered with a single IN query instead of one query per area."

### Vaulting stop = one ledger row
- Save calls the server action `loadMachine`, which inserts one `cash_moves` row: `run → machine`, the amount she actually put in, with `machine_id`. Same pattern as the bank stop.
- No new column: `cash_moves.machine_id` already existed since Nov 25. Code-only change, so no Neon step.
- After Save, the stop shows "Loaded $X ✓" and the box disappears: cash entries are never edited; a wrong amount will be fixed with a new correction entry.

### How the total redraws
- "In the bag" is never stored. The page adds up the run's cash moves every time: into the run = +, out of the run = −.
- Save → server action writes the row → `revalidatePath("/run/7")` marks that page out of date → Next.js runs the page's server code again (fresh query + sum) → React swaps in only what changed. No React state involved.
- The path names which page to redraw; the `?areas=…` part isn't part of the path, so the picked areas stay.
- Backticks (`` `/run/${runId}` ``) fill in the value; single quotes would not.

### Map (lookup table)
- `new Map<string, number>()` stores machine id → dollars loaded today: `set("m08", 6000)`, `get("m08")`, `has("m09")`.
- Built once from the run's cash moves; each stop asks the Map whether it was loaded. Not the same as `list.map(...)`, which turns each item in a list into something else (like one box per machine).
- *Interview:* "Totals are always derived from an append-only ledger, so the screen can't drift from what's saved."

### Finish run: GET form + db.update
- Finish is its own page, `/run/[id]/finish` (with its own `loading.tsx`).
- Step 1 is a **GET form**: a form with no `action`. It saves nothing; it just puts the typed values in the address (`?end=1085&count=18000`), and the page reads them with `searchParams` to show the comparison. A preview before anything is saved.
- The page compares the count with the expected bag (from the ledger). Same: green "Your count matches". Different: "You counted $X less/more than expected. Count again, or write a note saying why." and the note box is required. "Count again" is just a link back to the empty form.
- "Save and finish" calls the server action `finishRun`, which re-checks everything on the server (odometer not below the start, note present when the count differs) and, in one transaction: **`db.update`** the run row (ending odometer, counted cash, note, status finished) + inserts a new run → home cash move for the counted cash.
- Updating the run row is fine: F10 "never edit" is about cash entries. The money itself still only moves by new rows.
- The "in the bag" sum moved into one shared function, `cashInBag` (`src/app/run/bag.ts`), since the run page, the finish page and the server action all need it.
- A finished run only shows a summary (miles, loaded, from bank, took home, note) with no forms.
- *Interview:* "Finishing a run previews the cash check from URL params, then one transaction closes the run and moves the counted cash home, with a note required when the count is off."

---

## 2026-11-27 · Sprint 3 Session 5: the look and the home dashboard

### Design tokens
- A design token is a named value, like `--go` for "main button color" or `--wordmark` for "font of the VaultRun name". Pages use the name, never a color code.
- All tokens live in `src/app/globals.css`, one block per theme: `[data-theme="interstate"]` (default), `[data-theme="brass"]`, `[data-theme="impeccable"]`. Every block sets the same token names.
- `@theme inline` turns each token into a Tailwind class: `--color-panel: var(--panel)` gives `bg-panel`, `border-panel`, `text-panel`.
- The switch is one attribute on `<html>` in `layout.tsx`: `data-theme="interstate"`. Change one word and every color and the name font change.
- Mixing is a one-line change too: Interstate colors + Impeccable's stencil name font = swap one `--wordmark` line.
- *Interview:* "Colors and fonts are design tokens in one CSS file, mapped to Tailwind classes, so the app can switch themes with a single attribute."

### next/font
- `next/font/google` downloads Google fonts at build time and serves them from our own site: faster, no layout jump, no request to Google from the visitor.
- Each font gets a CSS variable (`variable: "--font-atkinson"`) that the tokens point at. Fonts: Atkinson Hyperlegible (sentences), Barlow Semi Condensed (numbers and headings), Big Shoulders Stencil (the VaultRun name).
- When the page looks stale after a font or CSS change: stop `pnpm dev`, `rm -rf .next` (Next.js's build cache, never in Git), start again.

### Home dashboard
- `src/app/page.tsx` is an async Server Component (+ its own `loading.tsx`): greeting by New York time, miles today and this year from finished runs (end − start odometer), Running / Need service / Offline counts, machines grouped by area with `Map.groupBy`, and a Start today button pinned to the bottom.
- Small helper components (`Stat`, `MachineRow`) keep the page short. No color codes in the page, only token classes.
- No name in the greeting: the repo and demo are public; the name comes with login.

### Impeccable (design skill for Claude Code)
- A skill = written design rules + checks that Claude Code follows when you type `/impeccable <command>`. Installed per project with `npx impeccable install` (telemetry off, design hook on).
- Claude Code runs in the Ubuntu terminal (`claude`), right next to the code.
- `init` wrote `PRODUCT.md` (who Riley is, where she uses the app, hard rules). It then invented its own color scheme from `PRODUCT.md` only, so it wasn't copying ours; it was compared side by side with the two finalists. `document` wrote `DESIGN.md` ("The Highway Sign": the rules of the chosen look). `critique` scored the home screen 20/40 and ranked fixes (run state on home, problem machines first, tap feedback).
- *Interview:* "I used the Impeccable design skill with Claude Code to generate an alternative theme, compared three options on the real screen, recorded the winner as a design system, and got a heuristic review to plan the next fixes."

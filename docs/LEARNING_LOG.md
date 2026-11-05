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
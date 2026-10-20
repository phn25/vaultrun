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

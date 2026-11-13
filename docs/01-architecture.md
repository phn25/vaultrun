# VaultRun architecture

VaultRun is a web app for a small ATM business (about 14 machines). It tracks cash runs (loading machines and banking), mileage and expenses, and will predict how much cash to load into each machine. The owner uses it on her phone, a Windows PC and a Mac.

## Diagram

```
Riley's devices (phone PWA, Windows PC, MacBook)
        │ HTTPS
        ▼
Next.js web app (screens, API routes, login) ──► AI model API
        │                      │
        │ read/write           │ add jobs
        ▼                      ▼
PostgreSQL + pgvector     Redis queue
        ▲                      │ worker pulls
        │                      ▼
        └──────────── Worker (TypeScript) ──► S3 (receipt images)
                               └────────────► AI model API
```

## Components

- **Next.js app:** the screens (machines, runs, expenses) and the server code behind them. One codebase serves both the UI and the API, and it installs on a phone as a PWA.
- **PostgreSQL + pgvector:** the main database for machines, runs, cash moves and expenses. pgvector adds vector search, used later to find the right page of a repair manual for the repair assistant.
- **Redis queue + worker:** slow jobs (receipt scans, Excel imports) go on a queue, and a separate TypeScript worker processes them, so the app never freezes while waiting. Failed jobs retry up to 3 times.
- **AI model API:** reads receipts into expense entries, answers repair questions from the manuals (RAG), and helps plan a run. The AI never saves anything until the user confirms.
- **S3:** stores receipt photos.

## Key decisions

| Decision | Why | Instead of |
| --- | --- | --- |
| TypeScript everywhere | One language for the app, worker and scripts, and types catch mistakes before they run | Java backend + JS frontend |
| Drizzle ORM | Queries read like SQL, the schema is plain TypeScript, and it supports pgvector natively | Prisma |
| Postgres in Docker Compose for local dev | Same database version on Windows and Mac with one command, nothing installed directly | Installing Postgres directly |

## Two environments

- **Public demo:** Vercel + Neon Postgres, fake data only.
- **Private (real data):** AWS (EC2 with Docker Compose, RDS, S3), built in Sprint 10, behind a login.

There are two because real machine locations and cash amounts must never be public, but the demo should still show how the app works.

## Status

Built so far: Next.js app, `/machines` page, Postgres in Docker, Drizzle schema + seed. The queue, worker, AI and S3 are planned.
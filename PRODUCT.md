# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Riley**, the owner-operator of a small ATM business (about 14 machines), is the primary user. Future design work serves her first.

She uses VaultRun in three situations:

- **Phone, in the car:** parked between stops, one hand, quick glances.
- **Phone, at the machine:** standing at the ATM with cash in hand, loading it and recording what went in.
- **PC or Mac at home:** reviewing machines, runs, mileage and totals at a desk.

The phone is the main device. Runs start early in the morning, often in the dark, and continue into bright sun.

**Secondary audience:** people viewing the public demo (for example, hiring managers looking at the project). They see the same app with fake data. Nothing is built just for them.

## Product Purpose

VaultRun runs the day-to-day cash work of a small ATM business: taking cash from home, withdrawing at the bank, loading machines stop by stop, and counting the leftover cash at the end of a run. It also tracks machine status, mileage (for taxes), and expenses. Later it will predict how much cash each machine needs.

Success means Riley can finish a run on her phone without doubting any number: every dollar's movement is recorded, and the count at the end matches the record or has a note explaining why it doesn't.

## Positioning

It is built around one operator's real run, not a generic fleet or POS tool. Money is an append-only record of moves between four places (home, bank, run bag, machine). Balances are always calculated from those moves, never typed in, and a mistake is fixed with a new move and a note, like a checkbook.

## Operating Context

- **A run:** start today (odometer + cash from home) → bank stop (withdraw from an account) → vaulting stops by area (load a machine) → finish (end odometer, count leftover cash, note any difference).
- A bank-only day still counts as a run.
- Dates and times follow Riley's local time zone (America/New_York), not the server's.
- Machines are grouped by area (neighborhood) and have a status: running, needs service, or offline.
- Bank accounts are shown by nickname and last 4 digits only.

## Capabilities and Constraints

**Built:** home dashboard (miles today and this year, machine status counts, machines by area), machines list and detail, start run, bank stop, vaulting stops, finish run, weekly withdrawal history.

**Planned:** expenses with receipt photos, Excel imports, AI receipt reading, repair help from manuals, run planning and cash-load predictions, installable phone app (PWA), and the private environment behind a login.

**Hard rules:**

- **Never fill in money amounts for Riley.** She types every dollar amount herself. The app (and later the AI) may show expected or suggested numbers, but never pre-fill an amount field.
- **The AI never saves anything until Riley confirms.**
- **The public demo holds fake data only.** Real machine locations, serials and cash amounts never appear in the demo or the repo.
- **Phone first:** big readable text and big tap targets, readable in the dark early morning and in bright sun.
- **Colors and fonts stay as tokens in `src/app/globals.css`.** The look switches with `data-theme` on `<html>`; current themes are `interstate` (default) and `brass`. New UI uses the tokens, not one-off values.

**Stack:** Next.js 16 (App Router), React 19, Tailwind 4, Drizzle ORM on PostgreSQL. Public demo on Vercel + Neon; the private real-data environment is planned for AWS.

**Terms used in the app:** run, stop, bank stop, load a machine, area, the bag (cash carried on the run), target (a machine's target cash amount), leftover, difference note.

## Brand Commitments

- Name: **VaultRun**.
- Voice: plain, short, everyday words, written for Riley ("Start today", "Tap a machine for its details", "Driven in 2026, for taxes").

## Evidence on Hand

- Seeded fake data: 14 machines, six months of daily withdrawals, demo bank accounts, fake serials (`DEMO-SN-01` …) in `src/db/seed.ts`.
- Architecture overview: `docs/01-architecture.md`; build history: `docs/LEARNING_LOG.md`.
- No logo or brand assets yet (`public/` holds only Next.js defaults). No testimonials, users beyond Riley, or usage metrics. Do not invent any.

## Product Principles

1. **Her numbers, her hand.** Money amounts are always typed and confirmed by Riley; the app calculates and checks, it never guesses for her.
2. **Every dollar has a trail.** Show where cash is and how it got there; corrections add a note, they never erase.
3. **Built for the run, not the desk.** Design for a phone at an ATM or in a parked car, at dawn or in full sun; the desk view comes second.
4. **One glance, one action.** Each screen answers what's happening now and what to do next, with the main action within thumb reach.
5. **Real stays private.** The demo shows how it works with fake data; nothing real leaks into public.

## Accessibility & Inclusion

- Large text and tap targets for one-handed, glance-based phone use.
- Contrast that holds up both in a dark car before sunrise and in direct sunlight.
- Status is never color alone (each status dot comes with a word).

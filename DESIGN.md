---
name: VaultRun
description: Cash runs for a small ATM business, read at a glance on a phone from dawn to full sun.
colors:
  asphalt: "#121619"
  shoulder: "#1b2125"
  lane-line: "#2c363c"
  sign-white: "#edf2ef"
  weathered-sage: "#98a6a0"
  highway-green: "#0f7a4c"
  on-green: "#ffffff"
  running-green: "#45cf8e"
  caution-amber: "#f5b942"
  stop-red: "#f26a5b"
  route-green: "#3cc487"
typography:
  wordmark:
    fontFamily: "Big Shoulders Stencil, Barlow Semi Condensed, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: "2rem"
  display:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: "2.5rem"
  headline:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: "2.25rem"
  number:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: "2rem"
  amount:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  title:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: "1.5rem"
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5rem"
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
rounded:
  dot: "9999px"
  panel: "12px"
  action: "16px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.highway-green}"
    textColor: "{colors.on-green}"
    typography: "{typography.number}"
    rounded: "{rounded.action}"
    padding: "16px"
  stat-strip:
    backgroundColor: "{colors.shoulder}"
    textColor: "{colors.sign-white}"
    rounded: "{rounded.panel}"
    padding: "8px 12px"
  area-panel:
    backgroundColor: "{colors.shoulder}"
    textColor: "{colors.sign-white}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
  machine-row:
    backgroundColor: "{colors.shoulder}"
    textColor: "{colors.sign-white}"
    padding: "12px 16px"
  status-dot:
    rounded: "{rounded.dot}"
    size: "10px"
---

# Design System: VaultRun

## Overview

**Creative North Star: "The Highway Sign"**

VaultRun looks like interstate signage: dark asphalt, white lettering, one green panel that tells you where to go. Signs are made to be read at a glance, at speed, in the dark and in glare, and that is how Riley reads her phone between stops and at the machine. Every screen answers one question with large condensed numbers and offers one lit action within thumb reach.

The system is dark by choice, not by fashion. Runs start before sunrise, so the ground is deep asphalt that doesn't glare in a dark car. Text is near-white at 14:1 or better so it holds up in sun. Color is spent on meaning: green is the action, and green, amber and red are machine status. Everything else is gray. Density is low: few items per screen, big type, generous rows.

The look switches through `data-theme` on `<html>`. **Interstate is the standard and the default.** `brass` (dark bronze, brushed brass, serif wordmark) and `impeccable` (blue-hour indigo, pale sky button) are supported alternates. They redefine the same token names, so any screen built on the tokens works in all three. The hex values in the frontmatter are interstate's.

**Key Characteristics:**
- Dark asphalt ground, near-white ink, one green action.
- Condensed Barlow numerals for every number and heading; Atkinson Hyperlegible for every sentence.
- A stenciled wordmark, the only decorative type, like the lettering on a cash bag.
- Flat, bordered panels; no shadows.
- Mobile-first single column, the main button fixed at the bottom.

## Colors

A near-neutral asphalt ramp with a faint blue-green cast, plus one action green and three signal colors.

### Primary
- **Highway Green** (`--go`): the one main button ("Start today"). It means "go" and nothing else. White text on it is 5.4:1.
- **On Green** (`--go-ink`): text on the main button.

### Secondary
- **Route Green** (`--route`): route lines and links. Brighter and lighter than Highway Green, so a link never reads as a button.

### Tertiary
- **Running Green** (`--ok`): machine running.
- **Caution Amber** (`--warn`): machine needs service.
- **Stop Red** (`--bad`): machine offline; count differences and errors.

### Neutral
- **Asphalt** (`--page`): the screen background.
- **Shoulder** (`--panel`): panels and grouped rows laid on the asphalt.
- **Lane Line** (`--edge`): hairline borders and row dividers. It is quiet (1.3:1 on Shoulder), so it separates but never carries meaning.
- **Sign White** (`--ink`): main text, 16:1 on Asphalt.
- **Weathered Sage** (`--dim`): labels, units and small print; 6.4:1 on Shoulder, so it is still body-legible.

### Named Rules
**The One Green Panel Rule.** Each screen has at most one Highway Green surface: the main action. A second important action is bordered, not filled.

**The Signal Rule.** Running Green, Caution Amber and Stop Red mean status only, and always come with a word ("Running", "Need service", "Offline"). Never color alone, never decoration.

**The Token Rule.** Every color comes from a token in `src/app/globals.css`. No hex values or Tailwind palette colors (`gray-*`, `amber-*`, `green-*`) in components; they break all three themes.

## Typography

**Wordmark Font:** Big Shoulders Stencil 800 (via `--wordmark`)
**Number & Heading Font:** Barlow Semi Condensed 600/700 (`font-num`)
**Body Font:** Atkinson Hyperlegible 400/700 (`font-sans`, the default)

**Character:** Barlow is signage numerals: narrow, so a five-digit dollar amount fits a phone column, and tall enough to read at arm's length. Atkinson Hyperlegible was designed for low-vision readers; it carries every sentence and label. The stencil wordmark is the only ornamental type.

### Hierarchy
- **Wordmark** (800, 1.5rem): "VaultRun" at the top of the home screen. Nowhere else.
- **Display** (Barlow 700, 2.25rem/2.5rem): the screen's one greeting or title ("Good morning").
- **Headline** (Barlow 700, 1.875rem/2.25rem): section headings ("Your machines"); also the large machine number in a row.
- **Number** (Barlow 700, 1.5rem/2rem): stat values (miles, machine counts) and the main button label.
- **Amount** (Barlow 600, 1.25rem/1.75rem): dollar amounts in lists, such as a machine's target.
- **Title** (Atkinson 700, 1rem): group headings like an area name.
- **Body** (Atkinson 400, 1rem/1.5rem): sentences and row text.
- **Label** (Atkinson 400, 0.875rem/1.25rem, Weathered Sage): the small word under a number; 0.75rem only for a unit like "target".

### Named Rules
**The Numbers Wear Barlow Rule.** Every number Riley reads (dollars, miles, counts, machine numbers) is set in Barlow; every sentence in Atkinson. Never set prose in Barlow or amounts in Atkinson.

**The Number Over Word Rule.** A stat is the number first, large, with a plain-language label under it in Label size ("Driven today", "Need service").

## Layout

Mobile-first single column at the phone's full width with a 16px side gutter. The home screen stacks a header (wordmark, greeting, date, stat strips) above a section of area panels. Vertical rhythm is 12–20px: 12px between stacked panels in a group, 16–20px before a new section. Stat strips are equal-column grids (2 or 3 columns).

The main action is fixed to the bottom of the viewport, full width, over a fade from Asphalt to transparent, and the page reserves 112px of bottom padding so the last row is never hidden behind it. Wider breakpoints are not designed yet; the phone layout is the standard and desktop must not change its order.

**The Thumb Rule.** The screen's main action lives in the bottom third, full width, at least 56px tall.

## Elevation & Depth

Flat. There are no shadows. Depth is one tonal step (Asphalt → Shoulder) plus a Lane Line border. The only gradient is the functional fade behind the fixed bottom button, which lets content scroll under it without a hard edge.

**The Flat Road Rule.** Surfaces never lift. If something needs to stand out, give it Highway Green or more size, never a shadow or glow.

## Shapes

Gentle, consistent rounding: panels and stat strips at 12px, the main button at 16px (a little softer, so it reads as the thing to press), and status dots fully round at 10px. Inside a panel, rows are square and divided by full-width Lane Line hairlines; panels clip their rows (`overflow: hidden`) so dividers meet the rounded edge cleanly. Borders are always full, 1px Lane Line.

## Components

### Buttons
- **Shape:** softly rounded slab (16px).
- **Primary:** Highway Green fill, On Green text, Barlow 700 at 1.5rem, 16px padding, full width, centered label. Fixed at the bottom of the screen on home.
- **Hover / Focus:** not defined yet; browser defaults show. Add a visible focus ring in Route Green when this is next touched.
- **Secondary:** no token version yet. When moved over, it is a bordered (Lane Line) Shoulder button with Sign White text, same shape and size as primary.

### Stat Strip
- **Style:** a Shoulder panel with a 12px corner and Lane Line border, split into equal cells by 1px Lane Line dividers. Each cell is 8px/12px padded, Number on top, Label underneath.
- **Status variant:** the value takes the matching signal color (Running Green, Caution Amber, Stop Red); the label stays Weathered Sage.

### Area Panel and Machine Row (signature)
- **Area Panel:** Shoulder panel, 12px corner, Lane Line border. Its header row has the area name in Title on the left and "N machines" in Label on the right, baseline-aligned.
- **Machine Row:** the whole row is a link. Three columns (48px | flexible | auto), 12px gap, 12px/16px padding, a Lane Line top divider. Left: the machine number in Headline. Middle: status dot plus word on top, model in Label below. Right: the target amount in Amount, "target" under it at 0.75rem.

### Status Dot
- 10px Running Green / Caution Amber / Stop Red circle, always followed by its word.

### Inputs / Fields
- No token version yet (the old screens use light gray fields). When moved over: Shoulder background, Lane Line border, Sign White text in Barlow for amounts, 12px corner, at least 48px tall, with the label above in Label. Amount fields always start empty.

## Do's and Don'ts

### Do:
- **Do** use only the tokens (`bg-page`, `bg-panel`, `border-edge`, `text-ink`, `text-dim`, `bg-go`, `text-go-ink`, `ok`/`warn`/`bad`, `route`) so every screen works in interstate, brass and impeccable.
- **Do** set every number in Barlow (`font-num`) and every sentence in Atkinson.
- **Do** pair every status color with its word.
- **Do** keep one Highway Green action per screen, full width, in thumb reach.
- **Do** check new screens in all three themes before merging.

### Don't:
- **Don't** use Tailwind palette colors (`bg-gray-50`, `bg-white`, `bg-amber-400`, `text-green-700`, `bg-blue-500`) or raw hex in components.
- **Don't** add shadows, glows or glass. Depth is Shoulder on Asphalt plus a Lane Line.
- **Don't** use the stencil wordmark font for anything but the VaultRun name.
- **Don't** pre-fill a dollar amount in any field, even with an expected value.
- **Don't** use Lane Line borders as the only way to show meaning; they fade in sunlight.

## Drift to move over

These screens predate the tokens and still use the old light-gray look (`bg-gray-50`, white cards, `bg-amber-400` buttons, Tailwind green/red/blue). They are not part of the standard; move each to the tokens above:

- `src/app/run/start/page.tsx` (Start today form)
- `src/app/run/[id]/page.tsx` (bank stop, areas, stops, finished summary)
- `src/app/run/[id]/finish/page.tsx` (finish run and count check)
- `src/app/machines/page.tsx` and `src/components/MachineCard.tsx` (status chips also say "Active" where home says "Running")
- `src/app/machines/[id]/page.tsx` (details list and the blue weekly chart)

Also: Overpass is still loaded in `src/app/layout.tsx` but no theme uses it now.

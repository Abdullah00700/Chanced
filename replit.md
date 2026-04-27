# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **Rarity Roller** (`artifacts/number-roller`) — Frontend-only React + Vite mobile-first app at `/`. Roll a weighted number 0–10,000 (Gaussian-ish weighting per rarity tier with exponential decay); **7 rarity tiers** common → uncommon → rare → epic → legendary → mythic → **unobtainable** (only n=0 or n=10000, ~1 in a million). Features: bottom-tab nav, slot-machine roll animation (5 vertical reels stopping left-to-right with sharp tick sound), screen-edge aura matching last roll, Web-Audio SFX per rarity, password-protected local accounts (SHA-256), `RR2-` save codes (with backwards-compatible migration), exponential leveling, shop with permanent upgrades + boosters, **50+ achievements ranked by rarity** with filter chips, **22 pets** with cartoonish per-pet SVG art (Blox-Fruits style) shown via `PetArt`, pet drops on rolls (chance = tier_prob ÷ tier_divisor; common/uncommon never drop; rare/10, epic/100, legendary/1000, mythic/10000; unobtainable never drops naturally), **pet evolution**: each pet starts at its base-rarity tier level (common=1, uncommon=11, rare=21, epic=31, legendary=41, mythic=51), gains +0.5%/lvl, evolves every 10 levels boosting its bonus by +25/20/15/10/50% (gated by player level: need lvl 10 to evolve to uncommon, 20 to rare, etc.). Two **unobtainable** pets unlock from special achievements: **Cosmic Serpent** (Cosmic Ascent) and **Cybernetic Ultimate Dragon** (3 mythics in a row OR any unobtainable roll); when Cybernetic Dragon is equipped it activates "cybernetic mode" which zeros out common/uncommon/rare, dims epic, and massively boosts legendary/mythic/unobtainable. Pets/Achievements tabs both have rarity filter chips. Inventory entry in the menu drawer. Achievement toast uses 6.5s slow fade. Float popups on the roll panel clear when a new roll begins. All data in `localStorage` (`rr2.*` keys). Schema version 3.

  Source layout (under `artifacts/number-roller/src`):
  - `lib/` — types (incl. `RarityKey`, `PetInstance`), rarity table (incl. `unobtainable`), distribution (per-tier weight bands + cybernetic mode), level curve, shop costs, pets table (with evolution math: `petCurrentRarity`, `effectiveEffect`, `evolutionInfo`, `petUpgradeCost`), achievements (50+, sorted by rarity, optional `petId` reward), sounds (Web Audio incl. `playRollTick`), save codes (with migration), storage/auth helpers
  - `components/` — Header, BottomNav, MenuDrawer (with Inventory entry), BoosterBar, StatCard, ScreenAura, Modal, AuthModal, SaveLoadModal, WipeModal, PetDropModal, AchievementToast (slow fade), PetArt (per-pet cartoonish SVGs)
  - `views/` — RollView (stats above panel, ROLL button below), ShopView, PetsView, AchievementsView, LeaderboardView
  - `App.tsx` — orchestrates auth gate, tab routing, roll flow, shop/pet/achievement reducers

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **Rarity Roller** (`artifacts/number-roller`) — Frontend-only React + Vite mobile-first app at `/`. Roll a weighted number 0–10,000 (Gaussian centered at 5000, blended toward U-shape as rarity tilt grows); 6 rarity tiers (common→mythic) drive color/glow/aura. Features: bottom-tab nav (Roll/Shop/Pets/Trophies/Top), screen-edge aura matching last roll, Web-Audio sound effects per rarity, password-protected accounts (SHA-256, multi-account on device), `RR2-` base64 save codes, exponential leveling (XP/coin/rarity multipliers per level), shop with permanent coin & rarity upgrades plus temporary 2x-coin and rarity-burst boosters, achievements awarding coins/XP/gems, pets that drop on rolls (chance = tier_prob ÷ tier_divisor; rare/10, epic/100, legendary/1000, mythic/10000) or are bought in shop with effects (xp/coin mult, rarity tilt, roll-speed). Wipe-data button with type-username confirmation. All data in `localStorage` (`rr2.*` keys). No backend.

  Source layout (under `artifacts/number-roller/src`):
  - `lib/` — types, rarity table, distribution (Gaussian/U-shape blend), level curve, shop costs, pets table, achievements, sounds (Web Audio), save codes, storage/auth helpers
  - `components/` — Header, BottomNav, BoosterBar, StatCard, ScreenAura, Modal, AuthModal, SaveLoadModal, WipeModal, PetDropModal
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

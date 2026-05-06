# Rarity Roller

A mobile-first idle number-rolling game. Roll 0–10,000, chase rare numbers, collect pets, fight bosses, and prestige through rebirths.

## Run & Operate

- `pnpm --filter number-roller run dev` (requires `PORT` and `BASE_PATH` env vars)
- `pnpm --filter @workspace/api-server run dev` — API server
- `pnpm run typecheck` — full workspace typecheck
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client from OpenAPI spec

Required env: `PORT`, `BASE_PATH` for frontend; `DATABASE_URL` for API server.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS (mobile-first)
- **API**: Express 5 + Drizzle ORM + PostgreSQL
- **Monorepo**: pnpm workspaces, Node.js 24, TypeScript 5.9
- **Auth**: SHA-256 client-hash (username + password), stored in `accounts` Postgres table

## Where things live

```
artifacts/number-roller/src/
  lib/        — types (schema v5), rarity, distribution, level, rebirth, pets, eggs,
                weather, quests, shop, achievements, bosses, sounds, storage, save
  components/ — Header, BottomNav, MenuDrawer, PetArt (55+ SVGs), BossArt (10 SVGs),
                BoosterBar, WeatherOverlay, AchievementToast, modals
  views/      — RollView, ShopView, InventoryView, QuestsView, EventsView, PetsView,
                AchievementsView, LeaderboardView, BossesView
  App.tsx     — all game logic: roll flow, boss fights, corrupted rolls, pet tick, auth
artifacts/api-server/  — Express API (accounts, leaderboard)
artifacts/api-spec/    — OpenAPI spec + Orval codegen
```

Schema v5 source of truth: `artifacts/number-roller/src/lib/types.ts`

## Architecture decisions

- **Linear rebirth multipliers**: `coinMult = 1 + n*0.5`, `xpMult = 1 + n*1.0` (not exponential)
- **Boss damage formula**: `floor(distanceFromCenter * bossDamageMult)` per roll. `bossDamageMult` stacks multiplicatively from equipped pets.
- **Corrupted roll**: 0.1% chance per roll; drains 10% coins every 10s until player rolls a number with ≥ distance from center.
- **Boss fights**: locked in until win or defeat. Boss attacks on the minimum-interval move timer (ticked every second). Exit only allowed after fight ends.
- **Pet abilities**: ticked each second via `useEffect([now, activeUser])`. Pet boss-damage effects via `effectiveEffect` which returns `bossDamageMult`.
- **Leaderboard submit**: every roll (API is idempotent; only updates entry if prob improves, but level always updates).
- **unobtainable pets**: normally award-only; `shopBuyable: true` flag on `absolute-zero` allows purchase.

## Product

- **7 rarity tiers**: common → uncommon → rare → epic → legendary → mythic → unobtainable
- **55+ pets**: shop, egg-exclusive (Jungle/Desert/Ocean/Arctic/Mythical), achievement-unlocked, shopBuyable unobtainable (Absolute Zero)
- **10 bosses**: unlock at level 50, sequential gating; exponential HP scaling (25k → 48.8B). Each has 3 moves.
- **Boss fight system**: roll to deal damage, boss attacks on timer, rewards on win (coins/XP/gems)
- **Corrupted number mechanic**: blood-red aura, coin drain, cleared by rolling farther
- **Gem rewards on rarity**: epic +5, legendary +7, mythic +15, unobtainable +50
- **30 rebirths**: reset coins, permanent multipliers stack linearly
- **60+ achievements**, stats panel in RollView, fixed rarity display order

## User preferences

- Keep all numbers in standard notation (no scientific notation in UI)
- Rarity display order: common → uncommon → rare → epic → legendary → mythic → unobtainable
- Boss fights should feel high-stakes and locked-in
- Gem sources should be 10× what they were before this session

## Gotchas

- `schemaVersion: 5` — migration in `storage.ts` handles defeatedBosses, activeBoss, bossKills, corruptedRoll from older saves
- Boss tick uses `Math.min(...moves.map(m => m.intervalMs))` as the attack cadence
- `updateProfile` is a shallow-merge mutator; always spread nested objects before mutating
- Pet upgrade cost for `unobtainable` rarity returns `Infinity` — blocks level-ups
- `leaderboard/submit` API only updates `prob`/`number` if new prob is better; level is always updated

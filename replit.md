# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **Rarity Roller** (`artifacts/number-roller`) — Frontend-only React + Vite mobile-first app at `/`. Schema **v4**. Roll a weighted number 0–10,000 with **7 rarity tiers** (common → … → mythic → **unobtainable**, n=0 or 10,000). Major systems:
  - **Rebirth** (max 30): cost `100k × 1.4^N` coins; resets coins only; grants permanent stacking ×1.5 coins / ×2 XP / +0.05 rarity tilt per rebirth.
  - **Pets** (~30, max level **100**, gem cost past lvl 50): tier brackets common 1-15, uncommon 16-30, rare 31-45, epic 46-60, legendary 61-80, mythic 81-100. Penguin has +15% XP. Pet upgrades & ability cooldowns live **only in Inventory** (the Pets/Equip page only handles slot equipping & shop purchases).
  - **Eggs** (6): common/rare/epic always; jungle (rebirth ≥3), desert (≥5), ocean (≥10). Bought with gems in Shop, hatched in Inventory.
  - **XP Booster** (Shop): 2× XP for 60 s for 1500 coins; alongside coin & rarity boosters.
  - **Quests**: ~20 daily + ~20 weekly; 5 random of each, refreshing every 18 h / 7 d. **Special quests** unlock the 5 unobtainable pets (cosmic-serpent, cybernetic-dragon, developer-monkey, scaly-demon, megalodon).
  - **Weather/Events** (11 types): one auto-triggers every ~10 min, plus on-demand triggers (5 min cooldown) from the Events tab. Effects: coin/xp/rarity/roll-speed; rendered as full-screen overlay + HUD chip.
  - **5-tab BottomNav**: roll · shop · inventory · quests · events. Pets/Achievements/Leaderboard live in the menu drawer (still keep a "Back to roll" header).
  - **Pet abilities** ticked each second (only when equipped): hatch-skip, auto-coins/xp, shark/megalodon eat fish, blue-whale XP, scaly-eat refund. Auto-roll abilities are intentionally not implemented.
  - **Achievements** include evolution thresholds at the new bracket boundaries (16/31/46/61/81), `evolved_pet_epic`, `first_rebirth`, `rebirth_5`, `rebirth_15`. All data in `localStorage` (`rr2.*` keys); v3 → v4 auto-migrates.

  Source layout (under `artifacts/number-roller/src`):
  - `lib/` — types (v4), rarity, distribution, level, rebirth, pets (`MAX_PET_LEVEL=100`, `petCurrentRarity`, `evolutionInfo`, `petUpgradeCost` returning `{coins, gems}`), eggs, weather, quests (`maybeRefreshQuests`, `advanceForRoll`, `bumpDaily/Weekly`, `QUEST_BY_ID`), shop, achievements, sounds, save codes (RR2- with v3→v4 migration), storage
  - `components/` — Header, BottomNav (5-tab), MenuDrawer (8 entries), BoosterBar (now incl. xpUntil), WeatherOverlay + WeatherChip, ScreenAura, Modal, AuthModal, SaveLoadModal, WipeModal, PetDropModal, AchievementToast, PetArt (26 SVGs)
  - `views/` — RollView, ShopView (upgrades + boosters + eggs grid + rebirth panel), InventoryView (egg grid + hatch panel + pet upgrades w/ ability cooldowns), QuestsView (daily/weekly/special tabs), EventsView (active + manual triggers), PetsView (slots + buyable shop pets only), AchievementsView, LeaderboardView
  - `App.tsx` — orchestrates auth gate, tab routing, roll flow incl. weather/rebirth/xp-booster math, quest refresh tick, auto-weather, equipped-pet ability tick, all shop/inventory/quest/weather/rebirth handlers

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

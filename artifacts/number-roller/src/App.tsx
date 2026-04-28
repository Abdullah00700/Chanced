import { useEffect, useMemo, useRef, useState } from "react";
import {
  AchievementToastStack,
  type ToastItem,
} from "./components/AchievementToast";
import { AuthModal } from "./components/AuthModal";
import {
  apiGetLeaderboard,
  apiSubmitLeader,
  apiSyncProfile,
} from "./lib/api";
import { BottomNav, type Tab } from "./components/BottomNav";
import { Header } from "./components/Header";
import { MenuDrawer } from "./components/MenuDrawer";
import { PetDropModal } from "./components/PetDropModal";
import { SaveLoadModal } from "./components/SaveLoadModal";
import { ScreenAura } from "./components/ScreenAura";
import { WeatherChip, WeatherOverlay } from "./components/WeatherOverlay";
import { WipeModal } from "./components/WipeModal";
import { ACHIEVEMENTS } from "./lib/achievements";
import { buildDistribution, sampleWithBoost } from "./lib/distribution";
import { EGG_BY_ID, rollEggHatch } from "./lib/eggs";
import {
  applyXpGain,
  coinMultFromLevel,
  rarityTiltFromLevel,
  xpMultFromLevel,
} from "./lib/level";
import {
  effectiveEffect,
  evolutionInfo,
  isPetMaxed,
  MAX_PET_LEVEL,
  PET_BY_ID,
  PETS,
  petUpgradeCost,
  rollPetDrop,
} from "./lib/pets";
import {
  advanceForRoll,
  bumpDaily,
  bumpWeekly,
  maybeRefreshQuests,
  QUEST_BY_ID,
} from "./lib/quests";
import { CENTER, MAX_NUMBER, RARITY_BY_KEY, rarityFor } from "./lib/rarity";
import {
  MAX_REBIRTH,
  rebirthCoinMult,
  rebirthCost,
  rebirthRarityTilt,
  rebirthXpMult,
} from "./lib/rebirth";
import {
  COIN_BOOSTER_COST,
  COIN_BOOSTER_DURATION_MS,
  COIN_BOOSTER_MULT,
  RARITY_BOOSTER_COST,
  RARITY_BOOSTER_DURATION_MS,
  XP_BOOSTER_COST,
  XP_BOOSTER_DURATION_MS,
  XP_BOOSTER_MULT,
  coinUpgradeCost,
  coinUpgradeMult,
  rarityUpgradeCost,
  rarityUpgradeTilt,
} from "./lib/shop";
import {
  emptyProfile,
  loadAccounts,
  LS_ACTIVE,
  LS_MUTED,
  saveAccounts,
} from "./lib/storage";
import {
  isMuted,
  playAchievement,
  playLevelUp,
  playPetDrop,
  playPurchase,
  playRarity,
  playRollTick,
  setMuted,
} from "./lib/sounds";
import type { LeaderEntry, PetInstance, Profile, RarityKey } from "./lib/types";
import {
  pickRandomWeather,
  WEATHER_BY_ID,
  WEATHER_MANUAL_COOLDOWN_MS,
} from "./lib/weather";
import { AchievementsView } from "./views/AchievementsView";
import { EventsView } from "./views/EventsView";
import { InventoryView } from "./views/InventoryView";
import { LeaderboardView } from "./views/LeaderboardView";
import { PetsView } from "./views/PetsView";
import { QuestsView } from "./views/QuestsView";
import { RollView } from "./views/RollView";
import { ShopView } from "./views/ShopView";

const ROLL_BASE_DURATION_MS = 1100;
const ROLL_TICK_MS = 70;

const NORMAL_TIERS: RarityKey[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
];

export default function App() {
  // ---- Auth state ----
  const [accounts, setAccountsState] = useState<Record<string, Profile>>(() =>
    loadAccounts(),
  );
  const [activeUser, setActiveUser] = useState<string | null>(() => {
    return localStorage.getItem(LS_ACTIVE);
  });

  // Sound mute
  const [muted, setMutedState] = useState<boolean>(() => {
    return localStorage.getItem(LS_MUTED) === "1";
  });
  useEffect(() => {
    setMuted(muted);
    localStorage.setItem(LS_MUTED, muted ? "1" : "0");
  }, [muted]);
  void isMuted;

  // ---- Leaderboard (global, fetched from API) ----
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const entries = await apiGetLeaderboard();
        if (!cancelled) setLeaderboard(entries);
      } catch {
        // ignore — keep what we have
      }
    }
    void refresh();
    const id = window.setInterval(refresh, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  // ---- Active profile ----
  const profile = activeUser ? accounts[activeUser] ?? null : null;

  // ---- Cloud sync: push the active profile to the server, debounced ----
  useEffect(() => {
    if (!profile) return;
    const username = profile.username;
    const passwordHash = profile.passwordHash;
    const snapshot = profile;
    const id = window.setTimeout(() => {
      void apiSyncProfile(username, passwordHash, snapshot).catch(() => {
        // ignore — local cache still holds the latest
      });
    }, 800);
    return () => window.clearTimeout(id);
  }, [profile]);

  function persistAccounts(next: Record<string, Profile>) {
    setAccountsState(next);
    saveAccounts(next);
  }

  function updateProfile(mut: (p: Profile) => Profile) {
    if (!activeUser) return;
    const cur = accounts[activeUser];
    if (!cur) return;
    const updated = mut({ ...cur });
    const next = { ...accounts, [activeUser]: updated };
    persistAccounts(next);
  }

  // ---- UI state ----
  const [tab, setTab] = useState<Tab>("roll");
  const [rolling, setRolling] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(CENTER);
  const [lastResult, setLastResult] = useState<
    | (NonNullable<ReturnType<typeof produceRollResult>> & {
        leveledUp: number;
      })
    | null
  >(null);
  const [auraColor, setAuraColor] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const [rollStartKey, setRollStartKey] = useState(0);
  const [showSave, setShowSave] = useState(false);
  const [showWipe, setShowWipe] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [petDropId, setPetDropId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // All currently equipped pets across slots — combined into one effect.
  const equippedEffects = useMemo(() => {
    if (!profile) return [] as Array<{ def: typeof PET_BY_ID[string]; inst: PetInstance; eff: ReturnType<typeof effectiveEffect> }>;
    const out: Array<{ def: typeof PET_BY_ID[string]; inst: PetInstance; eff: ReturnType<typeof effectiveEffect> }> = [];
    for (const id of profile.equippedPets) {
      if (!id) continue;
      const def = PET_BY_ID[id];
      const inst = profile.pets[id];
      if (!def || !inst) continue;
      out.push({ def, inst, eff: effectiveEffect(def, inst.level) });
    }
    return out;
  }, [profile]);

  const combinedPetEffect = useMemo(() => {
    let coinMult = 1;
    let xpMult = 1;
    let rarityTilt = 0;
    let rollSpeedMult = 1;
    for (const e of equippedEffects) {
      coinMult *= e.eff.coinMult;
      xpMult *= e.eff.xpMult;
      rarityTilt += e.eff.rarityTilt;
      rollSpeedMult *= e.eff.rollSpeedMult;
    }
    return { coinMult, xpMult, rarityTilt, rollSpeedMult };
  }, [equippedEffects]);

  const cyberneticActive = equippedEffects.some(
    (e) => e.def.id === "cybernetic-dragon",
  );

  // ---- Weather effects (active) ----
  const activeWeather = profile?.weather.activeId
    ? profile.weather.activeUntil > now
      ? WEATHER_BY_ID[profile.weather.activeId] ?? null
      : null
    : null;
  const weatherEffects = activeWeather?.effects ?? {};

  // ---- Distribution (with weather + rebirth) ----
  const distTilt = useMemo(() => {
    if (!profile) return 0;
    const fromUpgrade = rarityUpgradeTilt(profile.upgrades.rarity);
    const fromLevel = rarityTiltFromLevel(profile.level);
    const fromBooster = profile.boosters.rarityUntil > now ? 0.4 : 0;
    const fromPet = combinedPetEffect.rarityTilt;
    const fromWeather = weatherEffects.rarityTilt ?? 0;
    const fromRebirth = rebirthRarityTilt(profile.rebirths ?? 0);
    return Math.min(
      3,
      fromUpgrade + fromLevel + fromBooster + fromPet + fromWeather + fromRebirth,
    );
  }, [profile, now, combinedPetEffect, weatherEffects]);

  const dist = useMemo(
    () => buildDistribution(distTilt, cyberneticActive),
    [distTilt, cyberneticActive],
  );

  const rollSpeedMult =
    combinedPetEffect.rollSpeedMult * (weatherEffects.rollSpeedMult ?? 1);

  // ---- Roll logic ----
  const rollAbortRef = useRef(0);
  function doRoll() {
    if (!profile || rolling) return;

    const target = sampleWithBoost(
      dist.cum,
      profile.boosters.rarityUntil > now,
    );
    const myToken = ++rollAbortRef.current;
    setRolling(true);
    setLastResult(null);
    setAuraColor(null);
    setRollStartKey((k) => k + 1);

    const tickMs = Math.max(40, ROLL_TICK_MS * rollSpeedMult);
    const totalMs = Math.max(420, ROLL_BASE_DURATION_MS * rollSpeedMult);
    const start = performance.now();

    const tick = () => {
      if (myToken !== rollAbortRef.current) return;
      const elapsed = performance.now() - start;
      if (elapsed < totalMs) {
        const easing = 1 - elapsed / totalMs;
        const spread = Math.max(50, Math.floor(2500 * easing));
        const fake = clamp(
          Math.floor(target + (Math.random() - 0.5) * 2 * spread),
          0,
          MAX_NUMBER,
        );
        setDisplayNumber(fake);
        playRollTick();
        setTimeout(tick, tickMs);
      } else {
        finalize(target);
      }
    };
    setTimeout(tick, tickMs);

    function finalize(n: number) {
      if (myToken !== rollAbortRef.current) return;
      setDisplayNumber(n);
      const result = produceRollResult(n, dist.probs[n], profile!, now, {
        weatherCoinMult: weatherEffects.coinMult ?? 1,
        weatherXpMult: weatherEffects.xpMult ?? 1,
      });
      setRolling(false);

      // Maybe drop a pet (normal tier drop, never unobtainable)
      const tier = result.rarity;
      const tierProb = sumTierProb(dist.probs, tier);
      const ownedSet = new Set(Object.keys(profile!.pets));
      const droppedId = rollPetDrop(tierProb, tier, ownedSet);
      const droppedPet = droppedId
        ? !ownedSet.has(droppedId)
          ? droppedId
          : null
        : null;
      result.petDropped = droppedPet;

      let nextMythicStreak = profile!.mythicStreak ?? 0;
      if (result.rarity === "mythic") nextMythicStreak += 1;
      else if (result.rarity !== "unobtainable") nextMythicStreak = 0;

      // Apply to profile
      updateProfile((p) => {
        p.coins += result.coinsEarned;
        p.totalRolls += 1;
        p.rollsByRarity = {
          ...p.rollsByRarity,
          [result.rarity]: p.rollsByRarity[result.rarity] + 1,
        };
        p.mythicStreak = nextMythicStreak;
        const lv = applyXpGain(p.level, p.xp, result.xpEarned);
        p.level = lv.level;
        p.xp = lv.xpInLevel;
        if (lv.leveledUp > 0) playLevelUp();

        const distFromCenter = Math.abs(n - CENTER);
        if (
          p.bestNumber == null ||
          Math.abs(p.bestNumber - CENTER) > distFromCenter
        ) {
          p.bestNumber = n;
          p.bestProb = result.prob;
        }
        if (
          p.worstNumber == null ||
          Math.abs(p.worstNumber - CENTER) < distFromCenter
        ) {
          p.worstNumber = n;
          p.worstProb = result.prob;
        }
        if (p.rarestProb == null || result.prob < p.rarestProb) {
          p.rarestNumber = n;
          p.rarestProb = result.prob;
        }

        if (droppedPet) {
          p.pets = {
            ...p.pets,
            [droppedPet]: { ownedAt: Date.now(), level: 1 },
          };
        }

        // Quest progression
        advanceForRoll(p, result.rarity, n, result.coinsEarned, result.xpEarned);

        // Special-quest progression
        const equippedIds = new Set(
          p.equippedPets.filter((x): x is string => !!x),
        );
        const sp = p.quests.specialProgress;
        if (n === 0) sp["cosmic-serpent"] = Math.max(sp["cosmic-serpent"] ?? 0, 1);
        if (n === MAX_NUMBER || nextMythicStreak >= 3) {
          sp["cybernetic-dragon"] = Math.max(sp["cybernetic-dragon"] ?? 0, 1);
        }
        if (
          result.rarity === "legendary" &&
          equippedIds.has("horned-gecko") &&
          (sp["scaly-legendary-rolls"] ?? 0) < 15
        ) {
          sp["scaly-legendary-rolls"] = (sp["scaly-legendary-rolls"] ?? 0) + 1;
        }
        if (
          result.rarity === "mythic" &&
          equippedIds.has("shark") &&
          (sp["shark-mythic-rolls"] ?? 0) < 7
        ) {
          sp["shark-mythic-rolls"] = (sp["shark-mythic-rolls"] ?? 0) + 1;
        }
        return p;
      });

      // Achievements check (passing roll context AND mythic streak)
      checkAndAwardAchievements({
        lastRoll: { number: n, rarity: result.rarity },
        mythicStreak: nextMythicStreak,
      });

      // Leaderboard — submit to cloud and refresh
      if (result.prob < 0.001 && profile) {
        const entry = {
          number: n,
          prob: result.prob,
          rarity: result.rarity,
          level: profile.level,
        };
        void apiSubmitLeader(profile.username, profile.passwordHash, entry)
          .then(() => apiGetLeaderboard())
          .then((entries) => setLeaderboard(entries))
          .catch(() => {
            // ignore
          });
      }

      // Effects
      const r = RARITY_BY_KEY[result.rarity];
      setAuraColor(r.auraColor);
      setPulseKey((k) => k + 1);
      playRarity(result.rarity);

      setLastResult({ ...result, leveledUp: 0 });

      if (droppedPet) {
        playPetDrop();
        setTimeout(() => setPetDropId(droppedPet), 600);
      }
    }
  }

  // ---- Achievement check ----
  function checkAndAwardAchievements(ctx: {
    lastRoll: { number: number; rarity: RarityKey } | null;
    mythicStreak?: number;
  }) {
    if (!activeUser) return;
    const cur = accounts[activeUser];
    if (!cur) return;
    let next = { ...cur };
    const justAwarded: typeof ACHIEVEMENTS = [];
    const grantedPets: string[] = [];
    for (const a of ACHIEVEMENTS) {
      if (next.achievements[a.id]) continue;
      if (a.check(next, ctx)) {
        const newPets = { ...next.pets };
        if (a.reward.petId && !newPets[a.reward.petId]) {
          newPets[a.reward.petId] = { ownedAt: Date.now(), level: 1 };
          grantedPets.push(a.reward.petId);
        }
        next = {
          ...next,
          achievements: { ...next.achievements, [a.id]: Date.now() },
          coins: next.coins + a.reward.coins,
          gems: next.gems + a.reward.gems,
          pets: newPets,
        };
        if (a.reward.xp > 0) {
          const lv = applyXpGain(next.level, next.xp, a.reward.xp);
          next.level = lv.level;
          next.xp = lv.xpInLevel;
        }
        justAwarded.push(a);
      }
    }
    if (justAwarded.length > 0) {
      playAchievement();
      const map = { ...accounts, [activeUser]: next };
      persistAccounts(map);
      setToasts((prev) => {
        const queue = [...prev];
        justAwarded.forEach((a, i) => {
          const id = ++toastIdRef.current;
          if (i === 0) {
            queue.push({ id, achievement: a });
          } else {
            setTimeout(() => {
              setToasts((p) => [...p, { id, achievement: a }]);
            }, i * 350);
          }
        });
        return queue;
      });
      if (grantedPets.length > 0) {
        setTimeout(() => {
          playPetDrop();
          setPetDropId(grantedPets[0]);
        }, 900);
      }
    }
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // ---- Shop actions ----
  function buyCoinUpgrade() {
    if (!profile) return;
    const cost = coinUpgradeCost(profile.upgrades.coin);
    if (profile.coins < cost.coins || profile.gems < cost.gems) return;
    updateProfile((p) => {
      p.coins -= cost.coins;
      p.gems -= cost.gems;
      p.upgrades = { ...p.upgrades, coin: p.upgrades.coin + 1 };
      bumpDaily(p, "d-buy-upgrade");
      bumpWeekly(p, "w-coin-up-3");
      return p;
    });
    playPurchase();
    setTimeout(() => checkAndAwardAchievements({ lastRoll: null }), 0);
  }
  function buyRarityUpgrade() {
    if (!profile) return;
    const cost = rarityUpgradeCost(profile.upgrades.rarity);
    if (profile.coins < cost.coins || profile.gems < cost.gems) return;
    updateProfile((p) => {
      p.coins -= cost.coins;
      p.gems -= cost.gems;
      p.upgrades = { ...p.upgrades, rarity: p.upgrades.rarity + 1 };
      bumpDaily(p, "d-buy-upgrade");
      bumpWeekly(p, "w-rarity-up-3");
      return p;
    });
    playPurchase();
    setTimeout(() => checkAndAwardAchievements({ lastRoll: null }), 0);
  }
  function buyCoinBooster() {
    if (!profile || profile.coins < COIN_BOOSTER_COST) return;
    updateProfile((p) => {
      p.coins -= COIN_BOOSTER_COST;
      const base = Math.max(p.boosters.coinUntil, Date.now());
      p.boosters = {
        ...p.boosters,
        coinUntil: base + COIN_BOOSTER_DURATION_MS,
      };
      bumpDaily(p, "d-booster");
      return p;
    });
    playPurchase();
  }
  function buyRarityBooster() {
    if (!profile || profile.coins < RARITY_BOOSTER_COST) return;
    updateProfile((p) => {
      p.coins -= RARITY_BOOSTER_COST;
      const base = Math.max(p.boosters.rarityUntil, Date.now());
      p.boosters = {
        ...p.boosters,
        rarityUntil: base + RARITY_BOOSTER_DURATION_MS,
      };
      bumpDaily(p, "d-booster");
      return p;
    });
    playPurchase();
  }
  function buyXpBooster() {
    if (!profile || profile.coins < XP_BOOSTER_COST) return;
    updateProfile((p) => {
      p.coins -= XP_BOOSTER_COST;
      const base = Math.max(p.boosters.xpUntil, Date.now());
      p.boosters = {
        ...p.boosters,
        xpUntil: base + XP_BOOSTER_DURATION_MS,
      };
      bumpDaily(p, "d-booster");
      return p;
    });
    playPurchase();
  }
  function buyPet(id: string) {
    const pet = PET_BY_ID[id];
    if (!profile || !pet) return;
    if (profile.pets[id]) return;
    if (pet.baseRarity === "unobtainable") return;
    if (profile.coins < pet.costCoins || profile.gems < pet.costGems) return;
    updateProfile((p) => {
      p.coins -= pet.costCoins;
      p.gems -= pet.costGems;
      p.pets = { ...p.pets, [id]: { ownedAt: Date.now(), level: 1 } };
      bumpDaily(p, "d-shop-pet");
      bumpWeekly(p, "w-shop-pet-3");
      return p;
    });
    playPurchase();
    setTimeout(() => checkAndAwardAchievements({ lastRoll: null }), 0);
  }

  function upgradePet(id: string) {
    if (!profile) return;
    const def = PET_BY_ID[id];
    const inst = profile.pets[id];
    if (!def || !inst) return;
    if (def.baseRarity === "unobtainable") return;
    if (isPetMaxed(def, inst.level)) return;
    const cost = petUpgradeCost(def, inst.level);
    if (profile.coins < cost.coins || profile.gems < cost.gems) return;

    // Block tier-evolution if player level too low.
    const ev = evolutionInfo(def, inst, profile.level);
    const nextLevel = inst.level + 1;
    if (
      ev.next != null &&
      nextLevel >= ev.petLevelNeeded &&
      profile.level < ev.playerLevelNeeded
    ) {
      return;
    }

    const prevRarity = ev.cur;

    updateProfile((p) => {
      p.coins -= cost.coins;
      p.gems -= cost.gems;
      const ex = p.pets[id];
      const newInst: PetInstance = {
        ownedAt: ex?.ownedAt ?? Date.now(),
        level: nextLevel,
      };
      p.pets = { ...p.pets, [id]: newInst };
      bumpDaily(p, "d-pet-upgrade");
      bumpWeekly(p, "w-pet-upgrades-25");

      // Special: monkey-max-level
      if (id === "monkey") {
        const sp = p.quests.specialProgress;
        sp["monkey-max-level"] = Math.max(
          sp["monkey-max-level"] ?? 0,
          nextLevel,
        );
      }

      // Weekly evolution counter (rarity tier crossed)
      const newEv = evolutionInfo(def, newInst, p.level);
      if (newEv.cur !== prevRarity) {
        bumpWeekly(p, "w-pet-evolutions");
      }
      return p;
    });
    playPurchase();
    setTimeout(() => checkAndAwardAchievements({ lastRoll: null }), 0);
  }

  function equipPet(id: string | null, slot?: number) {
    if (!profile) return;
    if (id && !profile.pets[id]) return;
    const totalSlots = 1 + profile.extraSlots;
    updateProfile((p) => {
      const slots = [...p.equippedPets];
      while (slots.length < totalSlots) slots.push(null);
      slots.length = totalSlots;
      if (id == null) {
        if (typeof slot === "number") {
          if (slot >= 0 && slot < totalSlots) slots[slot] = null;
        } else {
          for (let i = 0; i < slots.length; i++) slots[i] = null;
        }
      } else {
        let target = typeof slot === "number" ? slot : -1;
        if (target < 0) {
          target = slots.findIndex((s) => s == null);
          if (target < 0) target = 0;
        }
        if (target >= 0 && target < totalSlots) {
          if (slots[target] === id) {
            slots[target] = null;
          } else {
            for (let i = 0; i < slots.length; i++) {
              if (slots[i] === id) slots[i] = null;
            }
            slots[target] = id;
          }
        }
      }
      p.equippedPets = slots;
      return p;
    });
  }

  function buyExtraSlot() {
    if (!profile) return;
    if (profile.extraSlots >= 2) return;
    const cost = extraSlotCost(profile.extraSlots);
    if (profile.gems < cost) return;
    updateProfile((p) => {
      p.gems -= cost;
      p.extraSlots = Math.min(2, p.extraSlots + 1);
      const slots = [...p.equippedPets];
      while (slots.length < 1 + p.extraSlots) slots.push(null);
      p.equippedPets = slots;
      return p;
    });
    playPurchase();
  }

  // ---- Egg & hatch actions ----
  function buyEgg(eggId: string) {
    if (!profile) return;
    const def = EGG_BY_ID[eggId];
    if (!def) return;
    if ((profile.rebirths ?? 0) < def.rebirthRequired) return;
    if (profile.gems < def.cost) return;
    updateProfile((p) => {
      p.gems -= def.cost;
      p.eggs = { ...p.eggs, [eggId]: (p.eggs[eggId] ?? 0) + 1 };
      bumpWeekly(p, "w-buy-eggs");
      return p;
    });
    playPurchase();
  }

  function startHatch(eggId: string) {
    if (!profile) return;
    if (profile.hatch) return;
    if ((profile.eggs[eggId] ?? 0) <= 0) return;
    const def = EGG_BY_ID[eggId];
    if (!def) return;
    updateProfile((p) => {
      p.eggs = { ...p.eggs, [eggId]: Math.max(0, (p.eggs[eggId] ?? 0) - 1) };
      p.hatch = {
        eggId,
        startedAt: Date.now(),
        durationMs: def.hatchMs,
      };
      return p;
    });
  }

  function cancelHatch() {
    if (!profile || !profile.hatch) return;
    updateProfile((p) => {
      p.hatch = null;
      return p;
    });
  }

  function claimHatch() {
    if (!profile || !profile.hatch) return;
    const h = profile.hatch;
    if (Date.now() - h.startedAt < h.durationMs) return;
    const petId = rollEggHatch(h.eggId);
    if (!petId) {
      updateProfile((p) => {
        p.hatch = null;
        return p;
      });
      return;
    }
    updateProfile((p) => {
      const ex = p.pets[petId];
      if (ex) {
        const newLv = Math.min(MAX_PET_LEVEL, (ex.level ?? 1) + 1);
        p.pets = { ...p.pets, [petId]: { ...ex, level: newLv } };
      } else {
        p.pets = {
          ...p.pets,
          [petId]: { ownedAt: Date.now(), level: 1 },
        };
      }
      p.hatch = null;
      bumpDaily(p, "d-hatch-1");
      bumpWeekly(p, "w-hatch-10");
      return p;
    });
    playPetDrop();
    setPetDropId(petId);
    setTimeout(() => checkAndAwardAchievements({ lastRoll: null }), 0);
  }

  // ---- Quest claim ----
  function claimQuest(questId: string) {
    if (!profile) return;
    const q = QUEST_BY_ID[questId];
    if (!q) return;
    const prog = q.progress(profile);
    if (prog < q.target) return;
    if (q.kind === "daily" && profile.quests.dailyClaimed[questId]) return;
    if (q.kind === "weekly" && profile.quests.weeklyClaimed[questId]) return;
    if (q.kind === "special" && profile.achievements[`special-${questId}`]) {
      return;
    }
    let grantedPet: string | null = null;
    updateProfile((p) => {
      p.coins += q.reward.coins;
      p.gems += q.reward.gems;
      if (q.reward.xp > 0) {
        const lv = applyXpGain(p.level, p.xp, q.reward.xp);
        p.level = lv.level;
        p.xp = lv.xpInLevel;
      }
      if (q.reward.petId && !p.pets[q.reward.petId]) {
        p.pets = {
          ...p.pets,
          [q.reward.petId]: { ownedAt: Date.now(), level: 1 },
        };
        grantedPet = q.reward.petId;
      }
      if (q.kind === "daily") {
        p.quests.dailyClaimed = {
          ...p.quests.dailyClaimed,
          [questId]: Date.now(),
        };
      } else if (q.kind === "weekly") {
        p.quests.weeklyClaimed = {
          ...p.quests.weeklyClaimed,
          [questId]: Date.now(),
        };
      } else {
        p.achievements = {
          ...p.achievements,
          [`special-${questId}`]: Date.now(),
        };
      }
      return p;
    });
    playPurchase();
    if (grantedPet) {
      playPetDrop();
      setTimeout(() => setPetDropId(grantedPet), 300);
    }
    setTimeout(() => checkAndAwardAchievements({ lastRoll: null }), 0);
  }

  // ---- Weather trigger ----
  function triggerWeather(weatherId: string) {
    if (!profile) return;
    const def = WEATHER_BY_ID[weatherId];
    if (!def) return;
    if (profile.weather.manualCooldownUntil > now) return;
    if (profile.weather.activeId === weatherId) return;
    updateProfile((p) => {
      p.weather = {
        activeId: def.id,
        activeUntil: Date.now() + def.durationMs,
        nextAutoAt: Math.max(
          p.weather.nextAutoAt,
          Date.now() + def.durationMs + 60_000,
        ),
        manualCooldownUntil: Date.now() + WEATHER_MANUAL_COOLDOWN_MS,
      };
      bumpDaily(p, "d-event-trigger");
      bumpWeekly(p, "w-events-5");
      return p;
    });
  }

  // ---- Rebirth ----
  function doRebirth() {
    if (!profile) return;
    const cur = profile.rebirths ?? 0;
    if (cur >= MAX_REBIRTH) return;
    const cost = rebirthCost(cur);
    if (profile.coins < cost) return;
    updateProfile((p) => {
      p.coins = 0;
      p.rebirths = (p.rebirths ?? 0) + 1;
      bumpWeekly(p, "w-rebirth-1");
      return p;
    });
    playLevelUp();
    setTimeout(() => checkAndAwardAchievements({ lastRoll: null }), 0);
  }

  // ---- Tick: refresh quests, auto weather, pet abilities ----
  useEffect(() => {
    if (!profile) return;
    let changed = false;
    const draft: Profile = {
      ...profile,
      quests: { ...profile.quests },
      weather: { ...profile.weather },
      petAbilityNext: { ...profile.petAbilityNext },
      pets: { ...profile.pets },
    };
    const before = JSON.stringify({
      q: draft.quests,
      w: draft.weather,
      pa: draft.petAbilityNext,
      pets: draft.pets,
      coins: draft.coins,
      gems: draft.gems,
      xp: draft.xp,
      lvl: draft.level,
      hatch: draft.hatch,
    });

    // Quests refresh
    maybeRefreshQuests(draft, now);

    // Auto weather: kick one off if expired and we're past nextAutoAt
    if (draft.weather.activeUntil <= now && draft.weather.nextAutoAt <= now) {
      const w = pickRandomWeather(draft.weather.activeId);
      draft.weather = {
        activeId: w.id,
        activeUntil: now + w.durationMs,
        nextAutoAt: now + w.durationMs + 10 * 60_000,
        manualCooldownUntil: draft.weather.manualCooldownUntil,
      };
    } else if (draft.weather.activeId && draft.weather.activeUntil <= now) {
      draft.weather.activeId = null;
    }

    // Pet abilities (only run for equipped pets)
    for (const id of draft.equippedPets) {
      if (!id) continue;
      const def = PET_BY_ID[id];
      const inst = draft.pets[id];
      if (!def || !inst) continue;
      const interval = def.effect.abilityIntervalMs;
      const kind = def.effect.abilityKind;
      if (!interval || !kind) continue;
      const nextAt = draft.petAbilityNext[id] ?? 0;
      if (nextAt === 0) {
        draft.petAbilityNext[id] = now + interval;
        continue;
      }
      if (nextAt > now) continue;
      // Fire ability
      switch (kind) {
        case "hatch-skip": {
          const skip = def.effect.hatchSkipMs ?? 1000;
          if (draft.hatch) {
            draft.hatch = {
              ...draft.hatch,
              startedAt: draft.hatch.startedAt - skip,
            };
          }
          break;
        }
        case "auto-coins": {
          draft.coins += def.effect.abilityPayload ?? 100;
          break;
        }
        case "auto-xp": {
          const lv = applyXpGain(
            draft.level,
            draft.xp,
            def.effect.abilityPayload ?? 100,
          );
          draft.level = lv.level;
          draft.xp = lv.xpInLevel;
          break;
        }
        case "shark-eats-fish": {
          if ((draft.pets["fish"]?.level ?? 0) > 0) {
            draft.coins += def.effect.abilityPayload ?? 6000;
          }
          break;
        }
        case "megalodon-eats-fish": {
          if ((draft.pets["fish"]?.level ?? 0) > 0) {
            const fishCount = def.effect.abilityPayload ?? 30;
            const perFish = 1000 + Math.floor(Math.random() * 4000);
            draft.coins += fishCount * perFish;
          }
          break;
        }
        case "blue-whale": {
          const xp = (def.effect.abilityPayload ?? 10000) * (draft.level ?? 1);
          if ((draft.pets["fish"]?.level ?? 0) > 0) {
            const lv = applyXpGain(draft.level, draft.xp, xp);
            draft.level = lv.level;
            draft.xp = lv.xpInLevel;
          } else {
            draft.gems = Math.max(0, draft.gems - 1);
          }
          break;
        }
        case "scaly-eat": {
          // Refund a random shop pet under epic, level it up
          const candidates = PETS.filter(
            (p) =>
              p.source !== "egg" &&
              p.source !== "special" &&
              p.baseRarity !== "unobtainable" &&
              ["common", "uncommon", "rare"].includes(p.baseRarity) &&
              draft.pets[p.id],
          );
          if (candidates.length > 0) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            draft.coins += pick.costCoins;
            const ex = draft.pets[pick.id];
            const newLv = Math.min(MAX_PET_LEVEL, (ex?.level ?? 1) + 1);
            draft.pets = {
              ...draft.pets,
              [pick.id]: { ownedAt: ex?.ownedAt ?? Date.now(), level: newLv },
            };
          }
          break;
        }
        // auto-roll / dev-monkey-roll / fennec-borrow / scaly-uplevel-all: skipped
        default:
          break;
      }
      draft.petAbilityNext[id] = now + interval;
      changed = true;
    }

    const after = JSON.stringify({
      q: draft.quests,
      w: draft.weather,
      pa: draft.petAbilityNext,
      pets: draft.pets,
      coins: draft.coins,
      gems: draft.gems,
      xp: draft.xp,
      lvl: draft.level,
      hatch: draft.hatch,
    });
    if (changed || before !== after) {
      updateProfile(() => draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, activeUser]);

  // ---- Auth handlers ----
  function handleAuthed(p: Profile, passwordHash: string) {
    // Cloud profile is authoritative; ensure local hash matches the one we used to sign in.
    const merged: Profile = { ...p, passwordHash };
    const key = p.username.toLowerCase();
    const next = { ...accounts, [key]: merged };
    persistAccounts(next);
    setActiveUser(key);
    localStorage.setItem(LS_ACTIVE, key);
  }
  function handleLogout() {
    setActiveUser(null);
    localStorage.removeItem(LS_ACTIVE);
    setTab("roll");
    setLastResult(null);
    setAuraColor(null);
  }
  function handleWipe() {
    if (!activeUser || !profile) return;
    const fresh = emptyProfile(profile.username, profile.passwordHash);
    const next = { ...accounts, [activeUser]: fresh };
    persistAccounts(next);
    setShowWipe(false);
    setLastResult(null);
    setAuraColor(null);
  }

  // ---- Render ----
  if (!profile) {
    return (
      <div className="min-h-dvh">
        <AuthModal onAuthed={handleAuthed} />
      </div>
    );
  }

  const isMenuOnlyTab =
    tab === "pets" || tab === "achievements" || tab === "leaderboard";
  const weatherTimeLeft = Math.max(0, profile.weather.activeUntil - now);

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col px-3 pb-24">
      <ScreenAura color={auraColor} pulseKey={pulseKey} />
      <WeatherOverlay
        activeId={
          profile.weather.activeUntil > now ? profile.weather.activeId : null
        }
      />
      <Header
        profile={profile}
        muted={muted}
        onToggleMute={() => setMutedState((m) => !m)}
        onOpenMenu={() => setMenuOpen(true)}
      />

      {/* Top weather chip + rebirth chip */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {profile.weather.activeUntil > now && profile.weather.activeId && (
          <WeatherChip
            activeId={profile.weather.activeId}
            timeLeft={weatherTimeLeft}
            onClick={() => setTab("events")}
          />
        )}
        {(profile.rebirths ?? 0) > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-bold text-fuchsia-200">
            ↻ Rebirth {profile.rebirths}
          </span>
        )}
      </div>

      {isMenuOnlyTab && (
        <button
          onClick={() => setTab("roll")}
          className="mb-3 flex items-center gap-1.5 self-start rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2.5 py-1.5 text-[11px] font-bold text-zinc-300 active:bg-zinc-800"
        >
          ← Back to roll
        </button>
      )}

      {tab === "roll" && (
        <RollView
          profile={profile}
          rolling={rolling}
          displayNumber={displayNumber}
          lastResult={lastResult}
          onRoll={doRoll}
          rollSpeedMult={rollSpeedMult}
          rollStartKey={rollStartKey}
          now={now}
        />
      )}
      {tab === "shop" && (
        <ShopView
          profile={profile}
          now={now}
          onBuyCoinUpgrade={buyCoinUpgrade}
          onBuyRarityUpgrade={buyRarityUpgrade}
          onBuyCoinBooster={buyCoinBooster}
          onBuyRarityBooster={buyRarityBooster}
          onBuyXpBooster={buyXpBooster}
          onBuyEgg={buyEgg}
          onRebirth={doRebirth}
        />
      )}
      {tab === "inventory" && (
        <InventoryView
          profile={profile}
          now={now}
          onUpgradePet={upgradePet}
          onEquip={equipPet}
          onStartHatch={startHatch}
          onClaimHatch={claimHatch}
          onCancelHatch={cancelHatch}
        />
      )}
      {tab === "quests" && (
        <QuestsView profile={profile} now={now} onClaim={claimQuest} />
      )}
      {tab === "events" && (
        <EventsView profile={profile} now={now} onTrigger={triggerWeather} />
      )}
      {tab === "pets" && (
        <PetsView
          profile={profile}
          onEquip={equipPet}
          onBuyPet={buyPet}
          onBuyExtraSlot={buyExtraSlot}
          extraSlotCost={extraSlotCost}
        />
      )}
      {tab === "achievements" && <AchievementsView profile={profile} />}
      {tab === "leaderboard" && (
        <LeaderboardView entries={leaderboard} currentUser={profile.username} />
      )}

      <BottomNav active={tab} onChange={setTab} />

      <MenuDrawer
        open={menuOpen}
        active={tab}
        onClose={() => setMenuOpen(false)}
        onChangeTab={setTab}
        onOpenSave={() => setShowSave(true)}
        onOpenWipe={() => setShowWipe(true)}
        onLogout={handleLogout}
      />

      {showSave && (
        <SaveLoadModal profile={profile} onClose={() => setShowSave(false)} />
      )}
      {showWipe && (
        <WipeModal
          username={profile.username}
          onCancel={() => setShowWipe(false)}
          onConfirm={handleWipe}
        />
      )}
      {petDropId && (
        <PetDropModal
          petId={petDropId}
          onClose={() => setPetDropId(null)}
          onEquip={() => {
            equipPet(petDropId, undefined);
            setPetDropId(null);
          }}
        />
      )}

      <AchievementToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ---- Helpers ----
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// Cost in gems to unlock the next extra pet slot.
const EXTRA_SLOT_GEM_COSTS = [75, 200];
function extraSlotCost(currentExtra: number): number {
  if (currentExtra < 0 || currentExtra >= EXTRA_SLOT_GEM_COSTS.length) {
    return Number.POSITIVE_INFINITY;
  }
  return EXTRA_SLOT_GEM_COSTS[currentExtra];
}

function sumTierProb(probs: Float64Array, tier: RarityKey): number {
  let total = 0;
  for (let n = 0; n <= MAX_NUMBER; n++) {
    if (rarityFor(n).key === tier) total += probs[n];
  }
  return total;
}

function produceRollResult(
  n: number,
  prob: number,
  profile: Profile,
  now: number,
  extras: { weatherCoinMult: number; weatherXpMult: number },
) {
  const r = rarityFor(n);
  let petCoinMult = 1;
  let petXpMult = 1;
  for (const id of profile.equippedPets) {
    if (!id) continue;
    const def = PET_BY_ID[id];
    const inst = profile.pets[id];
    if (def && inst) {
      const eff = effectiveEffect(def, inst.level);
      petCoinMult *= eff.coinMult;
      petXpMult *= eff.xpMult;
    }
  }
  const baseCoins = r.baseCoins;
  const baseXp = r.baseXp;

  const upgradeCoinMult = coinUpgradeMult(profile.upgrades.coin);
  const levelCoinMult = coinMultFromLevel(profile.level);
  const boosterCoinMult =
    profile.boosters.coinUntil > now ? COIN_BOOSTER_MULT : 1;
  const xpBoosterMult =
    profile.boosters.xpUntil > now ? XP_BOOSTER_MULT : 1;
  const reCoinMult = rebirthCoinMult(profile.rebirths ?? 0);
  const reXpMult = rebirthXpMult(profile.rebirths ?? 0);
  const coinMult =
    upgradeCoinMult *
    levelCoinMult *
    petCoinMult *
    boosterCoinMult *
    reCoinMult *
    extras.weatherCoinMult;

  const levelXpMult = xpMultFromLevel(profile.level);
  const xpMult =
    levelXpMult * petXpMult * xpBoosterMult * reXpMult * extras.weatherXpMult;

  // Tier helper hint (unused but useful for future)
  void NORMAL_TIERS;

  return {
    number: n,
    prob,
    rarity: r.key,
    baseCoins,
    coinMult,
    coinsEarned: Math.max(1, Math.floor(baseCoins * coinMult)),
    baseXp,
    xpMult,
    xpEarned: Math.max(1, Math.floor(baseXp * xpMult)),
    petDropped: null as string | null,
  };
}

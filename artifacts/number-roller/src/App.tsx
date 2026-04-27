import { useEffect, useMemo, useRef, useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { BottomNav, type Tab } from "./components/BottomNav";
import { Header } from "./components/Header";
import { PetDropModal } from "./components/PetDropModal";
import { SaveLoadModal } from "./components/SaveLoadModal";
import { ScreenAura } from "./components/ScreenAura";
import { WipeModal } from "./components/WipeModal";
import { ACHIEVEMENTS } from "./lib/achievements";
import { buildDistribution, sampleWithBoost } from "./lib/distribution";
import {
  applyXpGain,
  coinMultFromLevel,
  rarityTiltFromLevel,
  xpMultFromLevel,
} from "./lib/level";
import { PET_BY_ID, rollPetDrop } from "./lib/pets";
import { CENTER, MAX_NUMBER, RARITY_BY_KEY, rarityFor } from "./lib/rarity";
import {
  COIN_BOOSTER_COST,
  COIN_BOOSTER_DURATION_MS,
  COIN_BOOSTER_MULT,
  RARITY_BOOSTER_COST,
  RARITY_BOOSTER_DURATION_MS,
  coinUpgradeCost,
  coinUpgradeMult,
  rarityUpgradeCost,
  rarityUpgradeTilt,
} from "./lib/shop";
import {
  emptyProfile,
  loadAccounts,
  loadLeaderboard,
  LS_ACTIVE,
  LS_MUTED,
  saveAccounts,
  saveLeaderboard,
  upsertLeader,
} from "./lib/storage";
import {
  isMuted,
  playAchievement,
  playLevelUp,
  playPetDrop,
  playPurchase,
  playRarity,
  playRollClick,
  setMuted,
} from "./lib/sounds";
import type { LeaderEntry, Profile } from "./lib/types";
import { AchievementsView } from "./views/AchievementsView";
import { LeaderboardView } from "./views/LeaderboardView";
import { PetsView } from "./views/PetsView";
import { RollView } from "./views/RollView";
import { ShopView } from "./views/ShopView";

const ROLL_BASE_DURATION_MS = 800;
const ROLL_TICK_MS = 70;

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
  // sync helper
  void isMuted;

  // ---- Leaderboard ----
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>(() =>
    loadLeaderboard(),
  );
  useEffect(() => saveLeaderboard(leaderboard), [leaderboard]);

  // ---- Active profile ----
  const profile = activeUser ? accounts[activeUser] ?? null : null;

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
  const [showSave, setShowSave] = useState(false);
  const [showWipe, setShowWipe] = useState(false);
  const [petDropId, setPetDropId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // ---- Distribution ----
  const distTilt = useMemo(() => {
    if (!profile) return 0;
    const fromUpgrade = rarityUpgradeTilt(profile.upgrades.rarity);
    const fromLevel = rarityTiltFromLevel(profile.level);
    const fromBooster =
      profile.boosters.rarityUntil > now ? 0.4 : 0;
    const equipped = profile.equippedPet
      ? PET_BY_ID[profile.equippedPet]
      : null;
    const fromPet = equipped?.effect.rarityTilt ?? 0;
    return Math.min(2, fromUpgrade + fromLevel + fromBooster + fromPet);
  }, [profile, now]);

  const dist = useMemo(() => buildDistribution(distTilt), [distTilt]);

  const rollSpeedMult = useMemo(() => {
    if (!profile?.equippedPet) return 1;
    const pet = PET_BY_ID[profile.equippedPet];
    return pet?.effect.rollSpeedMult ?? 1;
  }, [profile]);

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

    const tickMs = Math.max(40, ROLL_TICK_MS * rollSpeedMult);
    const totalMs = Math.max(300, ROLL_BASE_DURATION_MS * rollSpeedMult);
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
        playRollClick();
        setTimeout(tick, tickMs);
      } else {
        finalize(target);
      }
    };
    setTimeout(tick, tickMs);

    function finalize(n: number) {
      if (myToken !== rollAbortRef.current) return;
      setDisplayNumber(n);
      const result = produceRollResult(n, dist.probs[n], profile!, now);
      setRolling(false);

      // Maybe drop a pet
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

      // Apply to profile
      updateProfile((p) => {
        // Add coins/xp/rolls
        p.coins += result.coinsEarned;
        p.totalRolls += 1;
        p.rollsByRarity = {
          ...p.rollsByRarity,
          [result.rarity]: p.rollsByRarity[result.rarity] + 1,
        };
        const lv = applyXpGain(p.level, p.xp, result.xpEarned);
        p.level = lv.level;
        p.xp = lv.xpInLevel;
        if (lv.leveledUp > 0) playLevelUp();

        // Update best/worst/rarest
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

        // Pet drop
        if (droppedPet) {
          p.pets = {
            ...p.pets,
            [droppedPet]: { ownedAt: Date.now() },
          };
        }
        return p;
      });

      // Achievements check
      checkAndAwardAchievements({
        lastRoll: { number: n, rarity: result.rarity },
      });

      // Leaderboard if rare enough
      if (result.prob < 0.001) {
        setLeaderboard((lb) =>
          upsertLeader(lb, {
            username: profile!.username,
            number: n,
            prob: result.prob,
            rarity: result.rarity,
            level: profile!.level,
            timestamp: Date.now(),
          }),
        );
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
    lastRoll: { number: number; rarity: import("./lib/types").RarityKey } | null;
  }) {
    if (!activeUser) return;
    const cur = accounts[activeUser];
    if (!cur) return;
    let next = { ...cur };
    let awardedAny = false;
    for (const a of ACHIEVEMENTS) {
      if (next.achievements[a.id]) continue;
      if (a.check(next, ctx)) {
        next = {
          ...next,
          achievements: { ...next.achievements, [a.id]: Date.now() },
          coins: next.coins + a.reward.coins,
          gems: next.gems + a.reward.gems,
        };
        if (a.reward.xp > 0) {
          const lv = applyXpGain(next.level, next.xp, a.reward.xp);
          next.level = lv.level;
          next.xp = lv.xpInLevel;
        }
        awardedAny = true;
      }
    }
    if (awardedAny) {
      playAchievement();
      const map = { ...accounts, [activeUser]: next };
      persistAccounts(map);
    }
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
      return p;
    });
    playPurchase();
  }
  function buyPet(id: string) {
    const pet = PET_BY_ID[id];
    if (!profile || !pet) return;
    if (profile.pets[id]) return;
    if (profile.coins < pet.costCoins || profile.gems < pet.costGems) return;
    updateProfile((p) => {
      p.coins -= pet.costCoins;
      p.gems -= pet.costGems;
      p.pets = { ...p.pets, [id]: { ownedAt: Date.now() } };
      return p;
    });
    playPurchase();
    setTimeout(() => checkAndAwardAchievements({ lastRoll: null }), 0);
  }
  function equipPet(id: string | null) {
    if (!profile) return;
    if (id && !profile.pets[id]) return;
    updateProfile((p) => {
      p.equippedPet = id;
      return p;
    });
  }

  // ---- Auth handlers ----
  function handleSignup(p: Profile) {
    const key = p.username.toLowerCase();
    const next = { ...accounts, [key]: p };
    persistAccounts(next);
    setActiveUser(key);
    localStorage.setItem(LS_ACTIVE, key);
  }
  function handleLogin(key: string) {
    setActiveUser(key);
    localStorage.setItem(LS_ACTIVE, key);
  }
  function handleLoadFromCode(p: Profile) {
    const key = p.username.toLowerCase();
    const next = { ...accounts, [key]: p };
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
        <AuthModal
          accounts={accounts}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onLoadFromCode={handleLoadFromCode}
        />
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col px-3 pb-20">
      <ScreenAura color={auraColor} pulseKey={pulseKey} />
      <Header
        profile={profile}
        muted={muted}
        onToggleMute={() => setMutedState((m) => !m)}
        onOpenSave={() => setShowSave(true)}
        onOpenWipe={() => setShowWipe(true)}
        onLogout={handleLogout}
      />

      {tab === "roll" && (
        <RollView
          profile={profile}
          rolling={rolling}
          displayNumber={displayNumber}
          lastResult={lastResult}
          onRoll={doRoll}
          rollSpeedMult={rollSpeedMult}
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
        />
      )}
      {tab === "pets" && (
        <PetsView profile={profile} onEquip={equipPet} onBuyPet={buyPet} />
      )}
      {tab === "achievements" && <AchievementsView profile={profile} />}
      {tab === "leaderboard" && (
        <LeaderboardView entries={leaderboard} currentUser={profile.username} />
      )}

      <BottomNav active={tab} onChange={setTab} />

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
            equipPet(petDropId);
            setPetDropId(null);
          }}
        />
      )}
    </div>
  );
}

// ---- Helpers ----
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function sumTierProb(
  probs: Float64Array,
  tier: import("./lib/types").RarityKey,
): number {
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
) {
  const r = rarityFor(n);
  const equipped = profile.equippedPet ? PET_BY_ID[profile.equippedPet] : null;
  const baseCoins = r.baseCoins;
  const baseXp = r.baseXp;

  const upgradeCoinMult = coinUpgradeMult(profile.upgrades.coin);
  const levelCoinMult = coinMultFromLevel(profile.level);
  const petCoinMult = equipped?.effect.coinMult ?? 1;
  const boosterCoinMult =
    profile.boosters.coinUntil > now ? COIN_BOOSTER_MULT : 1;
  const coinMult =
    upgradeCoinMult * levelCoinMult * petCoinMult * boosterCoinMult;

  const levelXpMult = xpMultFromLevel(profile.level);
  const petXpMult = equipped?.effect.xpMult ?? 1;
  const xpMult = levelXpMult * petXpMult;

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

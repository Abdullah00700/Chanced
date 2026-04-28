import { useState } from "react";
import { PetArt } from "../components/PetArt";
import { formatNumber, formatTimeLeft } from "../lib/format";
import { PET_BY_ID } from "../lib/pets";
import {
  QUEST_BY_ID,
  SPECIAL_QUESTS,
  type QuestDef,
  type QuestKind,
} from "../lib/quests";
import type { Profile } from "../lib/types";

export function QuestsView({
  profile,
  now,
  onClaim,
}: {
  profile: Profile;
  now: number;
  onClaim: (questId: string) => void;
}) {
  const [tab, setTab] = useState<QuestKind>("daily");

  const dailyDefs = profile.quests.dailyAssigned
    .map((id) => QUEST_BY_ID[id])
    .filter(Boolean) as QuestDef[];
  const weeklyDefs = profile.quests.weeklyAssigned
    .map((id) => QUEST_BY_ID[id])
    .filter(Boolean) as QuestDef[];

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="grid grid-cols-3 gap-1.5">
        {(["daily", "weekly", "special"] as QuestKind[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={
              "rounded-lg border px-2 py-1.5 text-[11px] font-extrabold uppercase tracking-widest transition " +
              (tab === k
                ? "border-amber-500/60 bg-amber-500/15 text-amber-200"
                : "border-zinc-800 bg-zinc-900/50 text-zinc-400 active:bg-zinc-900")
            }
          >
            {k}
          </button>
        ))}
      </div>

      {tab === "daily" && (
        <>
          <RefreshChip
            label="Refreshes"
            timeLeft={Math.max(0, profile.quests.dailyRefreshAt - now)}
          />
          <QuestList
            quests={dailyDefs}
            profile={profile}
            now={now}
            onClaim={onClaim}
          />
        </>
      )}
      {tab === "weekly" && (
        <>
          <RefreshChip
            label="Refreshes"
            timeLeft={Math.max(0, profile.quests.weeklyRefreshAt - now)}
          />
          <QuestList
            quests={weeklyDefs}
            profile={profile}
            now={now}
            onClaim={onClaim}
          />
        </>
      )}
      {tab === "special" && (
        <>
          <div className="rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/5 p-3 text-[11px] text-fuchsia-200">
            Special quests are persistent and reward exclusive pets that you
            cannot get any other way.
          </div>
          <QuestList
            quests={SPECIAL_QUESTS}
            profile={profile}
            now={now}
            onClaim={onClaim}
            showHowTo
          />
        </>
      )}
    </div>
  );
}

function RefreshChip({ label, timeLeft }: { label: string; timeLeft: number }) {
  return (
    <div className="flex items-center justify-end text-[10px] text-zinc-500">
      <span>
        {label}: <span className="text-zinc-300">{formatTimeLeft(timeLeft)}</span>
      </span>
    </div>
  );
}

function QuestList({
  quests,
  profile,
  now,
  onClaim,
  showHowTo,
}: {
  quests: QuestDef[];
  profile: Profile;
  now: number;
  onClaim: (id: string) => void;
  showHowTo?: boolean;
}) {
  void now;
  return (
    <div className="flex flex-col gap-2">
      {quests.map((q) => {
        const prog = q.progress(profile);
        const pct = Math.min(100, (prog / q.target) * 100);
        const claimed =
          q.kind === "daily"
            ? !!profile.quests.dailyClaimed[q.id]
            : q.kind === "weekly"
              ? !!profile.quests.weeklyClaimed[q.id]
              : !!profile.achievements[`special-${q.id}`];
        const ready = prog >= q.target && !claimed;
        const rewardPet = q.reward.petId ? PET_BY_ID[q.reward.petId] : null;
        return (
          <div
            key={q.id}
            className={
              "rounded-xl border bg-zinc-950/60 p-3 " +
              (claimed
                ? "border-emerald-500/30 opacity-70"
                : ready
                  ? "border-amber-500/50"
                  : "border-zinc-800")
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-extrabold text-zinc-100">
                    {q.name}
                  </span>
                  {claimed && (
                    <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                      CLAIMED
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-400">{q.description}</div>
                {showHowTo && q.howTo && (
                  <div className="mt-1 rounded-md bg-zinc-900/60 px-2 py-1 text-[10px] text-zinc-400">
                    <span className="font-extrabold text-zinc-300">
                      How to obtain:{" "}
                    </span>
                    {q.howTo}
                  </div>
                )}
              </div>
              {rewardPet && (
                <div className="shrink-0">
                  <PetArt art={rewardPet.art} size={36} dim={!ready} />
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
              <span>
                {Math.min(prog, q.target).toLocaleString()} /{" "}
                {q.target.toLocaleString()}
              </span>
              <RewardLine reward={q.reward} />
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={
                  "h-full transition-all " +
                  (claimed
                    ? "bg-emerald-500/70"
                    : ready
                      ? "bg-amber-400"
                      : "bg-zinc-600")
                }
                style={{ width: pct + "%" }}
              />
            </div>
            <button
              onClick={() => onClaim(q.id)}
              disabled={!ready}
              className={
                "mt-2 w-full rounded-md px-2 py-1.5 text-[11px] font-extrabold " +
                (ready
                  ? "bg-amber-500 text-zinc-950 active:bg-amber-600"
                  : "bg-zinc-800 text-zinc-500")
              }
            >
              {claimed ? "✓ Claimed" : ready ? "Claim reward" : "In progress"}
            </button>
          </div>
        );
      })}
      {quests.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-center text-xs text-zinc-500">
          No quests right now.
        </div>
      )}
    </div>
  );
}

function RewardLine({
  reward,
}: {
  reward: { coins: number; xp: number; gems: number; petId?: string };
}) {
  const parts: string[] = [];
  if (reward.coins) parts.push(`${formatNumber(reward.coins)}◎`);
  if (reward.gems) parts.push(`${formatNumber(reward.gems)}✦`);
  if (reward.xp) parts.push(`${formatNumber(reward.xp)} XP`);
  if (reward.petId) parts.push("PET");
  return (
    <span className="text-zinc-300">
      {parts.join(" · ") || "—"}
    </span>
  );
}

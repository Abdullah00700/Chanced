import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { PET_BY_ID } from "../lib/pets";
import type { Profile } from "../lib/types";

const API_BASE = `${import.meta.env.BASE_URL}api`;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as any).error ?? `HTTP ${res.status}`);
  return body as T;
}

type PendingGift = {
  id: number;
  from: string;
  type: string;
  petId: string | null;
  coinsAmount: number | null;
  sentAt: number;
};

type GiftSendMode = "coins" | "pet";

export function FriendsModal({
  profile,
  onClose,
  onClaimedGift,
}: {
  profile: Profile;
  onClose: () => void;
  onClaimedGift: (type: string, petId: string | null, coins: number | null) => void;
}) {
  const [tab, setTab] = useState<"friends" | "gifts">("friends");
  const [friends, setFriends] = useState<string[]>([]);
  const [pending, setPending] = useState<PendingGift[]>([]);
  const [addInput, setAddInput] = useState("");
  const [addErr, setAddErr] = useState<string | null>(null);
  const [addBusy, setAddBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const [giftTarget, setGiftTarget] = useState<string | null>(null);
  const [giftMode, setGiftMode] = useState<GiftSendMode>("coins");
  const [giftCoins, setGiftCoins] = useState("500");
  const [giftPetId, setGiftPetId] = useState("");
  const [giftBusy, setGiftBusy] = useState(false);
  const [giftErr, setGiftErr] = useState<string | null>(null);
  const [giftSuccess, setGiftSuccess] = useState<string | null>(null);

  const ownedPetIds = Object.keys(profile.pets).filter((id) => PET_BY_ID[id]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [fr, gi] = await Promise.all([
        apiFetch<{ friends: string[] }>(
          `/friends?username=${encodeURIComponent(profile.username)}&passwordHash=${encodeURIComponent(profile.passwordHash)}`,
        ),
        apiFetch<{ gifts: PendingGift[] }>(
          `/gifts/pending?username=${encodeURIComponent(profile.username)}&passwordHash=${encodeURIComponent(profile.passwordHash)}`,
        ),
      ]);
      setFriends(fr.friends);
      setPending(gi.gifts);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }

  async function addFriend() {
    const name = addInput.trim();
    if (!name) return;
    setAddErr(null);
    setAddBusy(true);
    try {
      await apiFetch("/friends/add", {
        method: "POST",
        body: JSON.stringify({ username: profile.username, passwordHash: profile.passwordHash, friendUsername: name }),
      });
      setAddInput("");
      await loadAll();
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === "user not found") setAddErr("That username doesn't exist.");
      else if (msg === "already friends") setAddErr("Already friends!");
      else setAddErr("Couldn't add friend. Try again.");
    } finally {
      setAddBusy(false);
    }
  }

  async function removeFriend(name: string) {
    try {
      await apiFetch("/friends/remove", {
        method: "DELETE",
        body: JSON.stringify({ username: profile.username, passwordHash: profile.passwordHash, friendUsername: name }),
      });
      setFriends((f) => f.filter((x) => x !== name));
    } catch {
      // ignore
    }
  }

  async function sendGift() {
    if (!giftTarget) return;
    setGiftErr(null);
    setGiftBusy(true);
    try {
      const coins = parseInt(giftCoins, 10);
      if (giftMode === "coins") {
        if (isNaN(coins) || coins < 1 || coins > profile.coins) {
          setGiftErr("Invalid coin amount.");
          return;
        }
        await apiFetch("/gifts/send", {
          method: "POST",
          body: JSON.stringify({
            username: profile.username,
            passwordHash: profile.passwordHash,
            toUsername: giftTarget,
            type: "coins",
            coinsAmount: coins,
          }),
        });
        setGiftSuccess(`Sent ${coins.toLocaleString()} coins to ${giftTarget}!`);
        onClaimedGift("sent-coins", null, coins);
      } else {
        if (!giftPetId) {
          setGiftErr("Select a pet to gift.");
          return;
        }
        await apiFetch("/gifts/send", {
          method: "POST",
          body: JSON.stringify({
            username: profile.username,
            passwordHash: profile.passwordHash,
            toUsername: giftTarget,
            type: "pet",
            petId: giftPetId,
          }),
        });
        const def = PET_BY_ID[giftPetId];
        setGiftSuccess(`Sent ${def?.name ?? giftPetId} to ${giftTarget}!`);
        onClaimedGift("sent-pet", giftPetId, null);
      }
      setGiftTarget(null);
    } catch (e) {
      const msg = (e as Error).message;
      setGiftErr(msg === "not friends" ? "You're not friends with this player." : "Failed to send. Try again.");
    } finally {
      setGiftBusy(false);
    }
  }

  async function claimGift(gift: PendingGift) {
    setClaimingId(gift.id);
    try {
      const r = await apiFetch<{ ok: boolean; type: string; petId: string | null; coinsAmount: number | null }>(
        `/gifts/claim/${gift.id}`,
        {
          method: "POST",
          body: JSON.stringify({ username: profile.username, passwordHash: profile.passwordHash }),
        },
      );
      onClaimedGift(r.type, r.petId, r.coinsAmount);
      setPending((p) => p.filter((g) => g.id !== gift.id));
    } catch {
      // ignore
    } finally {
      setClaimingId(null);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-amber-300 font-bold">
            FRIENDS
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/40 p-0.5 text-xs font-bold">
          {(["friends", "gifts"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "flex-1 rounded-md px-2 py-1.5 transition capitalize " +
                (tab === t ? "bg-amber-500 text-zinc-950" : "text-zinc-400")
              }
            >
              {t === "gifts" && pending.length > 0
                ? `Gifts (${pending.length})`
                : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Gift success toast */}
        {giftSuccess && (
          <div className="rounded-md border border-emerald-700/40 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300">
            {giftSuccess}
          </div>
        )}

        {/* ---- Friends Tab ---- */}
        {tab === "friends" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={addInput}
                onChange={(e) => setAddInput(e.target.value)}
                placeholder="Add friend by username"
                className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500"
                onKeyDown={(e) => { if (e.key === "Enter") addFriend(); }}
              />
              <button
                onClick={addFriend}
                disabled={addBusy}
                className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-bold text-zinc-950 disabled:opacity-60"
              >
                {addBusy ? "…" : "Add"}
              </button>
            </div>
            {addErr && <div className="text-[11px] text-rose-400">{addErr}</div>}

            {loading ? (
              <div className="py-4 text-center text-xs text-zinc-500">Loading…</div>
            ) : friends.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-500">
                No friends yet. Add one above!
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
                {friends.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2"
                  >
                    <span className="text-sm font-bold text-zinc-100">{f}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => { setGiftTarget(f); setGiftErr(null); setGiftSuccess(null); setGiftMode("coins"); }}
                        className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-300"
                      >
                        🎁 Gift
                      </button>
                      <button
                        onClick={() => removeFriend(f)}
                        className="rounded-md border border-zinc-700 bg-zinc-900/60 px-2 py-1 text-[11px] text-zinc-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Gift picker */}
            {giftTarget && (
              <div className="rounded-xl border border-amber-500/30 bg-zinc-900/60 p-3 flex flex-col gap-2">
                <div className="text-xs font-bold text-amber-200">Gift to {giftTarget}</div>
                <div className="flex gap-1.5 text-[11px] font-bold">
                  {(["coins", "pet"] as GiftSendMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setGiftMode(m)}
                      className={
                        "flex-1 rounded-md border py-1 capitalize transition " +
                        (giftMode === m
                          ? "border-amber-500 bg-amber-500/20 text-amber-200"
                          : "border-zinc-700 text-zinc-400")
                      }
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {giftMode === "coins" ? (
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      min={1}
                      max={profile.coins}
                      value={giftCoins}
                      onChange={(e) => setGiftCoins(e.target.value)}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-amber-500"
                    />
                    <div className="text-[10px] text-zinc-500">
                      You have {profile.coins.toLocaleString()} coins
                    </div>
                  </div>
                ) : (
                  <select
                    value={giftPetId}
                    onChange={(e) => setGiftPetId(e.target.value)}
                    className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-amber-500"
                  >
                    <option value="">Select a pet…</option>
                    {ownedPetIds.map((id) => (
                      <option key={id} value={id}>
                        {PET_BY_ID[id]?.name ?? id} (Lv {profile.pets[id]?.level ?? 1})
                      </option>
                    ))}
                  </select>
                )}
                {giftErr && <div className="text-[11px] text-rose-400">{giftErr}</div>}
                <div className="flex gap-1.5">
                  <button
                    onClick={sendGift}
                    disabled={giftBusy}
                    className="flex-1 rounded-md bg-amber-500 py-1.5 text-xs font-bold text-zinc-950 disabled:opacity-60"
                  >
                    {giftBusy ? "Sending…" : "Send Gift"}
                  </button>
                  <button
                    onClick={() => setGiftTarget(null)}
                    className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- Gifts Tab ---- */}
        {tab === "gifts" && (
          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="py-4 text-center text-xs text-zinc-500">Loading…</div>
            ) : pending.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-500">
                No pending gifts. Ask a friend to send you one!
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                {pending.map((gift) => {
                  const def = gift.petId ? PET_BY_ID[gift.petId] : null;
                  return (
                    <div
                      key={gift.id}
                      className="flex items-center justify-between rounded-lg border border-emerald-800/40 bg-emerald-950/20 px-3 py-2 gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-zinc-100">
                          {gift.type === "coins"
                            ? `🪙 ${(gift.coinsAmount ?? 0).toLocaleString()} coins`
                            : `✦ ${def?.name ?? gift.petId}`}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          From {gift.from}
                        </div>
                      </div>
                      <button
                        onClick={() => claimGift(gift)}
                        disabled={claimingId === gift.id}
                        className="shrink-0 rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-60"
                      >
                        {claimingId === gift.id ? "…" : "Claim"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

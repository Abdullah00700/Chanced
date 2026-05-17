import { Router, type IRouter } from "express";
import { db, accountsTable, giftsTable, friendsTable } from "@workspace/db";
import { and, eq, isNull, or } from "drizzle-orm";

const router: IRouter = Router();

async function getAccount(username: string) {
  const rows = await db.select().from(accountsTable).where(eq(accountsTable.username, username));
  return rows[0] ?? null;
}

async function authenticate(username: string, passwordHash: string): Promise<boolean> {
  if (typeof username !== "string" || typeof passwordHash !== "string") return false;
  const acc = await getAccount(username.toLowerCase());
  return acc?.passwordHash === passwordHash;
}

async function areFriends(a: string, b: string): Promise<boolean> {
  const rows = await db.select().from(friendsTable).where(
    or(
      and(eq(friendsTable.username, a), eq(friendsTable.friendUsername, b)),
      and(eq(friendsTable.username, b), eq(friendsTable.friendUsername, a)),
    ),
  );
  return rows.length > 0;
}

router.post("/gifts/send", async (req, res) => {
  const { username, passwordHash, toUsername, type, petId, coinsAmount } = req.body ?? {};
  const fromKey = typeof username === "string" ? username.toLowerCase() : null;
  const toKey = typeof toUsername === "string" ? toUsername.toLowerCase() : null;
  if (!fromKey || !toKey || !type) return res.status(400).json({ error: "invalid input" });
  if (fromKey === toKey) return res.status(400).json({ error: "cannot gift yourself" });

  const senderAcc = await getAccount(fromKey).catch(() => null);
  if (!senderAcc || senderAcc.passwordHash !== passwordHash) {
    return res.status(401).json({ error: "unauthorized" });
  }

  if (!(await areFriends(fromKey, toKey))) {
    return res.status(403).json({ error: "not friends" });
  }

  const senderProfile = senderAcc.profile as Record<string, any>;

  if (type === "coins") {
    if (typeof coinsAmount !== "number" || coinsAmount < 1) {
      return res.status(400).json({ error: "invalid coins amount" });
    }
    const senderCoins: number = typeof senderProfile?.coins === "number" ? senderProfile.coins : 0;
    if (coinsAmount > senderCoins) {
      return res.status(400).json({ error: "insufficient coins" });
    }
  } else if (type === "pet") {
    if (typeof petId !== "string") return res.status(400).json({ error: "invalid pet" });
    const petInst = senderProfile?.pets?.[petId];
    if (!petInst || typeof petInst.level !== "number" || petInst.level < 1) {
      return res.status(400).json({ error: "you don't own that pet" });
    }
  } else {
    return res.status(400).json({ error: "invalid gift type" });
  }

  try {
    await db.insert(giftsTable).values({
      fromUsername: fromKey,
      toUsername: toKey,
      type,
      petId: type === "pet" ? petId : null,
      coinsAmount: type === "coins" ? coinsAmount : null,
    });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "server error" });
  }
});

router.get("/gifts/pending", async (req, res) => {
  const { username, passwordHash } = req.query as Record<string, string>;
  const key = username?.toLowerCase?.();
  if (!key || !(await authenticate(key, passwordHash))) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const rows = await db.select().from(giftsTable).where(
      and(eq(giftsTable.toUsername, key), isNull(giftsTable.claimedAt)),
    );
    return res.json({
      gifts: rows.map((r) => ({
        id: r.id,
        from: r.fromUsername,
        type: r.type,
        petId: r.petId,
        coinsAmount: r.coinsAmount,
        sentAt: r.sentAt.getTime(),
      })),
    });
  } catch {
    return res.status(500).json({ error: "server error" });
  }
});

router.post("/gifts/claim/:id", async (req, res) => {
  const { username, passwordHash } = req.body ?? {};
  const giftId = parseInt(req.params["id"] ?? "", 10);
  const key = typeof username === "string" ? username.toLowerCase() : null;
  if (!key || isNaN(giftId)) return res.status(400).json({ error: "invalid input" });
  if (!(await authenticate(key, passwordHash))) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const rows = await db.select().from(giftsTable).where(
      and(eq(giftsTable.id, giftId), eq(giftsTable.toUsername, key), isNull(giftsTable.claimedAt)),
    );
    const gift = rows[0];
    if (!gift) return res.status(404).json({ error: "gift not found" });
    await db.update(giftsTable).set({ claimedAt: new Date() }).where(eq(giftsTable.id, giftId));
    return res.json({
      ok: true,
      type: gift.type,
      petId: gift.petId,
      coinsAmount: gift.coinsAmount,
    });
  } catch {
    return res.status(500).json({ error: "server error" });
  }
});

export default router;

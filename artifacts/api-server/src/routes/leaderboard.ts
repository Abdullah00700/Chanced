import { Router, type IRouter } from "express";
import { db, accountsTable, leaderboardTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";

const router: IRouter = Router();

const ALLOWED_RARITY = new Set([
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "unobtainable",
]);

router.get("/leaderboard", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(leaderboardTable)
      .orderBy(asc(leaderboardTable.prob))
      .limit(50);
    return res.json({
      entries: rows.map((r) => ({
        username: r.displayName,
        number: r.number,
        prob: r.prob,
        rarity: r.rarity,
        level: r.level,
        timestamp: r.ts.getTime(),
      })),
    });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
});

router.post("/leaderboard/submit", async (req, res) => {
  const { username, passwordHash, entry } = req.body ?? {};
  if (
    typeof username !== "string" ||
    typeof passwordHash !== "string" ||
    !entry ||
    typeof entry !== "object"
  ) {
    return res.status(400).json({ error: "invalid input" });
  }
  const key = username.toLowerCase();
  const { number, prob, rarity, level } = entry as Record<string, unknown>;
  if (
    typeof number !== "number" ||
    typeof prob !== "number" ||
    typeof rarity !== "string" ||
    typeof level !== "number" ||
    !ALLOWED_RARITY.has(rarity)
  ) {
    return res.status(400).json({ error: "invalid entry" });
  }
  try {
    const accs = await db.select().from(accountsTable).where(eq(accountsTable.username, key));
    const acc = accs[0];
    if (!acc || acc.passwordHash !== passwordHash) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const existing = await db
      .select()
      .from(leaderboardTable)
      .where(eq(leaderboardTable.username, key));
    const cur = existing[0];
    const safeNumber = Math.max(0, Math.min(10000, Math.floor(number)));
    const safeProb = Math.max(0, Math.min(1, prob));
    const safeLevel = Math.max(1, Math.floor(level));
    if (cur && cur.prob <= safeProb && cur.level >= safeLevel) {
      return res.json({ ok: true, kept: true });
    }
    const display = (acc.profile as { username?: string })?.username ?? username;
    if (cur) {
      await db
        .update(leaderboardTable)
        .set({
          displayName: display,
          number: safeNumber,
          prob: safeProb,
          rarity,
          level: safeLevel,
          ts: new Date(),
        })
        .where(eq(leaderboardTable.username, key));
    } else {
      await db.insert(leaderboardTable).values({
        username: key,
        displayName: display,
        number: safeNumber,
        prob: safeProb,
        rarity,
        level: safeLevel,
      });
    }
    return res.json({ ok: true, kept: false });
  } catch (e) {
    req.log.error({ err: e }, "submit failed");
    return res.status(500).json({ error: "server error" });
  }
});

export default router;

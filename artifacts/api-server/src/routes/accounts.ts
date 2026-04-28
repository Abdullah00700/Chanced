import { Router, type IRouter } from "express";
import { db, accountsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function isUsername(s: unknown): s is string {
  return typeof s === "string" && /^[\w-]{2,16}$/.test(s);
}
function isHash(s: unknown): s is string {
  return typeof s === "string" && /^[a-f0-9]{64}$/i.test(s);
}

router.post("/accounts/signup", async (req, res) => {
  const { username, passwordHash, profile } = req.body ?? {};
  if (!isUsername(username) || !isHash(passwordHash) || typeof profile !== "object" || profile == null) {
    return res.status(400).json({ error: "invalid input" });
  }
  const key = (username as string).toLowerCase();
  try {
    const existing = await db.select().from(accountsTable).where(eq(accountsTable.username, key));
    if (existing.length > 0) {
      return res.status(409).json({ error: "username taken" });
    }
    await db.insert(accountsTable).values({
      username: key,
      passwordHash,
      profile,
    });
    return res.json({ ok: true, profile });
  } catch (e) {
    req.log.error({ err: e }, "signup failed");
    return res.status(500).json({ error: "server error" });
  }
});

router.post("/accounts/login", async (req, res) => {
  const { username, passwordHash } = req.body ?? {};
  if (typeof username !== "string" || !isHash(passwordHash)) {
    return res.status(400).json({ error: "invalid input" });
  }
  const key = username.toLowerCase();
  try {
    const rows = await db.select().from(accountsTable).where(eq(accountsTable.username, key));
    const row = rows[0];
    if (!row) return res.status(404).json({ error: "no account" });
    if (row.passwordHash !== passwordHash) {
      return res.status(401).json({ error: "wrong password" });
    }
    return res.json({ ok: true, profile: row.profile });
  } catch (e) {
    req.log.error({ err: e }, "login failed");
    return res.status(500).json({ error: "server error" });
  }
});

router.put("/accounts/sync", async (req, res) => {
  const { username, passwordHash, profile } = req.body ?? {};
  if (typeof username !== "string" || !isHash(passwordHash) || typeof profile !== "object" || profile == null) {
    return res.status(400).json({ error: "invalid input" });
  }
  const key = username.toLowerCase();
  try {
    const rows = await db.select().from(accountsTable).where(eq(accountsTable.username, key));
    const row = rows[0];
    if (!row) return res.status(404).json({ error: "no account" });
    if (row.passwordHash !== passwordHash) {
      return res.status(401).json({ error: "wrong password" });
    }
    await db
      .update(accountsTable)
      .set({ profile, updatedAt: new Date() })
      .where(eq(accountsTable.username, key));
    return res.json({ ok: true });
  } catch (e) {
    req.log.error({ err: e }, "sync failed");
    return res.status(500).json({ error: "server error" });
  }
});

export default router;

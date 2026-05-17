import { Router, type IRouter } from "express";
import { db, accountsTable, friendsTable } from "@workspace/db";
import { and, eq, or } from "drizzle-orm";

const router: IRouter = Router();

async function authenticate(username: string, passwordHash: string): Promise<boolean> {
  if (typeof username !== "string" || typeof passwordHash !== "string") return false;
  const rows = await db.select().from(accountsTable).where(eq(accountsTable.username, username.toLowerCase()));
  return rows[0]?.passwordHash === passwordHash;
}

router.get("/friends", async (req, res) => {
  const { username, passwordHash } = req.query as Record<string, string>;
  const key = username?.toLowerCase?.();
  if (!key || !(await authenticate(key, passwordHash))) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const rows = await db.select().from(friendsTable).where(
      or(eq(friendsTable.username, key), eq(friendsTable.friendUsername, key)),
    );
    const friends = rows.map((r) => (r.username === key ? r.friendUsername : r.username));
    return res.json({ friends });
  } catch {
    return res.status(500).json({ error: "server error" });
  }
});

router.post("/friends/add", async (req, res) => {
  const { username, passwordHash, friendUsername } = req.body ?? {};
  const key = username?.toLowerCase?.();
  const friendKey = typeof friendUsername === "string" ? friendUsername.toLowerCase() : null;
  if (!key || !friendKey || key === friendKey) {
    return res.status(400).json({ error: "invalid input" });
  }
  if (!(await authenticate(key, passwordHash))) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const friendAcc = await db.select().from(accountsTable).where(eq(accountsTable.username, friendKey));
    if (!friendAcc[0]) return res.status(404).json({ error: "user not found" });
    const existing = await db.select().from(friendsTable).where(
      or(
        and(eq(friendsTable.username, key), eq(friendsTable.friendUsername, friendKey)),
        and(eq(friendsTable.username, friendKey), eq(friendsTable.friendUsername, key)),
      ),
    );
    if (existing.length > 0) return res.status(409).json({ error: "already friends" });
    await db.insert(friendsTable).values({ username: key, friendUsername: friendKey });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "server error" });
  }
});

router.delete("/friends/remove", async (req, res) => {
  const { username, passwordHash, friendUsername } = req.body ?? {};
  const key = username?.toLowerCase?.();
  const friendKey = typeof friendUsername === "string" ? friendUsername.toLowerCase() : null;
  if (!key || !friendKey) return res.status(400).json({ error: "invalid input" });
  if (!(await authenticate(key, passwordHash))) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    await db.delete(friendsTable).where(
      or(
        and(eq(friendsTable.username, key), eq(friendsTable.friendUsername, friendKey)),
        and(eq(friendsTable.username, friendKey), eq(friendsTable.friendUsername, key)),
      ),
    );
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "server error" });
  }
});

export default router;

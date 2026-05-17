import { Router, type IRouter } from "express";
import accountsRouter from "./accounts";
import friendsRouter from "./friends";
import giftsRouter from "./gifts";
import healthRouter from "./health";
import leaderboardRouter from "./leaderboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(accountsRouter);
router.use(leaderboardRouter);
router.use(friendsRouter);
router.use(giftsRouter);

export default router;

import express, { Request, Response } from "express";
import { getNextCronTime } from "../services/cronService.js";

const router = express.Router();

// Get next cron execution time
router.get("/next-cron-time", (_req: Request, res: Response) => {
  const cronInfo = getNextCronTime();

  if (!cronInfo) {
    return res.status(404).json({ error: "Next cron time not set" });
  }

  res.json(cronInfo);
});

export default router;

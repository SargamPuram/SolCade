import express, { Request, Response } from "express";
import Gameplay from "../models/Gameplay.js";

const router = express.Router();

// Public leaderboard without user-specific details
router.get("/:gameId/:potId", async (req: Request, res: Response) => {
  try {
    const { gameId, potId } = req.params;

    const leaderboard = await Gameplay.find({
      gameId,
      potId,
      score: { $gt: 0 },
    })
      .sort({ score: -1, timestamp: 1 })
      .populate({ path: "userId", select: "-__v" })
      .select("-gameId -potId -txhash -__v");

    const totalGamesPlayed = await Gameplay.countDocuments({ gameId, potId });
    const uniquePlayers = await Gameplay.distinct("userId", { gameId, potId });

    res.json({
      leaderboard,
      totalGamesPlayed,
      uniquePlayers: uniquePlayers.length,
    });
  } catch (error: any) {
    console.error("Error fetching public leaderboard:", error);
    res.status(500).json({ error: error.message });
  }
});

// Leaderboard with user-specific stats
router.get("/:gameId/:potId/user/:userId", async (req: Request, res: Response) => {
  try {
    const { gameId, potId, userId } = req.params;

    const leaderboard = await Gameplay.find({
      gameId,
      potId,
      score: { $gt: 0 },
    })
      .sort({ score: -1, timestamp: 1 })
      .populate({ path: "userId", select: "-__v" })
      .select("-gameId -potId -txhash -__v");

    const totalGamesPlayed = await Gameplay.countDocuments({
      gameId,
      potId,
      score: { $gt: 0 },
    });

    const uniquePlayers = await Gameplay.distinct("userId", {
      gameId,
      potId,
      score: { $gt: 0 },
    });

    const userPlayCount = await Gameplay.countDocuments({
      gameId,
      potId,
      userId,
      score: { $gt: 0 },
    });

    res.json({
      leaderboard,
      totalGamesPlayed,
      uniquePlayers: uniquePlayers.length,
      userPlayCount,
    });
  } catch (error: any) {
    console.error("Error fetching personalized leaderboard:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

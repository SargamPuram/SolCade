import express, { Request, Response } from "express";
import User from "../models/User.js";
import Gameplay from "../models/Gameplay.js";

const router = express.Router();

// Check if user exists or create new user
router.get("/existOrCreate/:publicKey", async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params;
    const user = await User.findOne({ publicKey });

    if (!user) {
      const newUser = new User({ publicKey });
      await newUser.save();

      return res.status(200).json({
        exists: false,
        status: "success",
        userId: newUser._id,
        message: "New user created successfully",
      });
    }

    return res.status(200).json({
      exists: true,
      status: "success",
      message: "User already exists",
      userId: user._id,
    });
  } catch (error: any) {
    console.error("Error in existOrCreate:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check if user has played a specific game/pot
router.get("/:userId/isPlayed/:gameId/:potId", async (req: Request, res: Response) => {
  try {
    const { userId, gameId, potId } = req.params;

    const mostRecent = await Gameplay.findOne({ userId, gameId, potId })
      .sort({ timestamp: -1 })
      .populate("txhash");

    res.json({ latestGameplay: mostRecent });
  } catch (err: any) {
    console.error("Error fetching gameplay:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

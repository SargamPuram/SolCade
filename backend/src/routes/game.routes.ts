import express, { Request, Response } from "express";
import Game from "../models/Games.js";

const router = express.Router();

// Get all games
router.get("/all", async (_req: Request, res: Response) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error: any) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new game
router.post("/add", async (req: Request, res: Response) => {
  try {
    const { gameId, description, entryFee, logo, genre, name } = req.body;
    const game = await Game.findOne({ gameId });

    if (!game) {
      const newGame = new Game({
        gameId,
        description,
        entryFee,
        logo,
        genre,
        name,
      });
      await newGame.save();

      return res.json({
        success: true,
        message: "Game added successfully",
        game: newGame,
      });
    }

    return res.json({ success: false, message: "Game already exists" });
  } catch (error: any) {
    console.error("Error adding game:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from "express";
import Game from "../models/Games.js";
const router = express.Router();
// Get all games
router.get("/all", async (_req, res) => {
    try {
        const games = await Game.find();
        res.status(200).json(games);
    }
    catch (error) {
        console.error("Error fetching games:", error);
        res.status(500).json({ error: error.message });
    }
});
// Add a new game
router.post("/add", async (req, res) => {
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
    }
    catch (error) {
        console.error("Error adding game:", error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=game.routes.js.map
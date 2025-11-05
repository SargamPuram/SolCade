import express from "express";
import Gameplay from "../models/Gameplay.js";
import Txhash from "../models/Txhash.js";
const router = express.Router();
// Update score for a gameplay
router.post("/update", async (req, res) => {
    try {
        const { gameId, potId, userId, txhash, score } = req.body;
        const gameplays = await Gameplay.find({
            gameId,
            potId,
            userId,
            txhash,
        });
        if (gameplays.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No gameplay found with the given parameters",
            });
        }
        if (gameplays.length > 1) {
            return res.status(409).json({
                success: false,
                message: "Multiple gameplays found — possible data inconsistency",
            });
        }
        const gameplay = gameplays[0];
        gameplay.score = score;
        await gameplay.save();
        // Update isPlayed in Txhash
        const txhashDoc = await Txhash.findById(txhash);
        if (txhashDoc) {
            txhashDoc.isPlayed = true;
            await txhashDoc.save();
        }
        else {
            return res.status(404).json({
                success: false,
                message: "Associated txhash not found",
            });
        }
        res.json({
            success: true,
            message: "Score updated and isPlayed marked true",
            updated: {
                gameplay,
                txhash: txhashDoc,
            },
        });
    }
    catch (error) {
        console.error("Error updating score:", error);
        res.status(500).json({ error: error.message });
    }
});
// Get all gameplays for a game/pot
router.get("/:gameId/:potId", async (req, res) => {
    try {
        const { gameId, potId } = req.params;
        const gameplays = await Gameplay.find({ gameId, potId }).populate("userId txhash");
        res.json(gameplays);
    }
    catch (error) {
        console.error("Error fetching gameplays:", error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=gameplay.routes.js.map
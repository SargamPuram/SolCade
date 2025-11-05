import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { wallet } from "./config/solana.js";
import { initializeCronJobs } from "./services/cronService.js";
import potService from "./services/potService.js";
// Import routes
import userRoutes from "./routes/user.routes.js";
import gameRoutes from "./routes/game.routes.js";
import potRoutes from "./routes/pot.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import gameplayRoutes from "./routes/gameplay.routes.js";
import cronRoutes from "./routes/cron.routes.js";
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors({
    origin: "*",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Health check
app.get("/ping", (_req, res) => {
    return res.json({ message: "pong" });
});
// Mount routes
app.use("/user", userRoutes);
app.use("/games", gameRoutes);
app.use("/pot", potRoutes);
app.use("/pots", potRoutes); // Alternative path
app.use("/leaderboard", leaderboardRoutes);
app.use("/gameplays", gameplayRoutes);
app.use("/score", gameplayRoutes);
app.use("/api", cronRoutes);
// Start server
app.listen(PORT, () => {
    // Connect to database
    connectDB();
    console.log(`Server running on port ${PORT}`);
    console.log(`Wallet public key: ${wallet.publicKey.toString()}`);
    console.log(`Connected to Solana devnet: https://api.devnet.solana.com`);
    // Game configuration
    const games = [
        {
            objectId: "68210f89681811dd521231f4", // Flappy Bird
            gameId: "flappy_bird",
        },
        {
            objectId: "6821cb510d3f7c6aef6e0a17", // Pacman
            gameId: "pacman",
        },
    ];
    // Initialize cron jobs
    initializeCronJobs(games, potService);
});
//# sourceMappingURL=server.js.map
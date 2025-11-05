import cron from "node-cron";
import GamePot from "../models/GamePot.js";
import Gameplay from "../models/Gameplay.js";
import { GameConfig, CronTimeInfo } from "../types/index.js";
import PotService from "./potService.js";
import { wallet, program } from "../config/solana.js";

// ==========================================
// CRON CONFIGURATION - SINGLE SOURCE OF TRUTH
// ==========================================
// Change this value to update both the cron schedule and time calculations
const CRON_INTERVAL_MINUTES = 15; // Minutes between cron executions

// Generate cron expression from interval
const CRON_EXPRESSION = `*/${CRON_INTERVAL_MINUTES} * * * *`;

console.log(
  `📅 Cron configured to run every ${CRON_INTERVAL_MINUTES} minutes & ${CRON_EXPRESSION}`
);
// ==========================================

// Track next cron execution time
let nextCronTime: Date | null = null;

// Calculate next cron time based on CRON_INTERVAL_MINUTES
const calculateNextCronTime = (): Date => {
  const now = new Date();
  const next = new Date(now);

  // Get current minutes
  const currentMinutes = next.getMinutes();

  // Calculate next interval mark using CRON_INTERVAL_MINUTES
  // For example: if interval is 15, marks are at 0, 15, 30, 45
  // if interval is 2, marks are at 0, 2, 4, 6, 8, ...
  const nextMark =
    Math.floor(currentMinutes / CRON_INTERVAL_MINUTES) * CRON_INTERVAL_MINUTES +
    CRON_INTERVAL_MINUTES;

  if (nextMark >= 60) {
    // If next mark is 60+, move to next hour at :00 (or appropriate starting mark)
    next.setHours(next.getHours() + 1);
    next.setMinutes(nextMark - 60);
  } else {
    // Otherwise set to the next interval mark
    next.setMinutes(nextMark);
  }

  next.setSeconds(0);
  next.setMilliseconds(0);

  return next;
};

// Format time remaining
export const formatTimeRemaining = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Get next cron time
export const getNextCronTime = (): CronTimeInfo | null => {
  if (!nextCronTime) {
    return null;
  }

  const now = new Date();
  const timeRemaining = nextCronTime.getTime() - now.getTime();

  if (timeRemaining <= 0) {
    return {
      timeRemaining: 0,
      nextCronTime: nextCronTime.toISOString(),
      message: "Cron job executing now or scheduled time has passed",
    };
  }

  return {
    timeRemaining: timeRemaining,
    nextCronTime: nextCronTime.toISOString(),
    seconds: Math.floor(timeRemaining / 1000),
    formatted: formatTimeRemaining(timeRemaining),
  };
};

// Improved game cron handler with direct database access
const handleGameCron = async (
  gameObjectId: string,
  gameId: string,
  potService: typeof PotService
): Promise<void> => {
  console.log(`\n=== Starting cron for ${gameId} ===`);

  let potNumber: number;
  let potId: string;
  let potPublicKey: string;
  let result: string[];

  try {
    // 1. Fetch latest active pot directly from DB
    const latestPot = await GamePot.findOne({
      gameId: gameObjectId,
      status: "Active",
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestPot) {
      console.log(
        `No active pot found for ${gameId}, initializing first pot...`
      );
      await potService.initializePot(gameObjectId, gameId, 1);
      return;
    }

    potNumber = latestPot.potNumber;
    potId = latestPot._id.toString();
    potPublicKey = latestPot.potPublicKey;
    console.log(`Processing pot #${potNumber} for ${gameId}`);
  } catch (err: any) {
    console.error(`Error fetching latest pot for ${gameId}:`, err.message);
    return;
  }

  try {
    // 2. Fetch leaderboard directly from DB
    const leaderboard = await Gameplay.find({
      gameId: gameObjectId,
      potId: potId,
      score: { $gt: 0 },
    })
      .sort({ score: -1, timestamp: 1 })
      .populate({ path: "userId", select: "publicKey" })
      .limit(5)
      .lean();

    result = leaderboard
      .map((entry: any) => entry.userId?.publicKey)
      .filter(Boolean);

    // Fill with default public key if less than 5 winners
    const defaultPubkey =
      process.env.DEFAULT_PUBLIC_KEY || wallet.publicKey.toString();
    console.log(`Using default pubkey for missing winners: ${defaultPubkey}`);

    while (result.length < 5) {
      result.push(defaultPubkey);
    }

    console.log(`Top 5 winners for ${gameId}:`, result);
  } catch (err: any) {
    console.error(`Error fetching leaderboard for ${gameId}:`, err.message);
    return;
  }

  try {
    // 3. Close pot using the service
    await potService.closePot(gameObjectId, potPublicKey);
    console.log(`✅ Pot #${potNumber} closed for ${gameId}`);
  } catch (err: any) {
    console.error(`Error closing pot for ${gameId}:`, err.message);
    return;
  }

  try {
    // 4. Wait and confirm pot is closed ON-CHAIN (not just DB)
    let retries = 5; // Increased retries
    let confirmed = false;

    while (retries-- > 0 && !confirmed) {
      await new Promise((res) => setTimeout(res, 3000));

      try {
        // Query on-chain status instead of DB
        const potAccount: any = await (program.account as any).gamePot.fetch(
          potPublicKey
        );
        const statusKey = Object.keys(potAccount.status)[0];

        if (statusKey.toLowerCase() === "ended") {
          confirmed = true;
          console.log(
            `✅ Pot #${potNumber} confirmed as ended on-chain for ${gameId}`
          );
        } else {
          console.log(
            `⏳ Waiting for pot #${potNumber} to be fully closed on-chain... (status: ${statusKey})`
          );
        }
      } catch (fetchErr: any) {
        console.log(
          `⏳ Retrying pot status check (${retries} retries left)...`
        );
      }
    }

    if (!confirmed) {
      console.error(
        `❌ Pot #${potNumber} not confirmed as closed on-chain for ${gameId}`
      );
      return;
    }
  } catch (err: any) {
    console.error(`Error confirming pot closure for ${gameId}:`, err.message);
    return;
  }

  try {
    // 5. Distribute winners using the service
    if (result && result.length === 5) {
      await potService.distributeWinners(gameObjectId, potPublicKey, result);
      console.log(`✅ Winners paid for ${gameId} pot #${potNumber}`);
    }
  } catch (err: any) {
    console.error(`Error distributing payouts for ${gameId}:`, err.message);
    // Continue to initialize next pot even if distribution fails
  }

  try {
    // 6. Initialize next pot
    const nextPotNumber = potNumber + 1;
    await potService.initializePot(gameObjectId, gameId, nextPotNumber);
    console.log(`✅ Initialized pot #${nextPotNumber} for ${gameId}`);
  } catch (err: any) {
    console.error(`Error initializing next pot for ${gameId}:`, err.message);
  }

  console.log(`=== Completed cron for ${gameId} ===\n`);
};

// Initialize cron jobs
export const initializeCronJobs = (
  games: GameConfig[],
  potService: typeof PotService
): void => {
  console.log("Initializing cron jobs...");

  // Calculate initial next cron time
  nextCronTime = calculateNextCronTime();
  console.log(
    `Next cron execution scheduled for: ${nextCronTime.toISOString()}`
  );

  // Schedule cron job using the configured interval
  cron.schedule(CRON_EXPRESSION, async () => {
    console.log("\n🕐 Cron job triggered at:", new Date().toISOString());

    // Update next cron time
    nextCronTime = calculateNextCronTime();
    console.log(`Next cron execution: ${nextCronTime.toISOString()}`);

    // Process all games in PARALLEL for better performance
    console.log(`Processing ${games.length} games in parallel...`);

    const results = await Promise.allSettled(
      games.map((game) =>
        handleGameCron(game.objectId, game.gameId, potService)
      )
    );

    // Log results
    results.forEach((result, index) => {
      const game = games[index];
      if (result.status === "rejected") {
        console.error(
          `❌ Cron job error for ${game.gameId}:`,
          result.reason?.message || result.reason
        );
      } else {
        console.log(`✅ Cron job completed for ${game.gameId}`);
      }
    });
  });

  console.log("✅ Cron jobs initialized successfully");

  // Optional: Run initialization check on startup (commented out for safety)
  // Uncomment the following to run cron logic immediately on server start
  /*
  setTimeout(async () => {
    console.log("Running startup initialization check...");
    for (const game of games) {
      try {
        await handleGameCron(game.objectId, game.gameId, potService);
      } catch (err: any) {
        console.error(`Startup initialization error for ${game.gameId}:`, err.message);
      }
    }
  }, 5000);
  */
};

import "dotenv/config.js";
import express from "express";
import * as anchor from "@coral-xyz/anchor";
const { BN } = anchor.default;
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Game from "./models/Games.js";
import GamePot from "./models/GamePot.js";
import Gameplay from "./models/Gameplay.js";
import Txhash from "./models/Txhash.js";
import cron from "node-cron";

// import { schedule } from "node-cron";

// Initialize Express app
const app = express();
const PORT = process.env.port || 3001;

app.use(express.json());

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Setup Solana connection on devnet
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Load wallet from your local keypair
// Replace with your actual keypair path
let keypair;
try {
  const walletKey = JSON.parse(fs.readFileSync("./server-wallet.json"));
  keypair = Keypair.fromSecretKey(new Uint8Array(walletKey));
} catch (err) {
  console.error("Error loading wallet:", err);
  process.exit(1);
}

const wallet = new anchor.Wallet(keypair);

const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});

// Use the IDL from your pasted content
const idl = JSON.parse(fs.readFileSync("./arcade_game.json"));

// Program ID from your deployed contract
const programId = new PublicKey("uqF9WXM1GkHE2nKFAPUVX1BSiWys59yzuWZW9GR9Fky");

// Initialize the program
const program = new anchor.Program(idl, provider);

// Helper function to derive PDA for a pot
const getPotPDA = (gameId, potNumber) => {
  const potNumberBN = new BN(parseInt(potNumber));

  const [potPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("pot"),
      Buffer.from(gameId), //ObjectID of game
      potNumberBN.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );

  return potPda;
};

// function formatTimeRemaining(ms) {
//   const seconds = Math.floor(ms / 1000);
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;

//   return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
// }

// // Add this endpoint to your Express app
// app.get("/api/next-cron-time", (req, res) => {
//   if (!nextCronTime) {
//     res.status(404).json({ error: "Next cron time not set" });
//     return;
//   }

//   const now = new Date();
//   const timeRemaining = nextCronTime - now;

//   if (timeRemaining <= 0) {
//     res.json({
//       timeRemaining: 0,
//       nextCronTime: nextCronTime.toISOString(),
//       message: "Cron job executing now or scheduled time has passed",
//     });
//   } else {
//     res.json({
//       timeRemaining: timeRemaining,
//       nextCronTime: nextCronTime.toISOString(),
//       seconds: Math.floor(timeRemaining / 1000),
//       formatted: formatTimeRemaining(timeRemaining),
//     });
//   }
// });

// let nextCronTime = null;

// Function to format time remaining in a human-readable format

app.get("/ping", (req, res) => {
  return res.json({ message: "pong" });
});

app.get("/user/existOrCreate/:publicKey", async (req, res) => {
  const { publicKey } = req.params;
  const user = await User.findOne({ publicKey });
  if (!user) {
    const newUser = new User({ publicKey });
    await newUser.save();
    const json = {
      exists: false,
      status: "success",
      userId: newUser._id,
      message: "New user created successfully",
    };

    res.status(200).json(json);
  } else {
    const json = {
      exists: true,
      status: "success",
      message: "User already exists",
      userId: user._id,
    };

    res.status(200).json(json);
  }
});

app.get("/user/:userId/isPlayed/:gameId/:potId", async (req, res) => {
  //userId - userObjectId (_id);
  //gameId - gameObjectId (_id);
  //potId - potObjectId (_id);

  const { userId, gameId, potId } = req.params;

  try {
    const mostRecent = await Gameplay.findOne({ userId, gameId, potId })
      .sort({ timestamp: -1 }) // get the latest one
      .populate("txhash");

    res.json({ latestGameplay: mostRecent });
  } catch (err) {
    console.error("Error fetching gameplay:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//this will be used to get the current potId for the game with useEffect
app.get("/pot/latest/:gameId", async (req, res) => {
  //only for this we give pacman/flappy_bird as gameId
  try {
    const { gameId } = req.params;

    const gameObjectId = await Game.findOne({ gameId });

    const latestPot = await GamePot.findOne({ gameId: gameObjectId._id })
      .sort({ createdAt: -1 }) // sort by timestamp descending (latest first)
      .exec();

    if (!latestPot) {
      return res.status(404).json({
        success: false,
        message: "No pots found for the given gameId",
      });
    }
    if (latestPot.status === "Ended") {
      return res.status(404).json({
        success: false,
        message: "No ACTIVE pots found for the given gameId",
      });
    }
    res.json({
      success: true,
      pot: latestPot,
    });
    0;
  } catch (error) {
    console.error("Error fetching latest pot:", error);
    res.status(500).json({ error: error.message });
  }
});

//leaderboard logic
// Public leaderboard without user-specific details
app.get("/leaderboard/:gameId/:potId", async (req, res) => {
  //gameId - gameObjectId (_id);
  //potId - potObjectId (_id);
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
  } catch (error) {
    console.error("Error fetching public leaderboard:", error);
    res.status(500).json({ error: error.message });
  }
});
// Leaderboard with user-specific stats
app.get("/leaderboard/:gameId/:potId/user/:userId", async (req, res) => {
  //gameId - gameObjectId (_id);
  //potId - potObjectId (_id);
  //userId - userObjectId (_id);
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
  } catch (error) {
    console.error("Error fetching personalized leaderboard:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get Pot details (balance, status, balance_sol);
app.get("/pot/:gameId/:potPublicKey", async (req, res) => {
  //gameId - gameObjectId (_id);
  //potPublicKey - potPublicKey (string);
  //Sample request: /pot/682a469a89ba63c2685e4f6c/1sjwcUDPTnSdRrLzniGmXoCJfEm2EWYsmc8r1gQYThT
  try {
    const { gameId, potPublicKey } = req.params;

    try {
      // Fetch the pot account data
      const potAccount = await program.account.gamePot.fetch(potPublicKey);

      // Return the pot balance and status
      res.json({
        gameId: potAccount.gameId,
        potAddress: potPublicKey,
        potNumber: potAccount.potNumber.toString(),
        balance: potAccount.totalLamports.toString(),
        status: Object.keys(potAccount.status)[0],
        balanceSol:
          potAccount.totalLamports.toNumber() / anchor.web3.LAMPORTS_PER_SOL,
      });
    } catch (err) {
      if (err.message.includes("Account does not exist")) {
        res.status(404).json({
          error: `Pot not found for game '${gameId}' with pot Public Key ${potPublicKey}`,
          details: "The pot account may not have been initialized yet",
        });
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Error fetching pot status:", error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize a new pot (done by cron job for only once)
app.post("/pot/initialize", async (req, res) => {
  try {
    const { gameId, potNumber } = req.body;
    if (!gameId || !potNumber) {
      return res
        .status(400)
        .json({ error: "gameId and potNumber are required" });
    }

    const gameObjectId = await Game.findOne({ gameId });
    if (!gameObjectId) {
      return res.status(404).json({ error: "Game not found" });
    }

    const potNumberBN = new BN(parseInt(potNumber));
    const potPda = getPotPDA(gameObjectId._id, potNumber);

    let tx; // Declare outside to use later
    try {
      // --- 1. Try to initialize the pot on-chain ---
      tx = await program.methods
        .initializePot(gameObjectId._id, potNumberBN)
        .accounts({
          potAccount: potPda,
          signer: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (err) {
      console.log(err);
      if (err.message.includes("already in use")) {
        return res.status(409).json({
          error: `Pot already exists for game '${gameId}' with pot number ${potNumber}`,
        });
      } else {
        console.error("Failed to initialize pot on-chain:", err);
        return res
          .status(500)
          .json({ error: "Failed to initialize pot on-chain" });
      }
    }

    // --- 2. Try to insert into DB if on-chain was successful ---
    try {
      const newGamePot = new GamePot({
        gameId: gameObjectId._id,
        potNumber,
        potPublicKey: potPda.toString(),
        totalLamports: 0,
        gameplays: [],
        status: "Active",
        createdAt: new Date(),
        closedAt: null,
      });

      await newGamePot.save();

      return res.json({
        success: true,
        message: `Pot initialized for game '${gameId}' with pot number ${potNumber}`,
        transaction: tx,
        potAddress: potPda.toString(),
        potId: newGamePot._id,
      });
    } catch (dbError) {
      console.error(
        "Pot initialized on-chain but failed to save in DB:",
        dbError
      );
      return res.status(500).json({
        error: "Pot initialized on-chain, but failed to save in DB",
        transaction: tx,
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
});
//close the pot when needed
app.post("/pot/close", async (req, res) => {
  const { gameObjectId, potPublicKey } = req.body;

  if (!gameObjectId || !potPublicKey) {
    return res
      .status(400)
      .json({ error: "gameObjectId and potPublicKey are required" });
  }

  const connection = program.provider.connection;
  let txSignature;
  let confirmed = false;

  try {
    // Step 1: Send the transaction
    txSignature = await program.methods
      .closePot()
      .accounts({ potAccount: potPublicKey })
      .rpc();

    console.log("🟢 Transaction sent:", txSignature);

    // Step 2: Confirm using web3 API manually
    const txDetails = await connection.getParsedTransaction(txSignature, {
      commitment: "confirmed",
    });

    if (txDetails?.meta?.err === null) {
      console.log("🟢 Transaction confirmed via getParsedTransaction");
      confirmed = true;
    } else {
      console.error("❌ Transaction failed on-chain:", txDetails?.meta?.err);
    }
  } catch (err) {
    txSignature = err.signature;
    console.error("⚠️ RPC call error:", err.name);

    if (err.name === "TransactionExpiredTimeoutError" && txSignature) {
      console.warn("⏱️ Transaction timed out. Checking status manually...");

      try {
        const txDetails = await connection.getParsedTransaction(txSignature, {
          commitment: "confirmed",
        });

        if (txDetails?.meta?.err === null) {
          console.log("🟢 Transaction confirmed via fallback.");
          confirmed = true;
        } else {
          console.error(
            "❌ Transaction failed on-chain:",
            txDetails?.meta?.err
          );
        }
      } catch (checkErr) {
        console.error(
          "🔴 Could not verify transaction status manually:",
          checkErr.message
        );
      }
    }
  }

  if (!confirmed) {
    return res.status(500).json({
      error: "Transaction was not confirmed",
      txSignature: txSignature || "unknown",
    });
  }

  // ✅ Step 3: If confirmed, update DB
  try {
    console.log("gameObjectId: ", gameObjectId);
    const gamePot = await GamePot.findOne({
      gameId: gameObjectId,
      potPublicKey,
    });

    if (!gamePot) {
      return res.status(404).json({ error: "Pot not found in database" });
    }

    gamePot.status = "Ended";
    gamePot.closedAt = new Date();
    await gamePot.save();

    console.log("✅ DB updated:", gamePot);

    return res.json({
      success: true,
      message: `Pot closed successfully`,
      transaction: txSignature,
      potAddress: potPublicKey,
    });
  } catch (dbErr) {
    console.error("❌ DB update failed:", dbErr.message);
    return res.status(500).json({
      error: "Pot closed on-chain but DB update failed",
      txSignature,
      details: dbErr.message,
    });
  }
});

// Distribute winnings to winners
app.post("/pot/distribute-winners", async (req, res) => {
  try {
    const { gameId, potPublicKey, winners } = req.body;

    if (
      !gameId ||
      !potPublicKey ||
      !winners ||
      !Array.isArray(winners) ||
      winners.length !== 5
    ) {
      return res.status(400).json({
        error:
          "gameId, potPublicKey, and winners array with exactly 5 public keys are required",
      });
    }

    // Convert winner addresses to PublicKey objects
    const potPubkey = new PublicKey(potPublicKey);
    const winnerPubkeys = winners.map((winner) => new PublicKey(winner));

    console.log("Pot Account:", potPubkey.toString());
    console.log(
      "Winner Pubkeys:",
      winnerPubkeys.map((p) => p.toString())
    );

    try {
      // Get wallet that will sign this transaction
      const wallet = program.provider.wallet;
      console.log("Signing with wallet:", wallet.publicKey.toString());

      // Create a pot PDA key if that's what your program expects
      // Note: The seed format should match your program's expectations
      const [potPDA, _] = await PublicKey.findProgramAddress(
        [Buffer.from("pot"), potPubkey.toBuffer()],
        program.programId
      );
      console.log("Derived Pot PDA:", potPDA.toString());

      // Create transaction manually for more control
      const remainingAccounts = winnerPubkeys.map((pubkey) => ({
        pubkey,
        isWritable: true,
        isSigner: false,
      }));

      // Set better transaction options
      const opts = {
        commitment: "confirmed",
        skipPreflight: true,
        maxRetries: 5,
      };

      // Get the latest blockhash first
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash("confirmed");

      // Create the transaction by a separate method builder
      const tx = await program.methods
        .distributeWinners(winnerPubkeys)
        .accounts({
          potAccount: potPubkey,
          systemProgram: anchor.web3.SystemProgram.programId,
          // If your program expects an authority account, add it here
          // authority: wallet.publicKey,
        })
        .remainingAccounts(remainingAccounts)
        .transaction(); // Use transaction() instead of rpc() to get Transaction object

      // Set the required transaction parameters
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = blockhash;

      // Sign the transaction
      const signedTx = await wallet.signTransaction(tx);

      // Send and confirm the transaction with custom confirmation
      const signature = await program.provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true }
      );

      console.log("Transaction sent with signature:", signature);

      // Wait for confirmation with a longer timeout
      console.log("Waiting for confirmation...");
      const confirmation = await program.provider.connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      console.log("Transaction confirmed:", confirmation);

      // Update the pot status in the database
      try {
        const gamePot = await GamePot.findOne({
          gameId: gameId,
          potPublicKey: potPublicKey,
        });

        if (gamePot) {
          gamePot.winnersPaid = true;
          gamePot.winnerAddresses = winners;
          gamePot.paidAt = new Date();
          await gamePot.save();
          console.log("Database updated with winners");
        }
      } catch (dbError) {
        console.warn("Winners paid on-chain but DB update failed:", dbError);
      }

      res.json({
        success: true,
        message: `Winnings distributed for game '${gameId}'`,
        transaction: signature,
        potAddress: potPublicKey,
        winners: winners,
      });
    } catch (err) {
      console.error("Program-specific error:", err);

      // Get detailed logs if available
      const logs = err.logs || (err.getLogs ? err.getLogs() : null);
      if (logs) {
        console.error("Transaction logs:", logs);
      }

      // Handle specific error cases
      if (err.message && err.message.includes("PotNotActive")) {
        return res.status(400).json({
          error: "The pot must be ended before distributing winnings.",
        });
      } else if (err.message && err.message.includes("InvalidWinnerList")) {
        return res.status(400).json({
          error: "Invalid winner list: must contain exactly 5 addresses.",
        });
      } else if (err.message && err.message.includes("WinnerPubkeyMismatch")) {
        return res.status(400).json({
          error: "Winner public key does not match the expected order.",
        });
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Error distributing winnings:", error);

    // Format a user-friendly error response
    let errorResponse = { error: "Failed to distribute winnings" };

    if (error.message) {
      errorResponse.details = error.message;
    }

    if (error.transactionLogs) {
      errorResponse.logs = error.transactionLogs;
    }

    res.status(500).json(errorResponse);
  }
});
// Create unsigned transaction for client to sign with wallet adapter
app.post("/pot/create-entry-fee-transaction", async (req, res) => {
  try {
    //game id comes from params
    //pot public key comes from params
    //publicKey will come from frontend localstorage
    const { gameId, potPublicKey, amount, playerPublicKey } = req.body;

    if (!gameId || !potPublicKey || !amount || !playerPublicKey) {
      return res.status(400).json({
        error: "gameId, potPublicKey, amount, and playerPublicKey are required",
      });
    }

    // Convert amount to lamports (BN format)
    const amountBN = new BN(parseInt(amount));

    // Parse player public key
    const player = new PublicKey(playerPublicKey);

    try {
      // Create transaction for pay_entry_fee instruction
      const transaction = await program.methods
        .payEntryFee(amountBN)
        .accounts({
          potAccount: potPublicKey,
          player: player,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .transaction();

      // Get recent blockhash for transaction
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = player;

      // Serialize the transaction to base64
      const serializedTransaction = Buffer.from(
        transaction.serialize({ requireAllSignatures: false })
      ).toString("base64");

      res.json({
        success: true,
        message: `Transaction created for entry fee payment of ${amount} lamports`,
        serializedTransaction,
        potAddress: potPublicKey,
      });
    } catch (err) {
      if (err.message.includes("PotNotActive")) {
        res.status(400).json({
          error: "The pot is not active.",
        });
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Error creating entry fee transaction:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify and record a completed payment transaction
//  This is only used for checking the transaction after create-entry-fee-transaction is called
app.post("/pot/verify-payment", async (req, res) => {
  try {
    const { gameId, potPublicKey, signature, playerPublicKey } = req.body;

    if (!gameId || !potPublicKey || !signature || !playerPublicKey) {
      return res.status(400).json({
        error:
          "gameId, potPublicKey, signature, and playerPublicKey are required",
      });
    }

    const tx = await connection.getTransaction(signature, {
      commitment: "confirmed",
    });

    if (!tx) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (!tx.meta || tx.meta.err) {
      return res.status(400).json({ error: "Transaction failed" });
    }

    const programIndex = tx.transaction.message.accountKeys.findIndex((key) =>
      key.equals(programId)
    );

    if (programIndex === -1) {
      return res
        .status(400)
        .json({ error: "Transaction did not involve our program" });
    }

    const playerPubkey = new PublicKey(playerPublicKey);
    const playerIndex = tx.transaction.message.accountKeys.findIndex((key) =>
      key.equals(playerPubkey)
    );

    if (playerIndex === -1) {
      return res
        .status(400)
        .json({ error: "Player not involved in transaction" });
    }

    // Parse amount (from inner instructions or logs if needed, else trust input)
    // For now we assume it's trusted input or known fee
    const amount = 10000000; // Replace with dynamic extraction if needed

    // Save signed transaction base64
    const txnHash = await Txhash.create({
      txhash: signature,
      isPlayed: false,
    });

    const game = await Game.findOne({ _id: gameId });
    console.log("game :", game);
    const fpot = await GamePot.findOne({ potPublicKey });
    console.log("fpot: ", fpot);
    const user = await User.findOne({ publicKey: playerPublicKey });
    console.log("user:", user);

    const newGameplay = new Gameplay({
      gameId: game._id,
      potId: fpot._id,
      userId: user._id,
      score: 0,
      timestamp: new Date(),
      txhash: txnHash._id,
    });
    await newGameplay.save();

    // Add amount to the pot
    const pot = await GamePot.findOne({ potPublicKey });
    pot.totalLamports += amount;
    await pot.save();

    res.json({
      success: true,
      message: `Payment verified and gameplay entry saved`,
      signature,
      potAddress: potPublicKey,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: error.message });
  }
});

// For admin/server-initiated payments
app.post("/pot/pay-entry-fee", async (req, res) => {
  try {
    const { gameId, potNumber, amount } = req.body;

    if (!gameId || !potNumber || !amount) {
      return res
        .status(400)
        .json({ error: "gameId, potNumber, and amount are required" });
    }

    // Get the PDA
    const potPda = getPotPDA(gameId, potNumber);

    // Convert amount to lamports (BN format)
    const amountBN = new BN(parseInt(amount));

    try {
      // Call the pay_entry_fee instruction using server wallet
      const tx = await program.methods
        .payEntryFee(amountBN)
        .accounts({
          potAccount: potPda,
          player: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      res.json({
        success: true,
        message: `Server paid entry fee of ${amount} lamports to pot for game '${gameId}' with pot number ${potNumber}`,
        transaction: tx,
        potAddress: potPda.toString(),
        player: wallet.publicKey.toString(),
      });
    } catch (err) {
      if (err.message.includes("PotNotActive")) {
        res.status(400).json({
          error: "The pot is not active.",
        });
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Error paying entry fee:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/score/update", async (req, res) => {
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

    // ✅ Also update isPlayed in Txhash
    const txhashDoc = await Txhash.findById(txhash);
    if (txhashDoc) {
      txhashDoc.isPlayed = true;
      await txhashDoc.save();
    } else {
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
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ error: error.message });
  }
});

//get all gameplays with gameId and potID
app.get("/gameplays/:gameId/:potId", async (req, res) => {
  try {
    const { gameId, potId } = req.params;
    const gameplays = await Gameplay.find({ gameId, potId }).populate(
      "userId txhash"
    );
    console.log("gameplays: ", gameplays);
    res.json(gameplays);
  } catch (error) {
    console.error("Error fetching gameplays:", error);
    res.status(500).json({ error: error.message });
  }
});
//get all games
app.get("/games/all", async (req, res) => {
  const games = await Game.find();
  res.status(200).json(games);
});

// // Get all pots across all games
app.get("/pots/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;
    // Get all GamePot accounts
    const gameObjectId = await Game.findOne({ gameId });
    const pots = await GamePot.find({ gameId: gameObjectId._id });

    res.json(pots);
  } catch (error) {
    console.error("Error fetching all pots:", error);
    res.status(500).json({ error: error.message });
  }
});

function getTop5PublicKeys(response) {
  const { leaderboard } = response;

  const top5 = leaderboard
    .slice(0, 5)
    .map((entry) => entry.userId?.publicKey || process.env.DEFAULT_PUBLIC_KEY);

  while (top5.length < 5) {
    top5.push(process.env.DEFAULT_PUBLIC_KEY);
  }

  return top5;
}

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
  console.log(`Wallet public key: ${wallet.publicKey.toString()}`);
  console.log(`Connected to Solana devnet: https://api.devnet.solana.com`);

  // const Flappy_bird_game_Object_Id = "6822a17cc32d4c0783a20047";
  // const Pacman_game_Object_Id = "682a469a89ba63c2685e4f6c";

  const Flappy_bird_game_Object_Id = "68210f89681811dd521231f4";
  const Pacman_game_Object_Id = "6821cb510d3f7c6aef6e0a17";

  const Fgame_Id = "flappy_bird";
  const Pgame_Id = "pacman";
  let time = 300;
  setInterval(() => {
    console.log("Time: ", time);
    time--;
  }, 1000);

  cron.schedule("*/15 * * * *", async () => {
    try {
      await handleGameCron(Flappy_bird_game_Object_Id, Fgame_Id);
      await handleGameCron(Pacman_game_Object_Id, Pgame_Id);
    } catch (err) {
      console.error("Cron job error:", err.message);
    }
  });

  // const initializerFn = async () => {
  //   try {
  //     await handleGameCron(Flappy_bird_game_Object_Id, Fgame_Id);
  //     // await handleGameCron(Pacman_game_Object_Id, Pgame_Id);
  //   } catch (err) {
  //     console.error("Cron job error:", err.message);
  //   }
  // };
  // initializerFn();
});

app.post("/games/add", async (req, res) => {
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
    res.json({
      success: true,
      message: "Game added successfully",
      game: newGame,
    });
  } else {
    res.json({ success: false, message: "Game already exists" });
  }
});
const handleGameCron = async (gameObjectId, gameId) => {
  let potNumber;
  let potId;
  let potPublicKey;
  let result;

  // 1. Fetch latest pot
  try {
    const fetchURL = `${process.env.SERVER_URL}/pot/latest/${gameId}`;
    const response = await fetch(fetchURL);

    const data = await response.json();
    console.log("Latest pot: ", data);
    const latestPot = data.pot;
    potNumber = latestPot.potNumber;
    potId = latestPot._id;
    potPublicKey = latestPot.potPublicKey;
    console.log(`Pot number: ${potNumber}`);
  } catch (err) {
    console.error(`Error fetching latest pot for ${gameId}:`, err.message);
    return; // stop further execution since potNumber is essential
  }

  // 2. Fetch leaderboard
  try {
    const response2 = await fetch(
      `${process.env.SERVER_URL}/leaderboard/${gameObjectId}/${potId}/`
    );
    const data2 = await response2.json();
    result = getTop5PublicKeys(data2);
    console.log("Top 5 winners:", result);
  } catch (err) {
    console.error(`Error fetching leaderboard for ${gameId}:`, err.message);
    return;
  }

  // 3. Close pot if not already closed, then wait until it's truly ended
  let potClosed = false;
  try {
    const response = await fetch(
      `${process.env.SERVER_URL}/pot/latest/${gameId}`
    );
    const data = await response.json();
    const latestPot = data.pot;

    if (latestPot.status !== "Ended") {
      const closeRes = await fetch(`${process.env.SERVER_URL}/pot/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameObjectId: gameObjectId, potPublicKey }),
      });
      const closeData = await closeRes.json();
      console.log(`Closed pot (line 931):`, closeData);
      potClosed = true;
    } else {
      console.log(`Pot ${potNumber} already closed (line 935)`);
      potClosed = true;
    }
  } catch (err) {
    console.error(`Error closing pot for ${gameId}:`, err.message);
    return;
  }

  // 5.1 Wait and recheck pot status before distributing
  if (potClosed) {
    let retries = 3;
    let confirmed = false;

    while (retries-- > 0 && !confirmed) {
      await new Promise((res) => setTimeout(res, 3000)); // wait 3 seconds
      const potInfo = await GamePot.findOne({
        gameId: gameObjectId,
        potPublicKey,
      });
      if (potInfo.status === "Ended") {
        confirmed = true;
        console.log(`Pot ${potNumber} confirmed as ended`);
      } else {
        console.log(`Waiting for pot ${potNumber} to be fully closed...`);
      }
    }

    // 6. Distribute winnings only if confirmed
    if (confirmed && result && result.length > 0) {
      try {
        const response3 = await fetch(
          `${process.env.SERVER_URL}/pot/distribute-winners`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gameId: gameObjectId,
              potPublicKey: potPublicKey,
              winners: result,
            }),
          }
        );
        const data3 = await response3.json();
        console.log("Payout response:", data3);
      } catch (err) {
        console.error(`Error distributing payouts for ${gameId}:`, err.message);
      }
    } else {
      console.log(
        `Skipping distribution: Pot not confirmed as ended or no winners`
      );
    }
  }

  // 6. Initialize next pot
  try {
    const nextPotNumber = potNumber + 1;
    console.log("nextPotNumber: ", nextPotNumber);
    const initRes = await fetch(`${process.env.SERVER_URL}/pot/initialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, potNumber: nextPotNumber }),
    });
    const initData = await initRes.json();
    console.log(`Initialized pot ${nextPotNumber}:`, initData.message);
  } catch (err) {
    console.error(`Error initializing pot for ${gameId}:`, err.message);
  }
};

import express, { Request, Response } from "express";
import * as anchor from "@coral-xyz/anchor";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { program, wallet, connection } from "../config/solana.js";
import { getPotPDA } from "../utils/helpers.js";
import Game from "../models/Games.js";
import GamePot from "../models/GamePot.js";
import Gameplay from "../models/Gameplay.js";
import User from "../models/User.js";
import Txhash from "../models/Txhash.js";

const router = express.Router();

// Get latest pot for a game
router.get("/latest/:gameId", async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;

    const gameObjectId = await Game.findOne({ gameId });

    if (!gameObjectId) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    const latestPot = await GamePot.findOne({ gameId: gameObjectId._id })
      .sort({ createdAt: -1 })
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
  } catch (error: any) {
    console.error("Error fetching latest pot:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all pots for a game
router.get("/:gameId", async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const gameObjectId = await Game.findOne({ gameId });

    if (!gameObjectId) {
      return res.status(404).json({ error: "Game not found" });
    }

    const pots = await GamePot.find({ gameId: gameObjectId._id });
    res.json(pots);
  } catch (error: any) {
    console.error("Error fetching all pots:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get pot details (balance, status, balance_sol)
router.get("/:gameId/:potPublicKey", async (req: Request, res: Response) => {
  try {
    const { gameId, potPublicKey } = req.params;

    try {
      const potAccount: any = await (program.account as any).gamePot.fetch(potPublicKey);

      res.json({
        gameId: potAccount.gameId,
        potAddress: potPublicKey,
        potNumber: potAccount.potNumber.toString(),
        balance: potAccount.totalLamports.toString(),
        status: Object.keys(potAccount.status)[0],
        balanceSol:
          potAccount.totalLamports.toNumber() / anchor.web3.LAMPORTS_PER_SOL,
      });
    } catch (err: any) {
      if (err.message?.includes("Account does not exist")) {
        return res.status(404).json({
          error: `Pot not found for game '${gameId}' with pot Public Key ${potPublicKey}`,
          details: "The pot account may not have been initialized yet",
        });
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Error fetching pot status:", error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize a new pot
router.post("/initialize", async (req: Request, res: Response) => {
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

    const potNumberBN = new BN(parseInt(potNumber.toString()));
    const potPda = getPotPDA(gameObjectId._id.toString(), potNumber);

    let tx: string;
    try {
      tx = await program.methods
        .initializePot(gameObjectId._id.toString(), potNumberBN)
        .accounts({
          potAccount: potPda,
          signer: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (err: any) {
      console.log(err);
      if (err.message?.includes("already in use")) {
        return res.status(409).json({
          error: `Pot already exists for game '${gameId}' with pot number ${potNumber}`,
        });
      }
      console.error("Failed to initialize pot on-chain:", err);
      return res
        .status(500)
        .json({ error: "Failed to initialize pot on-chain" });
    }

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
    } catch (dbError: any) {
      console.error(
        "Pot initialized on-chain but failed to save in DB:",
        dbError
      );
      return res.status(500).json({
        error: "Pot initialized on-chain, but failed to save in DB",
        transaction: tx,
      });
    }
  } catch (error: any) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Close the pot
router.post("/close", async (req: Request, res: Response) => {
  const { gameObjectId, potPublicKey } = req.body;

  if (!gameObjectId || !potPublicKey) {
    return res
      .status(400)
      .json({ error: "gameObjectId and potPublicKey are required" });
  }

  let txSignature: string | undefined;
  let confirmed = false;

  try {
    txSignature = await program.methods
      .closePot()
      .accounts({ potAccount: potPublicKey })
      .rpc();

    console.log("🟢 Transaction sent:", txSignature);

    const txDetails = await connection.getParsedTransaction(txSignature as string, {
      commitment: "confirmed",
    });

    if (txDetails?.meta?.err === null) {
      console.log("🟢 Transaction confirmed via getParsedTransaction");
      confirmed = true;
    } else {
      console.error("❌ Transaction failed on-chain:", txDetails?.meta?.err);
    }
  } catch (err: any) {
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
      } catch (checkErr: any) {
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
  } catch (dbErr: any) {
    console.error("❌ DB update failed:", dbErr.message);
    return res.status(500).json({
      error: "Pot closed on-chain but DB update failed",
      txSignature,
      details: dbErr.message,
    });
  }
});

// Distribute winnings to winners
router.post("/distribute-winners", async (req: Request, res: Response) => {
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

    const potPubkey = new PublicKey(potPublicKey);
    const winnerPubkeys = winners.map((winner: string) => new PublicKey(winner));

    console.log("Pot Account:", potPubkey.toString());
    console.log(
      "Winner Pubkeys:",
      winnerPubkeys.map((p) => p.toString())
    );

    try {
      console.log("Signing with wallet:", wallet.publicKey.toString());

      const [potPDA, _] = await PublicKey.findProgramAddress(
        [Buffer.from("pot"), potPubkey.toBuffer()],
        program.programId
      );
      console.log("Derived Pot PDA:", potPDA.toString());

      const remainingAccounts = winnerPubkeys.map((pubkey) => ({
        pubkey,
        isWritable: true,
        isSigner: false,
      }));

      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash("confirmed");

      const tx = await program.methods
        .distributeWinners(winnerPubkeys)
        .accounts({
          potAccount: potPubkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .remainingAccounts(remainingAccounts)
        .transaction();

      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = blockhash;

      const signedTx = await wallet.signTransaction(tx);

      const signature = await program.provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true }
      );

      console.log("Transaction sent with signature:", signature);

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

      try {
        const gamePot: any = await GamePot.findOne({
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
      } catch (dbError: any) {
        console.warn("Winners paid on-chain but DB update failed:", dbError);
      }

      res.json({
        success: true,
        message: `Winnings distributed for game '${gameId}'`,
        transaction: signature,
        potAddress: potPublicKey,
        winners: winners,
      });
    } catch (err: any) {
      console.error("Program-specific error:", err);

      const logs = err.logs || (err.getLogs ? err.getLogs() : null);
      if (logs) {
        console.error("Transaction logs:", logs);
      }

      if (err.message?.includes("PotNotActive")) {
        return res.status(400).json({
          error: "The pot must be ended before distributing winnings.",
        });
      } else if (err.message?.includes("InvalidWinnerList")) {
        return res.status(400).json({
          error: "Invalid winner list: must contain exactly 5 addresses.",
        });
      } else if (err.message?.includes("WinnerPubkeyMismatch")) {
        return res.status(400).json({
          error: "Winner public key does not match the expected order.",
        });
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Error distributing winnings:", error);

    const errorResponse: any = { error: "Failed to distribute winnings" };

    if (error.message) {
      errorResponse.details = error.message;
    }

    if (error.transactionLogs) {
      errorResponse.logs = error.transactionLogs;
    }

    res.status(500).json(errorResponse);
  }
});

// Create unsigned transaction for client to sign
router.post("/create-entry-fee-transaction", async (req: Request, res: Response) => {
  try {
    const { gameId, potPublicKey, amount, playerPublicKey } = req.body;

    if (!gameId || !potPublicKey || !amount || !playerPublicKey) {
      return res.status(400).json({
        error: "gameId, potPublicKey, amount, and playerPublicKey are required",
      });
    }

    const amountBN = new BN(parseInt(amount.toString()));
    const player = new PublicKey(playerPublicKey);

    try {
      const transaction = await program.methods
        .payEntryFee(amountBN)
        .accounts({
          potAccount: potPublicKey,
          player: player,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .transaction();

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = player;

      const serializedTransaction = Buffer.from(
        transaction.serialize({ requireAllSignatures: false })
      ).toString("base64");

      res.json({
        success: true,
        message: `Transaction created for entry fee payment of ${amount} lamports`,
        serializedTransaction,
        potAddress: potPublicKey,
      });
    } catch (err: any) {
      if (err.message?.includes("PotNotActive")) {
        return res.status(400).json({
          error: "The pot is not active.",
        });
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Error creating entry fee transaction:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify and record a completed payment transaction
router.post("/verify-payment", async (req: Request, res: Response) => {
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
      key.equals(program.programId)
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

    const amount = 10000000;

    const txnHash = await Txhash.create({
      txhash: signature,
      isPlayed: false,
    });

    const game = await Game.findOne({ _id: gameId });
    const fpot = await GamePot.findOne({ potPublicKey });
    const user = await User.findOne({ publicKey: playerPublicKey });

    if (!game || !fpot || !user) {
      return res.status(404).json({ error: "Game, pot, or user not found" });
    }

    const newGameplay = new Gameplay({
      gameId: game._id,
      potId: fpot._id,
      userId: user._id,
      score: 0,
      timestamp: new Date(),
      txhash: txnHash._id,
    });
    await newGameplay.save();

    const pot = await GamePot.findOne({ potPublicKey });
    if (pot) {
      pot.totalLamports += amount;
      await pot.save();
    }

    res.json({
      success: true,
      message: `Payment verified and gameplay entry saved`,
      signature,
      potAddress: potPublicKey,
      timestamp: new Date(),
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: error.message });
  }
});

// For admin/server-initiated payments
router.post("/pay-entry-fee", async (req: Request, res: Response) => {
  try {
    const { gameId, potNumber, amount } = req.body;

    if (!gameId || !potNumber || !amount) {
      return res
        .status(400)
        .json({ error: "gameId, potNumber, and amount are required" });
    }

    const potPda = getPotPDA(gameId, potNumber);
    const amountBN = new BN(parseInt(amount.toString()));

    try {
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
    } catch (err: any) {
      if (err.message?.includes("PotNotActive")) {
        return res.status(400).json({
          error: "The pot is not active.",
        });
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Error paying entry fee:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

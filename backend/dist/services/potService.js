import * as anchor from "@coral-xyz/anchor";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { program, wallet, connection } from "../config/solana.js";
import { getPotPDA } from "../utils/helpers.js";
import GamePot from "../models/GamePot.js";
class PotService {
    // Initialize a new pot
    async initializePot(gameObjectId, gameId, potNumber) {
        const potNumberBN = new BN(parseInt(potNumber.toString()));
        const potPda = getPotPDA(gameObjectId, potNumber);
        let tx;
        try {
            tx = await program.methods
                .initializePot(gameObjectId, potNumberBN)
                .accounts({
                potAccount: potPda,
                signer: wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
                .rpc();
        }
        catch (err) {
            if (err.message?.includes("already in use")) {
                throw new Error(`Pot already exists for game '${gameId}' with pot number ${potNumber}`);
            }
            throw err;
        }
        try {
            const newGamePot = new GamePot({
                gameId: gameObjectId,
                potNumber,
                potPublicKey: potPda.toString(),
                totalLamports: 0,
                gameplays: [],
                status: "Active",
                createdAt: new Date(),
                closedAt: null,
            });
            await newGamePot.save();
            return {
                success: true,
                transaction: tx,
                potAddress: potPda.toString(),
                potId: newGamePot._id.toString(),
            };
        }
        catch (dbError) {
            console.error("Pot initialized on-chain but failed to save in DB:", dbError);
            throw new Error("Pot initialized on-chain, but failed to save in DB");
        }
    }
    // Close a pot
    async closePot(gameObjectId, potPublicKey) {
        let txSignature;
        let confirmed = false;
        console.log(`Attempting to close pot: ${potPublicKey}`);
        console.log(`Using wallet: ${wallet.publicKey.toString()}`);
        try {
            txSignature = await program.methods
                .closePot()
                .accounts({ potAccount: potPublicKey })
                .rpc();
            console.log("🟢 Transaction sent:", txSignature);
            const txDetails = await connection.getParsedTransaction(txSignature, {
                commitment: "confirmed",
            });
            if (txDetails?.meta?.err === null) {
                console.log("🟢 Transaction confirmed via getParsedTransaction");
                confirmed = true;
            }
            else {
                console.error("❌ Transaction failed on-chain:", txDetails?.meta?.err);
            }
        }
        catch (err) {
            txSignature = err.signature;
            console.error("⚠️ RPC call error:", err.name);
            console.error("⚠️ Error message:", err.message);
            console.error("⚠️ Full error:", err);
            if (err.name === "TransactionExpiredTimeoutError" && txSignature) {
                console.warn("⏱️ Transaction timed out. Checking status manually...");
                try {
                    const txDetails = await connection.getParsedTransaction(txSignature, {
                        commitment: "confirmed",
                    });
                    if (txDetails?.meta?.err === null) {
                        console.log("🟢 Transaction confirmed via fallback.");
                        confirmed = true;
                    }
                    else {
                        console.error("❌ Transaction failed on-chain:", txDetails?.meta?.err);
                    }
                }
                catch (checkErr) {
                    console.error("🔴 Could not verify transaction status manually:", checkErr.message);
                }
            }
        }
        if (!confirmed) {
            throw new Error("Transaction was not confirmed");
        }
        try {
            const gamePot = await GamePot.findOne({
                gameId: gameObjectId,
                potPublicKey,
            });
            if (!gamePot) {
                throw new Error("Pot not found in database");
            }
            gamePot.status = "Ended";
            gamePot.closedAt = new Date();
            await gamePot.save();
            console.log("✅ DB updated:", gamePot);
            return {
                success: true,
                transaction: txSignature,
                potAddress: potPublicKey,
            };
        }
        catch (dbErr) {
            console.error("❌ DB update failed:", dbErr.message);
            throw new Error("Pot closed on-chain but DB update failed");
        }
    }
    // Distribute winnings to winners
    async distributeWinners(gameObjectId, potPublicKey, winners) {
        if (!Array.isArray(winners) || winners.length !== 5) {
            throw new Error("Winners array must contain exactly 5 public keys");
        }
        const potPubkey = new PublicKey(potPublicKey);
        const winnerPubkeys = winners.map((winner) => new PublicKey(winner));
        console.log("Pot Account:", potPubkey.toString());
        console.log("Winner Pubkeys:", winnerPubkeys.map((p) => p.toString()));
        // Verify pot is in Ended status before distributing
        try {
            const potAccount = await program.account.gamePot.fetch(potPubkey);
            const statusKey = Object.keys(potAccount.status)[0];
            console.log("Pot status:", statusKey);
            // Check for both "ended" and "Ended" to be case-insensitive
            if (statusKey.toLowerCase() !== "ended") {
                throw new Error(`Pot must be in Ended status before distributing winners. Current status: ${statusKey}`);
            }
        }
        catch (err) {
            console.error("Error fetching pot account:", err.message);
            throw new Error(`Cannot verify pot status: ${err.message}`);
        }
        try {
            const remainingAccounts = winnerPubkeys.map((pubkey) => ({
                pubkey,
                isWritable: true,
                isSigner: false,
            }));
            const { blockhash, lastValidBlockHeight } = await program.provider.connection.getLatestBlockhash("confirmed");
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
            const signature = await program.provider.connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: false, preflightCommitment: "confirmed" });
            console.log("Transaction sent with signature:", signature);
            const confirmation = await program.provider.connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight,
            }, "confirmed");
            console.log("Transaction confirmation:", confirmation);
            // Check if transaction actually succeeded
            if (confirmation.value.err) {
                console.error("❌ Transaction failed on-chain:", confirmation.value.err);
                throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
            }
            console.log("✅ Transaction succeeded on-chain");
            try {
                const gamePot = await GamePot.findOne({
                    gameId: gameObjectId,
                    potPublicKey: potPublicKey,
                });
                if (gamePot) {
                    gamePot.winnersPaid = true;
                    gamePot.winnerAddresses = winners;
                    gamePot.paidAt = new Date();
                    await gamePot.save();
                    console.log("Database updated with winners");
                }
            }
            catch (dbError) {
                console.warn("Winners paid on-chain but DB update failed:", dbError);
            }
            return {
                success: true,
                transaction: signature,
                potAddress: potPublicKey,
                data: { winners },
            };
        }
        catch (err) {
            console.error("Program-specific error:", err);
            const logs = err.logs || (err.getLogs ? err.getLogs() : null);
            if (logs) {
                console.error("Transaction logs:", logs);
            }
            if (err.message?.includes("PotNotActive")) {
                throw new Error("The pot must be ended before distributing winnings.");
            }
            else if (err.message?.includes("InvalidWinnerList")) {
                throw new Error("Invalid winner list: must contain exactly 5 addresses.");
            }
            else if (err.message?.includes("WinnerPubkeyMismatch")) {
                throw new Error("Winner public key does not match the expected order.");
            }
            throw err;
        }
    }
}
export default new PotService();
//# sourceMappingURL=potService.js.map
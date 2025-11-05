import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { programId } from "../config/solana.js";
import { ILeaderboardEntry } from "../types/index.js";

// Helper function to derive PDA for a pot
export const getPotPDA = (gameId: string, potNumber: number): PublicKey => {
  const potNumberBN = new BN(parseInt(potNumber.toString()));

  const [potPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("pot"),
      Buffer.from(gameId),
      potNumberBN.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );

  return potPda;
};

// Get top 5 public keys from leaderboard
export const getTop5PublicKeys = (response: {
  leaderboard: ILeaderboardEntry[];
}): string[] => {
  const { leaderboard } = response;

  const top5 = leaderboard
    .slice(0, 5)
    .map((entry) => entry.userId?.publicKey || process.env.DEFAULT_PUBLIC_KEY!);

  while (top5.length < 5) {
    top5.push(process.env.DEFAULT_PUBLIC_KEY!);
  }

  return top5;
};

// Format time remaining in human-readable format
export const formatTimeRemaining = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

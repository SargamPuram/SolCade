import { PublicKey } from "@solana/web3.js";
import { ILeaderboardEntry } from "../types/index.js";
export declare const getPotPDA: (gameId: string, potNumber: number) => PublicKey;
export declare const getTop5PublicKeys: (response: {
    leaderboard: ILeaderboardEntry[];
}) => string[];
export declare const formatTimeRemaining: (ms: number) => string;
//# sourceMappingURL=helpers.d.ts.map
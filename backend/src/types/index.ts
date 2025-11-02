import { Types } from "mongoose";

// User types
export interface IUser {
  _id: Types.ObjectId;
  publicKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Game types
export interface IGame {
  _id: Types.ObjectId;
  gameId: string;
  name: string;
  description: string;
  entryFee: number;
  logo?: string;
  genre?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// GamePot types
export interface IGamePot {
  _id: Types.ObjectId;
  gameId: Types.ObjectId;
  potNumber: number;
  potPublicKey: string;
  totalLamports: number;
  gameplays: Types.ObjectId[];
  status: "Active" | "Ended";
  winnersPaid?: boolean;
  winnerAddresses?: string[];
  paidAt?: Date;
  createdAt: Date;
  closedAt?: Date;
}

// Gameplay types
export interface IGameplay {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  gameId: Types.ObjectId;
  potId: Types.ObjectId;
  score: number;
  timestamp: Date;
  txhash: Types.ObjectId;
}

// Transaction hash types
export interface ITxhash {
  _id: Types.ObjectId;
  txhash: string;
  isPlayed: boolean;
  createdAt?: Date;
}

// Leaderboard entry (populated)
export interface ILeaderboardEntry {
  _id: Types.ObjectId;
  userId: {
    _id: Types.ObjectId;
    publicKey: string;
  };
  score: number;
  timestamp: Date;
}

// API Request/Response types
export interface CreateEntryFeeTransactionRequest {
  gameId: string;
  potPublicKey: string;
  amount: number;
  playerPublicKey: string;
}

export interface VerifyPaymentRequest {
  gameId: string;
  potPublicKey: string;
  signature: string;
  playerPublicKey: string;
}

export interface InitializePotRequest {
  gameId: string;
  potNumber: number;
}

export interface ClosePotRequest {
  gameObjectId: string;
  potPublicKey: string;
}

export interface DistributeWinnersRequest {
  gameId: string;
  potPublicKey: string;
  winners: string[];
}

export interface UpdateScoreRequest {
  gameId: string;
  potId: string;
  userId: string;
  txhash: string;
  score: number;
}

// Cron service types
export interface GameConfig {
  objectId: string;
  gameId: string;
}

export interface CronTimeInfo {
  timeRemaining: number;
  nextCronTime: string;
  seconds?: number;
  formatted?: string;
  message?: string;
}

// Service response types
export interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  transaction?: string;
  potAddress?: string;
  potId?: string;
}

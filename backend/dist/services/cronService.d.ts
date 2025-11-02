import { GameConfig, CronTimeInfo } from "../types/index.js";
import PotService from "./potService.js";
export declare const formatTimeRemaining: (ms: number) => string;
export declare const getNextCronTime: () => CronTimeInfo | null;
export declare const initializeCronJobs: (games: GameConfig[], potService: typeof PotService) => void;
//# sourceMappingURL=cronService.d.ts.map
import { ServiceResponse } from "../types/index.js";
declare class PotService {
    initializePot(gameObjectId: string, gameId: string, potNumber: number): Promise<ServiceResponse>;
    closePot(gameObjectId: string, potPublicKey: string): Promise<ServiceResponse>;
    distributeWinners(gameObjectId: string, potPublicKey: string, winners: string[]): Promise<ServiceResponse>;
}
declare const _default: PotService;
export default _default;
//# sourceMappingURL=potService.d.ts.map
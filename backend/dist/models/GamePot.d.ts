export default GamePot;
declare const GamePot: mongoose.Model<{
    potNumber: number;
    potPublicKey: string;
    totalLamports: number;
    status: "Active" | "Ended";
    createdAt: NativeDate;
    closedAt: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    potNumber: number;
    potPublicKey: string;
    totalLamports: number;
    status: "Active" | "Ended";
    createdAt: NativeDate;
    closedAt: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
}, {}> & {
    potNumber: number;
    potPublicKey: string;
    totalLamports: number;
    status: "Active" | "Ended";
    createdAt: NativeDate;
    closedAt: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    potNumber: number;
    potPublicKey: string;
    totalLamports: number;
    status: "Active" | "Ended";
    createdAt: NativeDate;
    closedAt: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    potNumber: number;
    potPublicKey: string;
    totalLamports: number;
    status: "Active" | "Ended";
    createdAt: NativeDate;
    closedAt: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    potNumber: number;
    potPublicKey: string;
    totalLamports: number;
    status: "Active" | "Ended";
    createdAt: NativeDate;
    closedAt: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
import mongoose from "mongoose";
//# sourceMappingURL=GamePot.d.ts.map
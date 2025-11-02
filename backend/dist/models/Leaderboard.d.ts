export default Leaderboard;
declare const Leaderboard: mongoose.Model<{
    gameplays: mongoose.Types.ObjectId[];
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    startTime?: NativeDate | null | undefined;
    endTime?: NativeDate | null | undefined;
    isFinalized?: boolean | null | undefined;
    prizeDistribution?: {
        first?: mongoose.Types.ObjectId | null | undefined;
        second?: mongoose.Types.ObjectId | null | undefined;
        third?: mongoose.Types.ObjectId | null | undefined;
        fourth?: mongoose.Types.ObjectId | null | undefined;
        fifth?: mongoose.Types.ObjectId | null | undefined;
    } | null | undefined;
    transactionHashes?: {
        first?: string | null | undefined;
        second?: string | null | undefined;
        third?: string | null | undefined;
        fourth?: string | null | undefined;
        fifth?: string | null | undefined;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    gameplays: mongoose.Types.ObjectId[];
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    startTime?: NativeDate | null | undefined;
    endTime?: NativeDate | null | undefined;
    isFinalized?: boolean | null | undefined;
    prizeDistribution?: {
        first?: mongoose.Types.ObjectId | null | undefined;
        second?: mongoose.Types.ObjectId | null | undefined;
        third?: mongoose.Types.ObjectId | null | undefined;
        fourth?: mongoose.Types.ObjectId | null | undefined;
        fifth?: mongoose.Types.ObjectId | null | undefined;
    } | null | undefined;
    transactionHashes?: {
        first?: string | null | undefined;
        second?: string | null | undefined;
        third?: string | null | undefined;
        fourth?: string | null | undefined;
        fifth?: string | null | undefined;
    } | null | undefined;
}, {}> & {
    gameplays: mongoose.Types.ObjectId[];
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    startTime?: NativeDate | null | undefined;
    endTime?: NativeDate | null | undefined;
    isFinalized?: boolean | null | undefined;
    prizeDistribution?: {
        first?: mongoose.Types.ObjectId | null | undefined;
        second?: mongoose.Types.ObjectId | null | undefined;
        third?: mongoose.Types.ObjectId | null | undefined;
        fourth?: mongoose.Types.ObjectId | null | undefined;
        fifth?: mongoose.Types.ObjectId | null | undefined;
    } | null | undefined;
    transactionHashes?: {
        first?: string | null | undefined;
        second?: string | null | undefined;
        third?: string | null | undefined;
        fourth?: string | null | undefined;
        fifth?: string | null | undefined;
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    gameplays: mongoose.Types.ObjectId[];
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    startTime?: NativeDate | null | undefined;
    endTime?: NativeDate | null | undefined;
    isFinalized?: boolean | null | undefined;
    prizeDistribution?: {
        first?: mongoose.Types.ObjectId | null | undefined;
        second?: mongoose.Types.ObjectId | null | undefined;
        third?: mongoose.Types.ObjectId | null | undefined;
        fourth?: mongoose.Types.ObjectId | null | undefined;
        fifth?: mongoose.Types.ObjectId | null | undefined;
    } | null | undefined;
    transactionHashes?: {
        first?: string | null | undefined;
        second?: string | null | undefined;
        third?: string | null | undefined;
        fourth?: string | null | undefined;
        fifth?: string | null | undefined;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    gameplays: mongoose.Types.ObjectId[];
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    startTime?: NativeDate | null | undefined;
    endTime?: NativeDate | null | undefined;
    isFinalized?: boolean | null | undefined;
    prizeDistribution?: {
        first?: mongoose.Types.ObjectId | null | undefined;
        second?: mongoose.Types.ObjectId | null | undefined;
        third?: mongoose.Types.ObjectId | null | undefined;
        fourth?: mongoose.Types.ObjectId | null | undefined;
        fifth?: mongoose.Types.ObjectId | null | undefined;
    } | null | undefined;
    transactionHashes?: {
        first?: string | null | undefined;
        second?: string | null | undefined;
        third?: string | null | undefined;
        fourth?: string | null | undefined;
        fifth?: string | null | undefined;
    } | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    gameplays: mongoose.Types.ObjectId[];
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    startTime?: NativeDate | null | undefined;
    endTime?: NativeDate | null | undefined;
    isFinalized?: boolean | null | undefined;
    prizeDistribution?: {
        first?: mongoose.Types.ObjectId | null | undefined;
        second?: mongoose.Types.ObjectId | null | undefined;
        third?: mongoose.Types.ObjectId | null | undefined;
        fourth?: mongoose.Types.ObjectId | null | undefined;
        fifth?: mongoose.Types.ObjectId | null | undefined;
    } | null | undefined;
    transactionHashes?: {
        first?: string | null | undefined;
        second?: string | null | undefined;
        third?: string | null | undefined;
        fourth?: string | null | undefined;
        fifth?: string | null | undefined;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
import mongoose from "mongoose";
//# sourceMappingURL=Leaderboard.d.ts.map
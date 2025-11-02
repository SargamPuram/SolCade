export default UserGameplay;
declare const UserGameplay: mongoose.Model<{
    timestamp: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    score?: number | null | undefined;
    userId?: mongoose.Types.ObjectId | null | undefined;
    txhash?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    timestamp: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    score?: number | null | undefined;
    userId?: mongoose.Types.ObjectId | null | undefined;
    txhash?: mongoose.Types.ObjectId | null | undefined;
}, {}> & {
    timestamp: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    score?: number | null | undefined;
    userId?: mongoose.Types.ObjectId | null | undefined;
    txhash?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    timestamp: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    score?: number | null | undefined;
    userId?: mongoose.Types.ObjectId | null | undefined;
    txhash?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    timestamp: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    score?: number | null | undefined;
    userId?: mongoose.Types.ObjectId | null | undefined;
    txhash?: mongoose.Types.ObjectId | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    timestamp: NativeDate;
    gameId?: mongoose.Types.ObjectId | null | undefined;
    potId?: mongoose.Types.ObjectId | null | undefined;
    score?: number | null | undefined;
    userId?: mongoose.Types.ObjectId | null | undefined;
    txhash?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
import mongoose from "mongoose";
//# sourceMappingURL=Gameplay.d.ts.map
export default Game;
declare const Game: mongoose.Model<{
    gameId: string;
    name?: string | null | undefined;
    description?: string | null | undefined;
    entryFee?: number | null | undefined;
    logo?: string | null | undefined;
    genre?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    gameId: string;
    name?: string | null | undefined;
    description?: string | null | undefined;
    entryFee?: number | null | undefined;
    logo?: string | null | undefined;
    genre?: string | null | undefined;
}, {}> & {
    gameId: string;
    name?: string | null | undefined;
    description?: string | null | undefined;
    entryFee?: number | null | undefined;
    logo?: string | null | undefined;
    genre?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    gameId: string;
    name?: string | null | undefined;
    description?: string | null | undefined;
    entryFee?: number | null | undefined;
    logo?: string | null | undefined;
    genre?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    gameId: string;
    name?: string | null | undefined;
    description?: string | null | undefined;
    entryFee?: number | null | undefined;
    logo?: string | null | undefined;
    genre?: string | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    gameId: string;
    name?: string | null | undefined;
    description?: string | null | undefined;
    entryFee?: number | null | undefined;
    logo?: string | null | undefined;
    genre?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
import mongoose from "mongoose";
//# sourceMappingURL=Games.d.ts.map
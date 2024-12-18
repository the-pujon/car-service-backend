import { Types } from "mongoose";

export type TTransaction = {
    customer: Types.ObjectId;
    service: Types.ObjectId;
    transactionId: string;
    amount: string;
    status: string;
}
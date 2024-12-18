import { Types } from "mongoose";

export type TTransaction = {
    customer: string;
    service: Types.ObjectId;
    transactionId: string;
    amount: string;
    status: string;
}
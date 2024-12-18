import { model, Schema } from "mongoose";

const TransactionSchema = new Schema({
    customer: {
        type: String,
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const TransactionModel = model('Transaction', TransactionSchema);
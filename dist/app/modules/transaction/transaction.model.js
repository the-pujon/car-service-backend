"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    customer: {
        type: String,
        required: true
    },
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.TransactionModel = (0, mongoose_1.model)('Transaction', TransactionSchema);

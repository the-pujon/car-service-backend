"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidation = void 0;
const zod_1 = require("zod");
const createTransactionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer: zod_1.z.string(),
        service: zod_1.z.string(),
        transactionId: zod_1.z.string(),
        amount: zod_1.z.string()
    })
});
const updateTransactionStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.string({
            required_error: "Status is required"
        })
    })
});
exports.TransactionValidation = {
    createTransactionZodSchema,
    updateTransactionStatusZodSchema
};

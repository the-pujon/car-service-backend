import { z } from 'zod';

const createTransactionZodSchema = z.object({
  body: z.object({
    customer: z.string(),
    service: z.string(),
    transactionId: z.string(),
    amount: z.string()
  })
});

const updateTransactionStatusZodSchema = z.object({
  body: z.object({
    status: z.string({
      required_error: "Status is required"
    })
  })
});

export const TransactionValidation = {
  createTransactionZodSchema,
  updateTransactionStatusZodSchema
};

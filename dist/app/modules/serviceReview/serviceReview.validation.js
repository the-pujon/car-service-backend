"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceReviewValidation = void 0;
const zod_1 = require("zod");
const createServiceReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number().min(1).max(5),
        review: zod_1.z.string().min(1),
        service: zod_1.z.string(),
        user: zod_1.z.string(),
        name: zod_1.z.string(),
    }),
});
const updateServiceReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number().min(1).max(5).optional(),
        review: zod_1.z.string().min(1).optional(),
    }),
});
exports.ServiceReviewValidation = {
    createServiceReviewValidationSchema,
    updateServiceReviewValidationSchema,
};

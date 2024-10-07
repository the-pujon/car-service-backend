"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewCreateValidation = void 0;
const zod_1 = require("zod");
exports.ReviewCreateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email format"),
        message: zod_1.z
            .string({
            required_error: "Message is required",
        })
            .min(10, "Message must be at least 10 characters long"),
        rating: zod_1.z
            .number({
            required_error: "Rating is required",
        })
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot be more than 5"),
    }),
});

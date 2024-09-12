"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUpdateValidation = exports.ServiceCreateValidation = void 0;
const zod_1 = require("zod");
exports.ServiceCreateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string(),
        price: zod_1.z.number(),
        duration: zod_1.z.number(),
    }),
});
exports.ServiceUpdateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        duration: zod_1.z.number().optional(),
    }),
});

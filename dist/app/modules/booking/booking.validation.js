"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingCreateValidation = void 0;
const zod_1 = require("zod");
exports.BookingCreateValidation = zod_1.z.object({
    body: zod_1.z.object({
        //customer: z.string(),
        serviceId: zod_1.z.string(),
        slotId: zod_1.z.string(),
        vehicleType: zod_1.z.string(),
        vehicleBrand: zod_1.z.string(),
        vehicleModel: zod_1.z.string(),
        manufacturingYear: zod_1.z.number(),
        registrationPlate: zod_1.z.string(),
    }),
});

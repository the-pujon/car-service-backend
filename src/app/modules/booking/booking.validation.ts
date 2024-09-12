import { z } from "zod";

export const BookingCreateValidation = z.object({
  body: z.object({
    //customer: z.string(),
    serviceId: z.string(),
    slotId: z.string(),
    vehicleType: z.string(),
    vehicleBrand: z.string(),
    vehicleModel: z.string(),
    manufacturingYear: z.number(),
    registrationPlate: z.string(),
  }),
});

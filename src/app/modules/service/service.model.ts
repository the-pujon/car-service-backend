import { model, Schema } from "mongoose";
import { TService } from "./service.interface";

const serviceSchema = new Schema<TService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    image: { type: String, required: true },
    benefits: { type: [String], required: true },
    suitableFor: { type: [String], required: true },
  },
  { timestamps: true },
);

export const ServiceModel = model<TService>("Service", serviceSchema);

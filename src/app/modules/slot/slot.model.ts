import { model, Schema } from "mongoose";
import { TSlot } from "./slot.interface";

const SlotSchema = new Schema<TSlot>({
  service: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Service",
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isBooked: {
    type: String,
    enum: ["available", "booked", "canceled"],
    default: "available",
  },
});

export const SlotModel = model<TSlot>("Slot", SlotSchema);

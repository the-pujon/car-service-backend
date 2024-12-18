import { model, Schema } from "mongoose";
import { TServiceReview } from "./serviceReview.interface";

const serviceReviewSchema = new Schema<TServiceReview>({
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
{ timestamps: true }
)

export const ServiceReviewModel = model<TServiceReview>("ServiceReview", serviceReviewSchema);

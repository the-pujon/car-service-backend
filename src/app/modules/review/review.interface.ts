export type TReview = {
  //  user: Types.ObjectId;
  name: string;
  email: string;
  message: string;
  rating: number;
};

export type TReviewPayload = {
  name: string;
  email: string;
  message: string;
  rating: number;
};

import { model, Schema } from "mongoose";
import { TUser, UserStaticMethods } from "./auth.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, UserStaticMethods>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: 0,
  },
  phone: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  address: {
    type: String,
    required: true,
  },
});

//hashing password before saving user data into db
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// deleting password before sending res
userSchema.post("save", function (doc, next) {
  doc.set("password", undefined, { strict: false });
  next();
});

//static method for finding user
userSchema.statics.isUserExist = async function (email: string) {
  return await UserModel.findOne({ email }).select("+password");
};

//static method for compare password
userSchema.statics.isPasswordMatch = async function (
  plainPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const UserModel = model<TUser, UserStaticMethods>("User", userSchema);

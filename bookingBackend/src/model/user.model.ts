import { Schema, model, Document } from "mongoose";
import IUser from "../interface/user.interface";
import { userRole } from "../enum/userRole";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: userRole,
      default: userRole.USER,
      required: true,
      trim: true,
    },
    token: {
      type: String,
      trim: true,
      default: null,
    },
    profilePic: {
      type: String,
      trim: true,
    },
    gender : {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);





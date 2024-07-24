import { Schema, model, Document } from "mongoose";
import IUser from "../interface/user.interface";
import { userRole } from "../enum/userRole";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: userRole,
      default: userRole.USER,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    profilePic: {
      type: String,
    },
    gender : {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);





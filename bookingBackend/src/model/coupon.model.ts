import { Schema, model } from "mongoose";
import ICoupon from "../interface/coupon.interface";

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Coupon = model<ICoupon>("Coupon", couponSchema);

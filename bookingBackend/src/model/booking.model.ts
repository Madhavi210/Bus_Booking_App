import { Schema, model, Document } from "mongoose";
import IBooking from "../interface/booking.interface";
import { User } from "./user.model";
import { Bus } from "./bus.model";
import { Route } from "./route.model";

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    bus: { type: Schema.Types.ObjectId, ref: Bus, required: true },
    route: {
      type: Schema.Types.ObjectId,
      ref: Route,
      required: true,
    },
    fromStation: {
      type: String,
      required: true,
    },
    toStation: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    fare: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ["cash", "card", "upi"],
      required: true,
    },
    paymentDetails: {
      cardNumber: String,
      upiId: String,
      additionalCharges: { type: Number },
    },
    isSingleLady: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", bookingSchema);

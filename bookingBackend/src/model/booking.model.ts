import { Schema, model, Document } from "mongoose";
import IBooking from "../interface/booking.interface";
import { User } from "./user.model";
import { Bus } from "./bus.model";
import { Route } from "./route.model";

const bookingSchema = new Schema<IBooking>(
  {
    // user: {
    //   type: Schema.Types.ObjectId,
    //   ref: User,
    //   required: true,
    // },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address.']
    },
    mobileNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number.']
    },
    age: {
      type: Number,
      required: true,
      min: [1, 'Age must be greater than 0']
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
    passengerType: {
      type: String,
      enum: ['child', 'adult'],
      required: false,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", bookingSchema);

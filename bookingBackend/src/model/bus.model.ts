import { Schema, model, Document, Types } from "mongoose";
import IBus, { ISeat } from "../interface/bus.interface";
import { Route } from "./route.model"; // assuming you have a route model

const seatSchema = new Schema<ISeat>(
  {
    seatNumber: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
  },
  { _id: false }
);

const busSchema = new Schema<IBus>(
  {
    busNumber: {
      type: String,
      unique: true,
      required: true,
    },
    seatingCapacity: {
      type: Number,
      required: true,
    },
    amenities: [{ type: String }],
    route: {
      type: Schema.Types.ObjectId,
      ref: Route,
      required: true,
    },
    stops: [
      {
        station: {
          type: String,
          required: true,
        },
        timing: { type: Date, required: true },
      },
    ],
    totalTiming: { type: Number },
    seats: [seatSchema],
  },
  { timestamps: true }
);

export const Bus = model<IBus>("Bus", busSchema);

import { Schema, model, Document, Types } from "mongoose";
import IBus, { ISeat } from "../interface/bus.interface";
import { Route } from "./route.model"; // assuming you have a route model

const seatSchema = new Schema<ISeat>(
  {
    seatNumber: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    bookingDate: {type: Date },
    isSingleLady: { type: Boolean, default: false } 
  },
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
    // totalTiming: { type: Number },
    seats: [seatSchema],
    // seatId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "SeSeaat",
    //   required: true,
    // },
    busType: {
      type: String,
      enum: ['Seater', 'Sleeper'], 
      required: true,
    },
    seatsLayout: {
      type: String, // e.g., "2x2", "2x1", "1x1", "3x2"
      required: false
    },
    rows: {
      type: Number, 
      required: false
    },
    columns: {
      type: Number, 
      required: false
    },
    date: {
      type: Date, 
      required: false
    },
  },
  { timestamps: true }
);

export const Bus = model<IBus>("Bus", busSchema);


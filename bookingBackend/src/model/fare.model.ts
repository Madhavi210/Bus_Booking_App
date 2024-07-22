import { Schema, model } from "mongoose";
import IFare from "../interface/fare.interface";
import { Route } from "./route.model"; // assuming you have a route model

const fareSchema = new Schema<IFare>(
  {
    route: {
      type: Schema.Types.ObjectId,
      ref: Route,
      required: true,
    },
    baseFarePerKm: {
      type: Number,
      required: true,
    },
    governmentTaxPercentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Fare = model<IFare>("Fare", fareSchema);

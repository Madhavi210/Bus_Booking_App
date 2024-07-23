import { Schema, model, Document } from "mongoose";
import IRoute, { IStation } from "../interface/route.interface";

const stationSchema = new Schema<IStation>({
  name: {
    type: String,
    required: true,
  },
  distanceFromPrevious: {
    type: Number,
    required: true,
  }, // Distance from the previous station

});

const routeSchema = new Schema<IRoute>(
  {

    routeName: {
      type: String,
      required: true,
      unique: true, // Ensure the route name is unique
    },
    stations: [stationSchema],
  },
  { timestamps: true }
);

export const Route = model<IRoute>("Route", routeSchema);

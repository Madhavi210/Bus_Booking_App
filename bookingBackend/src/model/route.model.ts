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
  timing: {
    type: Date,
    required: true,
  },
});

const routeSchema = new Schema<IRoute>(
  {
    totalDistance: {
      type: Number,
      required: true,
    },
    stations: [stationSchema],
  },
  { timestamps: true }
);

export const Route = model<IRoute>("Route", routeSchema);

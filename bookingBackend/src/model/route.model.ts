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
  stationNumber: {
    type: Number,
    required: true,
  }
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

routeSchema.pre('save', function (next) {
  if (this.isModified('stations')) {
    this.stations.forEach((station, index) => {
      station.stationNumber = index + 1; // Assign stationNumber starting from 1
    });
  }
  next();
});

export const Route = model<IRoute>("Route", routeSchema);

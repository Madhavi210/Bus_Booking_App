import { ClientSession, PipelineStage } from "mongoose";
import { Bus } from "../model/bus.model";
import { Route } from "../model/route.model";
import AppError from "../utils/errorHandler";
import StatusConstants from "../constant/statusConstant";
import IBus from "../interface/bus.interface";
import { Types } from "mongoose";
import { Request, Response } from "express";
import moment from "moment";

export default class BusService {
  private static async getRouteIdByName(routeName: string): Promise<string> {
    const route = await Route.findOne({ routeName: routeName }).exec();
    console.log(route, "route");

    if (!route) {
      throw new AppError(
        "Route not found",
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    return route.id.toString();
  }

  private static async isBusScheduledAtSameTime(
    routeId: string,
    stopTimings: { station: string; timing: Date }[]
  ): Promise<boolean> {
    const overlappingBuses = await Bus.find({
      route: routeId,
      "stops.timing": { $in: stopTimings.map((stop) => stop.timing) },
    }).exec();
    return overlappingBuses.length > 0;
  }

  public static async createBus(
    busData: {
      busNumber: string;
      seatingCapacity: number;
      amenities: string[];
      routeName: string;
      stops: { station: string; timing: Date }[];
      busType: string;
      seatsLayout?: string;
      rows?: number;
      columns?: number;
      date: Date;
    },
    session: ClientSession
  ): Promise<IBus> {
    const {
      routeName,
      stops,
      seatsLayout = "2x2",
      rows,
      columns,
      date,
    } = busData;

    // Fetch route ID based on route name
    const route = await Route.findOne({ routeName: routeName }).session(
      session
    );
    console.log(route, routeName, "route");
    
    if (!route) {
      throw new AppError(
        "Route not found",
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const routeId = route.id.toString();

    // Validate stops
    const routeStations = route.stations.map((station) => station.name);
    for (const stop of stops) {
      if (!routeStations.includes(stop.station)) {
        throw new AppError(
          "Invalid stop station name",
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }
    }

    // Check for schedule conflicts
    if (await this.isBusScheduledAtSameTime(routeId, stops)) {
      throw new AppError(
        "A bus is already scheduled at the same time on this route.",
        StatusConstants.CONFLICT.httpStatusCode
      );
    }

    // Validate seating layout
    if (!["2x2", "2x1", "1x1", "3x2"].includes(seatsLayout)) {
      throw new AppError(
        "Invalid seat layout",
        StatusConstants.BAD_REQUEST.httpStatusCode
      );
    }

    // Validate rows and columns
    if (rows !== undefined && columns !== undefined) {
      if (typeof rows !== "number" || typeof columns !== "number") {
        throw new AppError(
          "Rows and columns must be numbers",
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }
    }

    // Check for existing bus
    const existingBus = await Bus.findOne({ busNumber: String }).session(
      session
    );
    if (existingBus) {
      throw new AppError(
        StatusConstants.DUPLICATE_KEY_VALUE.body.message,
        StatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode
      );
    }

    // Generate seats array
    const seats = Array.from({ length: busData.seatingCapacity }, (_, i) => ({
      seatNumber: i + 1,
      isBooked: false,
      bookingDate: null,
      isSingleLady: false,
    }));

    // Create and save the new bus
    const newBus = new Bus({
      ...busData,
      route: routeId,
      seats,
      date,
    });

    return await newBus.save({ session });
  }


  public static async getBusById(id: string): Promise<IBus | null> {
    return Bus.findById(id).exec();
  }

  public static async getAllBuses(req: Request): Promise<any> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const startingS = req.query.startingStop as string;
    const endingS = req.query.endingStop as string;
    const dbDate = req.query.date as string;

    const startingStop = startingS?.trim().toLowerCase();
    const endingStop = endingS?.trim().toLowerCase();

    const dateStart = moment.utc(dbDate).startOf("day").toDate();
    const dateEnd = moment.utc(dbDate).endOf("day").toDate();

    if (!startingStop || !endingStop || !dbDate) {
      const buses = await Bus.find()
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 })
        .exec();
      const totalBuses = await Bus.countDocuments().exec();
      return { buses, totalBuses };
      // throw console.error();
    }

    // Convert the date string to a Date object for querying
    const pipeline: PipelineStage[] = [
      {
        $match: {
          date: {
            $gte: dateStart,
            $lt: dateEnd,
          },
          stops: {
            $all: [
              { $elemMatch: { station: startingStop } },
              { $elemMatch: { station: endingStop } },
            ],
          },
        },
      },
      {
        $addFields: {
          startingStopIndex: {
            $indexOfArray: ["$stops.station", startingStop],
          },
          endingStopIndex: {
            $indexOfArray: ["$stops.station", endingStop],
          },
        },
      },
      {
        $match: {
          startingStopIndex: { $ne: -1 },
          endingStopIndex: { $ne: -1 },
          $expr: {
            $lt: ["$startingStopIndex", "$endingStopIndex"],
          },
        },
      },
      { $skip: skip },
      { $limit: limit },
      { $sort: { date: -1 } },
    ];

    const buses = await Bus.aggregate(pipeline).exec();

    // Count documents for totalBuses
    const totalBuses = await Bus.countDocuments({
      date: { $gte: dateStart, $lt: dateEnd },
      stops: { $elemMatch: { station: { $in: [startingStop, endingStop] } } },
    }).exec();

    return { buses, totalBuses };
  }

  public static async updateBus(
    id: string,
    updates: Partial<IBus> & {
      routeName?: string;
      stops?: { station: string; timing: Date }[];
    },
    session: ClientSession
  ): Promise<IBus | null> {
    const existingBus = await Bus.findById(id).session(session);
    if (!existingBus) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }

    const { routeName, stops, seatsLayout, rows, columns } = updates;

    if (routeName) {
      const routeId = await this.getRouteIdByName(routeName);
      updates.route = new Types.ObjectId(routeId); // Convert to ObjectId type
    }

    if (stops) {
      const route = await Route.findById(existingBus.route).exec();
      if (!route) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }

      const routeStations = route.stations.map((station) => station.name);
      for (const stop of stops) {
        if (!routeStations.includes(stop.station)) {
          throw new AppError(
            "Invalid stop station name",
            StatusConstants.BAD_REQUEST.httpStatusCode
          );
        }
      }

      if (
        await this.isBusScheduledAtSameTime(existingBus.route.toString(), stops)
      ) {
        throw new AppError(
          "A bus is already scheduled at the same time on this route.",
          StatusConstants.CONFLICT.httpStatusCode
        );
      }
    }

    if (seatsLayout) {
      if (!["2x2", "2x1", "1x1", "3x2"].includes(seatsLayout)) {
        throw new AppError(
          "Invalid seat layout",
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }
    }

    if (rows !== undefined && columns !== undefined) {
      if (typeof rows !== "number" || typeof columns !== "number") {
        throw new AppError(
          "Rows and columns must be numbers",
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }
    }

    const updatedBus = await Bus.findByIdAndUpdate(id, updates, {
      new: true,
      session,
    }).exec();
    return updatedBus ? updatedBus.toObject() : null;
  }

  public static async deleteBus(
    id: string,
    session: ClientSession
  ): Promise<void> {
    const bus = await Bus.findByIdAndDelete(id).session(session).exec();
    if (!bus) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
  }

  public static async searchBuses(
    fromStation: string,
    toStation: string,
    date: Date,
    sortBy: string = "departureTime",
    sortOrder: "asc" | "desc" = "asc",
    page: number = 1,
    limit: number = 10
  ): Promise<{ buses: any[]; total: number }> {
    const buses = await Bus.aggregate([
      {
        $match: {
          stops: {
            $elemMatch: {
              station: fromStation,
              timing: { $gte: new Date(date) },
            },
          },
          date: new Date(date), // Ensure the date is matched correctly
        },
      },
      {
        $lookup: {
          from: "routes",
          localField: "route",
          foreignField: "_id",
          as: "routeDetails",
        },
      },
      {
        $unwind: "$routeDetails",
      },
      {
        $match: {
          "routeDetails.stations.name": toStation,
        },
      },
      {
        $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    const total = await Bus.countDocuments({
      stops: {
        $elemMatch: {
          station: fromStation,
          timing: { $gte: new Date(date) },
        },
      },
      date: new Date(date),
    });

    return { buses, total };
  }
}

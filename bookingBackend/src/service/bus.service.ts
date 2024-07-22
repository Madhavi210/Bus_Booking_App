import { ClientSession } from 'mongoose';
import { Bus } from '../model/bus.model';
import { Route } from '../model/route.model';
import AppError from '../utils/errorHandler';
import StatusConstants from '../constant/statusConstant';
import IBus  from '../interface/bus.interface';

export default class BusService {

  private static async isBusScheduledAtSameTime(
    route: string,
    stopTimings: { station: string; timing: Date }[]
  ): Promise<boolean> {
    const overlappingBuses = await Bus.find({
      route,
      'stops.timing': { $in: stopTimings.map(stop => stop.timing) }
    }).exec();

    return overlappingBuses.length > 0;
  }

  public static async createBus(
    busData: Partial<IBus> & { route: string; stops: { station: string; timing: Date }[] },
    session: ClientSession
  ): Promise<IBus> {
    const { route: routeId, stops } = busData;

    const route = await Route.findById(routeId).exec();
    if (!route) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }

    const routeStations = route.stations.map(station => station.name);
    for (const stop of stops) {
      if (!routeStations.includes(stop.station)) {
        throw new AppError(
          'Invalid stop station name',
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }
    }

    if (await this.isBusScheduledAtSameTime(routeId.toString(), stops)) {
      throw new AppError(
        "A bus is already scheduled at the same time on this route.",
        StatusConstants.CONFLICT.httpStatusCode
      );
    }

    const { busNumber } = busData;
    const existingBus = await Bus.findOne({ busNumber }).session(session);
    if (existingBus) {
      throw new AppError(
        StatusConstants.DUPLICATE_KEY_VALUE.body.message,
        StatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode
      );
    }

    const newBus = new Bus({
      ...busData,
      route: routeId
    });

    await newBus.save({ session });
    return newBus.toObject();
  }

  public static async getBusById(id: string): Promise<IBus | null> {
    return Bus.findById(id).exec();
  }

  public static async getAllBuses(): Promise<{ buses: IBus[], totalBuses: number }> {
    const buses = await Bus.find().exec();
    const totalBuses = await Bus.countDocuments().exec();
    return { buses, totalBuses };
  }

  public static async updateBus(
    id: string,
    updates: Partial<IBus> & { stops?: { station: string; timing: Date }[] },
    session: ClientSession
  ): Promise<IBus | null> {
    const existingBus = await Bus.findById(id).session(session);
    if (!existingBus) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }

    const { stops } = updates;

    if (stops) {
      const route = await Route.findById(existingBus.route).exec();
      if (!route) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }

      const routeStations = route.stations.map(station => station.name);
      for (const stop of stops) {
        if (!routeStations.includes(stop.station)) {
          throw new AppError(
            'Invalid stop station name',
            StatusConstants.BAD_REQUEST.httpStatusCode
          );
        }
      }

      if (await this.isBusScheduledAtSameTime(existingBus.route.toString(), stops)) {
        throw new AppError(
          "A bus is already scheduled at the same time on this route.",
          StatusConstants.CONFLICT.httpStatusCode
        );
      }
    }

    const updatedBus = await Bus.findByIdAndUpdate(id, updates, { new: true, session }).exec();
    return updatedBus ? updatedBus.toObject() : null;
  }

  public static async deleteBus(id: string, session: ClientSession): Promise<void> {
    const bus = await Bus.findByIdAndDelete(id).session(session).exec();
    if (!bus) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
  }



  
}

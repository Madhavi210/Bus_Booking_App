import { ClientSession } from 'mongoose';
import { Route } from '../model/route.model';
import IRoute from '../interface/route.interface';
import AppError from '../utils/errorHandler';
import StatusConstants from '../constant/statusConstant';

export default class RouteService {
  public static async createRoute(
    routeName: string,
    stations: IRoute['stations'],
    session: ClientSession
  ): Promise<IRoute> {
    const existingRoute = await Route.findOne({ routeName }).session(session);
    if (existingRoute) {
      throw new AppError(
        StatusConstants.DUPLICATE_KEY_VALUE.body.message,
        StatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode
      );
    }

    const newRoute = new Route({ routeName, stations });
    
    await newRoute.save({ session });
    return newRoute.toObject();
  }

  public static async getRouteById(id: string): Promise<IRoute | null> {
    return Route.findById(id).exec();
  }

  public static async getAllRoutes(): Promise<{ routes: IRoute[], totalRoutes: number }> {
    const routes = await Route.find().exec();
    const totalRoutes = await Route.countDocuments().exec();
    return { routes, totalRoutes };
  }

  public static async deleteRoute(id: string, session: ClientSession): Promise<void> {
    const route = await Route.findByIdAndDelete(id).session(session).exec();
    if (!route) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
  }

  public static async updateRoute(
    id: string,
    updates: Partial<IRoute>,
    session: ClientSession
  ): Promise<IRoute | null> {
    const existingRoute = await Route.findById(id).session(session);
    if (!existingRoute) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }

    const updatedRoute = await Route.findByIdAndUpdate(id, updates, { new: true, session }).exec();
    return updatedRoute ? updatedRoute.toObject() : null;
  }
}

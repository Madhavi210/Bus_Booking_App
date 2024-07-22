import { ClientSession } from 'mongoose';
import { Route } from '../model/route.model';
import IRoute from '../interface/route.interface';
import AppError from '../utils/errorHandler';
import StatusConstants from '../constant/statusConstant';

export default class RouteService {
    public static async createRoute(
        totalDistance: number,
        stations: Array<{ name: string, distanceFromPrevious: number }>,
        session: ClientSession
    ): Promise<IRoute> {
        const newRoute = new Route({
            totalDistance,
            stations
        });

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

    public static async updateRoute(
        id: string,
        updates: Partial<IRoute>,
        session: ClientSession
    ): Promise<IRoute | null> {
        const route = await Route.findByIdAndUpdate(id, updates, { new: true, session }).exec();
        if (!route) {
            throw new AppError(
                StatusConstants.NOT_FOUND.body.message,
                StatusConstants.NOT_FOUND.httpStatusCode
            );
        }
        return route.toObject();
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
}

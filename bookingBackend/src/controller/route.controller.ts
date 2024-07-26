import { Request, Response, NextFunction } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import RouteService from '../service/route.service';
import AppError from '../utils/errorHandler';
import StatusConstants from '../constant/statusConstant';
import { StatusCode } from '../enum/statusCode';
import { logger } from '../utils/logger';

export default class RouteController {
  public static async createRoute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { routeName, stations } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newRoute = await RouteService.createRoute(routeName, stations, session);
      
      await session.commitTransaction();
      session.endSession();
      logger.info('API post/api/route hit successfully');
      res.status(StatusCode.CREATED).json(newRoute);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  public static async getRouteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const routeId = req.params.id;
    try {
      const route = await RouteService.getRouteById(routeId);
      if (!route) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      logger.info('API get/api/route/:id hit successfully');
      res.status(StatusCode.OK).json(route);
    } catch (error) {
      next(error);
    }
  }

  public static async getAllRoutes(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { routes, totalRoutes } = await RouteService.getAllRoutes();
      logger.info('API get/api/route hit successfully');
      res.status(StatusCode.OK).json({ routes, totalRoutes });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteRoute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const routeId = req.params.id;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await RouteService.deleteRoute(routeId, session);
      await session.commitTransaction();
      session.endSession();
      logger.info('API delete/api/route/:id hit successfully');
      res.status(StatusCode.NO_CONTENT).send();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  public static async updateRoute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const routeId = req.params.id;
    const updates = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedRoute = await RouteService.updateRoute(routeId, updates, session);
      if (!updatedRoute) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      await session.commitTransaction();
      session.endSession();
      logger.info('API put/api/route/:id hit successfully');
      res.status(StatusCode.OK).json(updatedRoute);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
}

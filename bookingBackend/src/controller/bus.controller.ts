import { Request, Response, NextFunction } from "express";
import BusService from "../service/bus.service";
import AppError from "../utils/errorHandler";
import StatusConstants from "../constant/statusConstant";
import mongoose from "mongoose";
import { Bus } from "../model/bus.model";
import { logger } from "../utils/logger";
export default class BusController {
  public static async createBus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const busData = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newBus = await BusService.createBus(busData, session);
      await session.commitTransaction();
      session.endSession();
      logger.info('API post/api/bus hit successfully');
      res.status(StatusConstants.CREATED.httpStatusCode).json({
        status: 'success',
        data: newBus,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  public static async getBusById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const busId = req.params.id;
    try {
      const bus = await BusService.getBusById(busId);
      if (!bus) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      res.status(StatusConstants.OK.httpStatusCode).json({
        status: 'success',
        data: bus,
      });
    } catch (error) {
      next(error);
    }
  }

    public static async getAllBuses(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
          const { buses, totalBuses } = await BusService.getAllBuses(req);          
          res.status(200).json({
              success: true,
              data: {
                  buses,
                  totalBuses
              }
          });
      } catch (error) {
          next(error);  // Forward error to the error-handling middleware
      }
  }

  public static async updateBus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const busId = req.params.id;
    const updates = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedBus = await BusService.updateBus(busId, updates, session);
      if (!updatedBus) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      await session.commitTransaction();
      session.endSession();
      logger.info('API put/api/bus/:id hit successfully');
      res.status(StatusConstants.OK.httpStatusCode).json({
        status: 'success',
        data: updatedBus,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  public static async deleteBus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const busId = req.params.id;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await BusService.deleteBus(busId, session);
      await session.commitTransaction();
      session.endSession();
      logger.info('API delete/api/bus/:id hit successfully');
      res.status(StatusConstants.NO_CONTENT.httpStatusCode).send();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  public static async searchBuses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { fromStation, toStation, date, sortBy = "departureTime", sortOrder = "asc", page = 1, limit = 10 } = req.query;

    try {
      const { buses, total } = await BusService.searchBuses(
        fromStation as string,
        toStation as string,
        new Date(date as string),
        sortBy as string,
        sortOrder as "asc" | "desc",
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(StatusConstants.OK.httpStatusCode).json({ buses, total });
    } catch (error) {
      next(error);
    }
  }

}

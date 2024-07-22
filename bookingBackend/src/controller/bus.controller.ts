import { Request, Response, NextFunction } from "express";
import BusService from "../service/bus.service";
import AppError from "../utils/errorHandler";
import StatusConstants from "../constant/statusConstant";
import mongoose from "mongoose";

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
      res.status(StatusConstants.CREATED.httpStatusCode).json(newBus);
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
      res.status(StatusConstants.OK.httpStatusCode).json(bus);
    } catch (error) {
      next(error);
    }
  }

  public static async getAllBuses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { buses, totalBuses } = await BusService.getAllBuses();
      res.status(StatusConstants.OK.httpStatusCode).json({ buses, totalBuses });
    } catch (error) {
      next(error);
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
      res.status(StatusConstants.OK.httpStatusCode).json(updatedBus);
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
      res.status(StatusConstants.NO_CONTENT.httpStatusCode).send();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
}

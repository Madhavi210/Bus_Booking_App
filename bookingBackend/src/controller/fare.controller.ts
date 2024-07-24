import { Request, Response, NextFunction } from "express";
import FareService from "../service/fare.service";
import AppError from "../utils/errorHandler";
import StatusConstants from "../constant/statusConstant";
import { logger } from "../utils/logger";
export default class FareController {
  public static async getFare(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const routeId = req.params.routeId;
    try {
      const fare = await FareService.getFareByRoute(routeId);
      logger.info('API get/api/fare hit successfully');
      res.status(StatusConstants.OK.httpStatusCode).json(fare);
    } catch (error) {
      next(error);
    }
  }

  public static async setFare(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { routeId, baseFarePerKm, governmentTaxPercentage } = req.body;
    try {
      const fare = await FareService.setFare(
        routeId,
        baseFarePerKm,
        governmentTaxPercentage
      );
      logger.info('API post/api/fare/setfare hit successfully');
      res.status(StatusConstants.CREATED.httpStatusCode).json(fare);
    } catch (error) {
      next(error);
    }
  }

  public static calculateFare(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { distance, baseFarePerKm, governmentTaxPercentage } = req.body;
    try {
      const fare = FareService.calculateFare(
        distance,
        baseFarePerKm,
        governmentTaxPercentage
      );
      logger.info('API post/api/fare/calculate hit successfully');
      res.status(StatusConstants.OK.httpStatusCode).json({ fare });
    } catch (error) {
      next(error);
    }
  }

  public static calculateTotalFare(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { distance, baseFarePerKm, governmentTaxPercentage, paymentMethod } =
      req.body;
    try {
      const totalFare = FareService.calculateTotalFare(
        distance,
        baseFarePerKm,
        governmentTaxPercentage,
        paymentMethod
      );
      logger.info('API post/api/fare/clculateTotalfare hit successfully');
      res.status(StatusConstants.OK.httpStatusCode).json({ totalFare });
    } catch (error) {
      next(error);
    }
  }
}

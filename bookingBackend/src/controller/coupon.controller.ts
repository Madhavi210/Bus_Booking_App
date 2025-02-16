import { Request, Response, NextFunction } from "express";
import CouponService from "../service/coupon.service";
import AppError from "../utils/errorHandler";
import StatusConstants from "../constant/statusConstant";
import { logger } from "../utils/logger";

export default class CouponController {
  public static async createCoupon(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const couponData = req.body;
    try {
      const newCoupon = await CouponService.createCoupon(couponData);
      logger.info('Coupon created successfully', { couponData });
      res.status(StatusConstants.CREATED.httpStatusCode).json(newCoupon);
    } catch (error) {
      next(error);
    }
  }

  public static async getCouponByCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { code } = req.params;
    try {
      const coupon = await CouponService.getCouponByCode(code);
      if (!CouponService.isCouponValid(coupon)) {
        throw new AppError(
          "Coupon is not valid or has expired.",
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }
      logger.info('Coupon details retrieved successfully', { code });
      res.status(StatusConstants.OK.httpStatusCode).json(coupon);
    } catch (error) {
      next(error);
    }
  }

  public static async getAllCoupons(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coupons = await CouponService.getAllCoupons();
      logger.info('All coupons retrieved successfully');
      res.status(StatusConstants.OK.httpStatusCode).json(coupons);
    } catch (error) {
      next(error);
    }
  }

  public static async updateCoupon(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { code } = req.params;
    const updateData = req.body;
    try {
      const updatedCoupon = await CouponService.updateCoupon(code, updateData);
      logger.info('Coupon updated successfully', { code, updateData });
      res.status(StatusConstants.OK.httpStatusCode).json(updatedCoupon);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteCoupon(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { code } = req.params;
    try {
      await CouponService.deleteCoupon(code);
      logger.info('Coupon deleted successfully', { code });
      res.status(StatusConstants.NO_CONTENT.httpStatusCode).send();
    } catch (error) {
      next(error);
    }
  }

  public static async applyCoupon(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { code } = req.params;
    try {
      const result = await CouponService.applyCoupon(code);
      logger.info('Coupon applied successfully', { code });
      res.status(StatusConstants.OK.httpStatusCode).json(result);
    } catch (error) {
      next(error);
    }
  }

}

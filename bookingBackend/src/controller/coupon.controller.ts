import { Request, Response, NextFunction } from "express";
import CouponService from "../service/coupon.service";
import AppError from "../utils/errorHandler";
import StatusConstants from "../constant/statusConstant";

export default class CouponController {
  public static async createCoupon(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const couponData = req.body;
    try {
      const newCoupon = await CouponService.createCoupon(couponData);
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
      res.status(StatusConstants.NO_CONTENT.httpStatusCode).send();
    } catch (error) {
      next(error);
    }
  }
}

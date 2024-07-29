import { Coupon } from '../model/coupon.model';
import AppError from '../utils/errorHandler';
import StatusConstants from '../constant/statusConstant';

class CouponService {
  public static async createCoupon(couponData: any): Promise<any> {
    const { code, discountPercentage, validFrom, validTo, usageLimit = 0, usageCount = 0 } = couponData;

    const existingCoupon = await Coupon.findOne({ code }).exec();
    if (existingCoupon) {
      throw new AppError(
        StatusConstants.DUPLICATE_KEY_VALUE.body.message,
        StatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode
      );
    }

    const newCoupon = new Coupon({ code, discountPercentage, validFrom, validTo, usageLimit, usageCount });
    await newCoupon.save();
    return newCoupon;
  }

  public static async getCouponByCode(code: string): Promise<any> {
    const coupon = await Coupon.findOne({ code }).exec();
    if (!coupon) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    return coupon;
  }

  public static async getAllCoupons(): Promise<any> {
    const coupons = await Coupon.find().exec();
    return coupons;
  }

  public static async updateCoupon(code: string, updateData: any): Promise<any> {
    const coupon = await Coupon.findOneAndUpdate({ code }, updateData, { new: true }).exec();
    if (!coupon) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    return coupon;
  }

  public static async deleteCoupon(code: string): Promise<void> {
    const result = await Coupon.deleteOne({ code }).exec();
    if (result.deletedCount === 0) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
  }

  public static isCouponValid(coupon: any): boolean {
    const now = new Date();
    return now >= new Date(coupon.validFrom) && now <= new Date(coupon.validTo);
  }

  public static async applyCoupon(code: string): Promise<{ success: boolean, discount: number }> {
    const coupon = await this.getCouponByCode(code);

    if (!this.isCouponValid(coupon)) {
      throw new AppError(
        "Coupon is not valid or has expired.",
        StatusConstants.BAD_REQUEST.httpStatusCode
      );
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new AppError(
        "Coupon usage limit reached.",
        StatusConstants.BAD_REQUEST.httpStatusCode
      );
    }

    // Increment the usage count
    coupon.usageCount += 1;
    await coupon.save();

    return { success: true, discount: coupon.discountPercentage };
  }

  
}

export default CouponService;

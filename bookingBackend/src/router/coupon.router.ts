import express from 'express';
import CouponController from '../controller/coupon.controller';

export default class CouponRouter {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes() {
    this.router.post('/', CouponController.createCoupon);

    this.router.get('/:code', CouponController.getCouponByCode);

    this.router.put('/:code', CouponController.updateCoupon);

    this.router.delete('/:code', CouponController.deleteCoupon);

    this.router.get('/', CouponController.getAllCoupons);
  }

  public getRouter() {
    return this.router;
  }
}

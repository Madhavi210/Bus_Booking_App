import express from 'express';
import CouponController from '../controller/coupon.controller';
import Authentication from '../middeleware/authentication';
export default class CouponRouter {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes() {
    this.router.post('/', Authentication.authUser, Authentication.authAdmin, CouponController.createCoupon);

    this.router.get('/:code', CouponController.getCouponByCode);

    this.router.put('/:code',  Authentication.authUser, Authentication.authAdmin, CouponController.updateCoupon);

    this.router.delete('/:code',  Authentication.authUser, Authentication.authAdmin, CouponController.deleteCoupon);

    this.router.get('/', CouponController.getAllCoupons);

    this.router.post('/:code', CouponController.applyCoupon);
  }

  public getRouter() {
    return this.router;
  }
}

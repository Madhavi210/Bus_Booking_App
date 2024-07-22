import express from 'express';
import FareController from '../controller/fare.controller';

export default class FareRouter {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes() {
    this.router.get('/:routeId', FareController.getFare);

    this.router.post('/', FareController.setFare);

    this.router.post('/calculate-fare', FareController.calculateFare);

    this.router.post('/calculate-total-fare', FareController.calculateTotalFare);
  }

  public getRouter() {
    return this.router;
  }
}

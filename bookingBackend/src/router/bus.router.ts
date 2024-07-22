import express from 'express';
import BusController from '../controller/bus.controller';
import Authentication from '../middeleware/authentication';

export default class BusRouter {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes() {
    this.router.post('/',  BusController.createBus);

    this.router.get('/:id', BusController.getBusById);

    this.router.put('/:id', BusController.updateBus);

    this.router.delete('/:id', BusController.deleteBus);

    this.router.get('/', BusController.getAllBuses);

  }

  public getRouter() {
    return this.router;
  }
}

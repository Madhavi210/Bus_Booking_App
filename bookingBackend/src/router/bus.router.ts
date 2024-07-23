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
    this.router.post('/',  Authentication.authUser, Authentication.authAdmin, BusController.createBus);

    this.router.get('/:id', BusController.getBusById);

    this.router.put('/:id', Authentication.authUser, Authentication.authAdmin, BusController.updateBus);

    this.router.delete('/:id', Authentication.authUser, Authentication.authAdmin, BusController.deleteBus);

    this.router.get('/', BusController.getAllBuses);

    this.router.get("/search", BusController.searchBuses);


  }

  public getRouter() {
    return this.router;
  }
}

import express from 'express';
import RouteController from '../controller/route.controller';
import Authentication from '../middeleware/authentication';


export default class RouteRouter {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes() {
        this.router.post('/', Authentication.authUser, Authentication.authAdmin, RouteController.createRoute);

        this.router.get('/:id', RouteController.getRouteById);

        this.router.get('/', RouteController.getAllRoutes);

        this.router.put('/:id', Authentication.authUser, Authentication.authAdmin, RouteController.updateRoute);

        this.router.delete('/:id', Authentication.authUser, Authentication.authAdmin, RouteController.deleteRoute);
    }

    public getRouter() {
        return this.router;
    }
}

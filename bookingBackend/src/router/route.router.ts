import express from 'express';
import RouteController from '../controller/route.controller';

export default class RouteRouter {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes() {
        this.router.post('/', RouteController.createRoute);

        this.router.get('/:id', RouteController.getRouteById);

        this.router.get('/', RouteController.getAllRoutes);

        this.router.put('/:id', RouteController.updateRoute);

        this.router.delete('/:id', RouteController.deleteRoute);
    }

    public getRouter() {
        return this.router;
    }
}

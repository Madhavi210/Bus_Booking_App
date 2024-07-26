
import express from "express";
import Database from "./db/db";
import cors from "cors";
import errorHandlerMiddleware from "./handler/errorHandler";
import path, { dirname } from "path";
import UserRouter from "./router/user.router";
import RouteRouter from "./router/route.router";
import BusRouter from "./router/bus.router";
import FareRouter from "./router/fare.router";
import CouponRouter from "./router/coupon.router";
import BookingRouter from "./router/booking.router";
import ticketrouter from "./router/ticket.router";
import { logger } from "./utils/logger";
export default class App {
    private app: express.Application;

    constructor(){
        this.app = express();
        this.config();
        this.connect();
        this.routes();
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads') ));        
    }

    private connect(): void {
        new Database();
    }

    private routes(): void {
        const userRoute = new UserRouter().getRouter();
        const routeRoute = new RouteRouter().getRouter();
        const busRoute = new BusRouter().getRouter();
        const couponRoute = new CouponRouter().getRouter();
        const fareRoute = new FareRouter().getRouter();
        const bookingRoute = new BookingRouter().getRouter();

        this.app.use("/api/user", userRoute);
        this.app.use("/api/route", routeRoute);
        this.app.use("/api/bus", busRoute);
        this.app.use("/api/coupon", couponRoute);
        this.app.use("/api/fare", fareRoute);
        this.app.use("/api/book", bookingRoute);
        this.app.use("/api/ticket", ticketrouter);

        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads') ));        
        this.app.use(errorHandlerMiddleware);
    }

    public start(port: string | undefined): void {
        this.app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    }

}


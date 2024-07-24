import { Request, Response, NextFunction } from "express";
import BookingService from "../service/booking.service";
import AppError from "../utils/errorHandler";
import StatusConstants from "../constant/statusConstant";
import mongoose from "mongoose";
import { Bus } from "../model/bus.model";
import { logger } from "../utils/logger";
export default class BookingController {
  public static async createBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {
      userId,
      busId,
      routeId,
      fromStation,
      toStation,
      seatNumber,
      fare ,
      paymentType,
      paymentDetails,
      isSingleLady,
    } = req.body;

    if (!userId || !busId || !routeId) {
      throw res.status(StatusConstants.BAD_REQUEST.httpStatusCode).json({
        message: "userId, busId, and routeId are required fields.",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newBooking = await BookingService.createBooking(
        userId,
        busId,
        routeId,
        fromStation,
        toStation,
        seatNumber,
        fare ,
        paymentType,
        paymentDetails,
        isSingleLady,
        session
      );

      await session.commitTransaction();
      session.endSession();
      logger.info('API post/api/book hit successfully');
      res.status(StatusConstants.CREATED.httpStatusCode).json(newBooking);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error creating booking:", error);
      next(error);
    }
  }

  public static async getBookingById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const bookingId = req.params.id;
    try {
      const booking = await BookingService.getBookingById(bookingId);
      logger.info('API get/api/book/:id hit successfully');
      res.status(StatusConstants.OK.httpStatusCode).json(booking);
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      next(error);
    }
  }

  public static async getAllBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const bookings = await BookingService.getAllBookings();
      logger.info('API get/api/book hit successfully');
      res.status(StatusConstants.OK.httpStatusCode).json({ bookings });
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      next(error);
    }
  }

  public static async updateBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const bookingId = req.params.id;
    const updateData = req.body;

    try {
      const updatedBooking = await BookingService.updateBooking(
        bookingId,
        updateData
      );
      logger.info('API put/api/book/:id hit successfully');
      res.status(StatusConstants.OK.httpStatusCode).json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking:", error);
      next(error);
    }
  }

  public static async deleteBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const bookingId = req.params.id;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await BookingService.deleteBooking(bookingId, session);
      await session.commitTransaction();
      session.endSession();
      logger.info('API delete/api/book/:id hit successfully');
      res.status(StatusConstants.NO_CONTENT.httpStatusCode).send();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error deleting booking:", error);
      next(error);
    }
  }

  public static async getBookedSeats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const busId = req.params.id;

    if (!busId) {
      throw res
        .status(StatusConstants.BAD_REQUEST.httpStatusCode)
        .json({ message: "Bus ID is required" });
    }
    try {
      const bookedSeats = await BookingService.getBookedSeats(busId);
      res.status(StatusConstants.OK.httpStatusCode).json({ bookedSeats });
    } catch (error) {
      console.error("Error fetching booked seats:", error);
      next(error);
    }
  }
}

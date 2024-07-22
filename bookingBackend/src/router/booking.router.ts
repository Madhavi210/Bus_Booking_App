import express from 'express';
import BookingController from '../controller/booking.controller';

export default class BookingRouter {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes() {
    this.router.post('/', BookingController.createBooking);

    this.router.get('/:id', BookingController.getBookingById);

    this.router.get('/', BookingController.getAllBookings);

    this.router.put('/:id', BookingController.updateBooking);

    this.router.delete('/:id', BookingController.deleteBooking);

    this.router.get('/booked-seats/:id', BookingController.getBookedSeats);

  }

  public getRouter() {
    return this.router;
  }
}

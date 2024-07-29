import { ClientSession } from 'mongoose';
import { Booking } from '../model/booking.model';
import { Bus } from '../model/bus.model';
import { Route } from '../model/route.model';
import { User } from '../model/user.model';
import AppError from '../utils/errorHandler';
import StatusConstants from '../constant/statusConstant';
import IBooking from '../interface/booking.interface';
import mongoose from 'mongoose';

export default class BookingService {
  public static async createBooking(
    userName: string,
    email: string,
    mobileNumber: string,
    age: number,
    busId: string,
    routeId: string,
    fromStation: string,
    toStation: string,
    seatNumber: number,
    fare: number,
    paymentType: 'cash' | 'card' | 'upi',
    paymentDetails: { cardNumber?: string; upiId?: string; additionalCharges?: number },
    isSingleLady: boolean,
    session: ClientSession,
    passengerType?: 'child' | 'adult'
  ): Promise<any> {
    const bus = await Bus.findById(busId).session(session);
    if (!bus) {
      throw new AppError('Bus not found', StatusConstants.BAD_REQUEST.httpStatusCode);
    }
    
    const route = await Route.findById(routeId).session(session);
    if (!route) {
      throw new AppError('Route not found', StatusConstants.BAD_REQUEST.httpStatusCode);
    }

    if (fare < 0) {
      throw new AppError('Fare must be greater than 0', StatusConstants.BAD_REQUEST.httpStatusCode);
    }

    // Check if the seat is already booked
    const existingBooking = await Booking.findOne({
      bus: busId,
      route: routeId,
      fromStation,
      toStation,
      seatNumber,
      date: new Date().toISOString().split('T')[0], // Assuming bookings are per day
    }).session(session);

    if (existingBooking) {
      throw new AppError('Seat already booked', StatusConstants.BAD_REQUEST.httpStatusCode);
    }

    

    const seat = bus.seats.find(seat => seat.seatNumber === seatNumber);
    if (seat) {
      seat.isBooked = true;
      seat.bookingDate = new Date(); // Update booking date
      seat.isSingleLady = isSingleLady; // Update isSingleLady status
      await bus.save();
    }

    const newBooking: IBooking = new Booking({
      userName,
      email,
      mobileNumber,
      age,
      bus: busId,
      route: routeId,
      fromStation,
      toStation,
      seatNumber,
      fare,
      paymentType,
      paymentDetails,
      isSingleLady,
      passengerType,
      date: new Date().toISOString().split('T')[0], 
    });



    await newBooking.save({ session });

    return newBooking;
  }

  public static async getBookingById(bookingId: string): Promise<any> {
      const booking = await Booking.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },
        {
          $lookup: {
            from: 'buses',
            localField: 'bus',
            foreignField: '_id',
            as: 'bus',
          },
        },
        { $unwind: '$bus' },
        {
          $lookup: {
            from: 'routes',
            localField: 'route',
            foreignField: '_id',
            as: 'route',
          },
        },
        { $unwind: '$route' },
      ]);

      if (!booking || booking.length === 0) {
        throw new AppError('Booking not found', StatusConstants.NOT_FOUND.httpStatusCode);
      }

      return booking[0];
   
  }

  public static async getAllBookings(): Promise<any> {
      const bookings = await Booking.aggregate([
        {
          $lookup: {
            from: 'buses',
            localField: 'bus',
            foreignField: '_id',
            as: 'bus',
          },
        },
        { $unwind: '$bus' },
        {
          $lookup: {
            from: 'routes',
            localField: 'route',
            foreignField: '_id',
            as: 'route',
          },
        },
        { $unwind: '$route' },
      ]);

      return bookings;
    
  }

  public static async updateBooking(
    bookingId: string,
    updateData: Partial<IBooking>
  ): Promise<any> {

      const booking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true }).exec();

      if (!booking) {
        throw new AppError('Booking not found', StatusConstants.NOT_FOUND.httpStatusCode);
      }

      const updatedBooking = await Booking.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },
        {
          $lookup: {
            from: 'buses',
            localField: 'bus',
            foreignField: '_id',
            as: 'bus',
          },
        },
        { $unwind: '$bus' },
        {
          $lookup: {
            from: 'routes',
            localField: 'route',
            foreignField: '_id',
            as: 'route',
          },
        },
        { $unwind: '$route' },
      ]);

      if (!updatedBooking || updatedBooking.length === 0) {
        throw new AppError('Updated booking not found', StatusConstants.NOT_FOUND.httpStatusCode);
      }

      return updatedBooking[0];
    
  }

  public static async deleteBooking(bookingId: string, session: ClientSession): Promise<void> {
      const booking = await Booking.findById(bookingId).session(session);
      if (!booking) {
        throw new AppError('Booking not found', StatusConstants.NOT_FOUND.httpStatusCode);
      }

      const bus = await Bus.findById(booking.bus).session(session);
      if (bus) {
        const seat = bus.seats.find(seat => seat.seatNumber === booking.seatNumber);
        if (seat) {
          seat.isBooked = false;
          await bus.save({ session });
        }
      }

      await Booking.findByIdAndDelete(bookingId).session(session);
   
  }

  public static async getBookedSeats(busId: string): Promise<any> {
    console.log('Bus ID from service:', busId); 
  
    if (!busId) {
      throw new Error('Invalid Bus ID');
    }
  
      const bus = await Bus.findById(busId).select('seats').exec();
      console.log('Bus object from service:', bus); 
  
      if (!bus) {
        throw new Error('Bus not found');
      }
  
      const bookedSeats = bus.seats.filter(seat => seat.isBooked);
  
      return bookedSeats;
   
  }
}

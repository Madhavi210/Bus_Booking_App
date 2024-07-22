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
        userId: string,
        busId: string,
        routeId: string,
        fromStation: string,
        toStation: string,
        seatNumber: number,
        fare: 150,
        paymentType: 'cash' | 'card' | 'upi',
        paymentDetails: { transactionId?: string; additionalCharges?: number },
        isSingleLady: boolean,
        session: ClientSession
      ): Promise<any> {
        
          const user = await User.findById(userId).session(session);
          if (!user) throw new AppError(StatusConstants.NOT_FOUND.body.message, StatusConstants.NOT_FOUND.httpStatusCode);
    
          const bus = await Bus.findById(busId).session(session);
          if (!bus) throw new AppError(StatusConstants.NOT_FOUND.body.message, StatusConstants.NOT_FOUND.httpStatusCode);
    
          const route = await Route.findById(routeId).session(session);
          if (!route) throw new AppError(StatusConstants.NOT_FOUND.body.message, StatusConstants.NOT_FOUND.httpStatusCode);
    
          const seat = bus.seats.find(seat => seat.seatNumber === seatNumber);
          if (!seat || seat.isBooked) throw new AppError('Seat is not available or does not exist', StatusConstants.CONFLICT.httpStatusCode);
    
          seat.isBooked = true;
          await bus.save({ session });
    
          const booking = new Booking({
            user: userId,  
            bus: busId,
            route: routeId,
            fromStation,
            toStation,
            seatNumber,
            fare: 150,
            paymentType,
            paymentDetails,
            isSingleLady
          });
    
          await booking.save({ session });
          return booking.toObject();
       
      }

  public static async getBookingById(bookingId: string): Promise<any> {
    try {
      const booking = await Booking.findById(bookingId)
        .populate('user')
        .populate('bus')
        .populate('route')
        .exec();
      if (!booking) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      return booking.toObject();
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw error;
    }
  }

  public static async getAllBookings(): Promise<any> {
    try {
      const bookings = await Booking.find()
        .populate('user')
        .populate('bus')
        .populate('route')
        .exec();
      return bookings;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  }

  public static async updateBooking(
    bookingId: string,
    updateData: Partial<IBooking>
  ): Promise<any> {
    try {
      const booking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true })
        .populate('user')
        .populate('bus')
        .populate('route')
        .exec();
      if (!booking) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      return booking.toObject();
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  public static async deleteBooking(bookingId: string, session: ClientSession): Promise<void> {
    try {
      const booking = await Booking.findById(bookingId).session(session);
      if (!booking) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
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
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  public static async getBookedSeats(busId: string): Promise<any> {
    console.log('Bus ID from service:', busId); 
  
    if (!busId) {
      throw new Error('Invalid Bus ID');
    }
  
    try {
      const bus = await Bus.findById(busId).select('seats').exec();
      console.log('Bus object from service:', bus); 
  
      if (!bus) {
        throw new Error('Bus not found');
      }
  
      const bookedSeats = bus.seats.filter(seat => seat.isBooked);
  
      return bookedSeats;
    } catch (error) {
      console.error('Error in getBookedSeats service:', error);
      throw error; 
    }
  }
  

}

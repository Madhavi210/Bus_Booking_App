import { Document, Types } from 'mongoose';
import IRoute from './route.interface';
import IBooking from './booking.interface';

export interface ISeat extends Document {
  seatNumber: number;
  isBooked: boolean;
  bookingDate: Date;
  // booking?: Types.ObjectId | IBooking;
  // busId :  Types.ObjectId | IBus;
  isSingleLady: boolean;
}

export default interface IBus extends Document {
  busNumber: string;
  seatingCapacity: number;
  amenities: string[];
  route: Types.ObjectId | IRoute;
  stops: {
    station: string;
    timing: Date;
  }[];
  // totalTiming: number;
  seats: ISeat[];
  // seatId :  Types.ObjectId | ISeat;
  busType: 'Luxury', 'Sleeper';
  seatsLayout: string;
  rows: number;
  columns: number;
  createdAt?: Date;
  updatedAt?: Date;
}

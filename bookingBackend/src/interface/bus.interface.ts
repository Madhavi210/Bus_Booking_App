import { Document, Types } from 'mongoose';
import IRoute from './route.interface';
import IBooking from './booking.interface';

export interface ISeat extends Document {
  seatNumber: number;
  isBooked: boolean;
  booking?: Types.ObjectId | IBooking;
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
  totalTiming: number;
  seats: ISeat[];
}

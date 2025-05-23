import { Document, Schema } from 'mongoose';
import IUser from './user.interface';
import IBus from './bus.interface'; 
import IRoute from './route.interface'; 

export default interface IBooking extends Document {
  // user: Schema.Types.ObjectId;
  userName: string;
  email: string;
  mobileNumber: string;
  age: number;
  bus: Schema.Types.ObjectId;
  route: Schema.Types.ObjectId;
  fromStation: string;
  toStation: string;
  date: Date;
  seatNumber: number;
  fare: number;
  paymentType: 'cash' | 'card' | 'UPI';
  paymentDetails: {
    cardNumber?: string;
    upiId?: string;
    additionalCharges?: number;
  };
  isSingleLady: boolean;
  passengerType: 'child' | 'adult';
  createdAt?: Date;
  updatedAt?: Date;
}

import { Document, Schema } from 'mongoose';
import IUser from './user.interface';
import IBus from './bus.interface'; 
import IRoute from './route.interface'; 

export default interface IBooking extends Document {
  user: Schema.Types.ObjectId;
  bus: Schema.Types.ObjectId;
  route: Schema.Types.ObjectId;
  fromStation: string;
  toStation: string;
  seatNumber: number;
  fare: number;
  paymentType: 'cash' | 'card' | 'UPI';
  paymentDetails: {
    transactionId?: string;
    additionalCharges?: number;
  };
  isSingleLady: boolean;
  createdAt: Date;
}

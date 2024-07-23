import { Document, Types } from 'mongoose';
import IRoute from './route.interface';

export default interface IFare extends Document {
  route: Types.ObjectId | IRoute;
  baseFarePerKm: number;
  governmentTaxPercentage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

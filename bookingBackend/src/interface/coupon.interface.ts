import { Document } from 'mongoose';

export default interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  validFrom: Date;
  validTo: Date;
}

import { Document } from 'mongoose';

export interface IStation {
  name: string;
  distanceFromPrevious: number;
  // timing: Date;
}

export default interface IRoute extends Document {

  // totalDistance: number;
  routeName: string;
  stations: IStation[];
  createdAt?: Date;
  updatedAt?: Date;
}

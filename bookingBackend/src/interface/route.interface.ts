import { Document } from 'mongoose';

export interface IStation {
  name: string;
  distanceFromPrevious: number;
  // timing: Date;
  stationNumber:number;
}

export default interface IRoute extends Document {

  // totalDistance: number;
  routeName: string;
  stations: IStation[];
  createdAt?: Date;
  updatedAt?: Date;
}

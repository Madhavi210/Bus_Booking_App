import { Document } from 'mongoose';

export interface IStation {
  name: string;
  distanceFromPrevious: number;
}

export default interface IRoute extends Document {

  totalDistance: number;
  stations: IStation[];
}

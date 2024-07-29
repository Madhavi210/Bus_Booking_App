export interface IStation {
  name: string;
  timing?: string;
  distanceFromPrevious: number; // Distance from the previous station
  stationNumber :number;
}

export interface IRoute {
  _id: string;
  routeName: {
    type: string;
    trim: true,
  };
  stations: IStation[];
  createdAt: string; // Use ISO date string or Date type if supported
  updatedAt: string; // Use ISO date string or Date type if supported
}

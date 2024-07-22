export interface IStation {
  name: string;
  distanceFromPrevious: number; // Distance from the previous station
}

export interface IRoute {
  _id: string;
  routeId: string;
  totalDistance: number;
  stations: IStation[];
  createdAt: string; // Use ISO date string or Date type if supported
  updatedAt: string; // Use ISO date string or Date type if supported
}

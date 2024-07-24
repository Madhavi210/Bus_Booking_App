export interface ISeat {
  seatNumber: number;
  isBooked: boolean;
  booking?: string; // booking ID reference
  isSingleLady: boolean;
}


export interface IStop {
  station: string;
  departureTime: Date;
}

export interface IBus {
  _id: string;
  busNumber: string;
  seatingCapacity: number;
  amenities: string[];
  route: string; // Assuming this is a reference to the route
  stops: IStop[];
  seats: ISeat[];
  busType: 'Seater' | 'Sleeper';
  seatsLayout: string;
  rows: number;
  columns: number;
  date: Date; // Use ISO date string or Date type if supported
  createdAt: string; // Use ISO date string or Date type if supported
  updatedAt: string; // Use ISO date string or Date type if supported
}

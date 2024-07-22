export interface IFare {
  _id: string;
  routeId: string; // Assuming this is a reference to the route
  baseFarePerKm: number;
  governmentTaxPercentage: number;
  createdAt: string; // Use ISO date string or Date type if supported
  updatedAt: string; // Use ISO date string or Date type if supported
}

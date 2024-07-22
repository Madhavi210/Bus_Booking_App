export interface IBooking {
    _id: string;
    user: string;
    bus: string;
    route: string;
    fromStation: string;
    toStation: string;
    seatNumber: number;
    fare: number;
    paymentType: 'cash' | 'card' | 'upi';  
    paymentDetails?: { transactionId?: string; additionalCharges?: number };
    isSingleLady: boolean;
  }
  
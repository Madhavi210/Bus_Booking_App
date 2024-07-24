export interface IBooking {
    _id: string;
    user: string;
    bus: string;
    route: string;
    fromStation: string;
    toStation: string;
    date: Date;
    seatNumber: number;
    fare: number;
    paymentType: 'cash' | 'card' | 'upi';  
    paymentDetails?: { 
      cardNumber?: string; 
      upiId?: string;
      additionalCharges?: number 
    };
    isSingleLady: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
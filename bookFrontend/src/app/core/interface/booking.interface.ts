export interface IBooking {
    _id?: string;
    // user: string;
    userName: string,
    email: string,
    mobileNumber: string,
    age: number,
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
    passengerType: 'child' | 'adult';
    isSingleLady: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
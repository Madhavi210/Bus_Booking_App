export interface ICoupon {
  _id: string;
    code: string;
    discountPercentage: number;
    validFrom: Date;
    validTo: Date;
  }
  
export interface ICoupon {
  _id: string;
    code: string;
    discountPercentage: number;
    validFrom: Date;
    validTo: Date;
    usageLimit: number;
    usageCount: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
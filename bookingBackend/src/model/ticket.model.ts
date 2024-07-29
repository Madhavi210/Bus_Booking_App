import { Schema, model, Document } from 'mongoose';
import { Ticket } from '../interface/ticket.interface';

const ticketSchema = new Schema<Ticket>({
  bookingId: { type: String, required: true, unique: true ,trim: true, },
  userName: { type: String, required: true, trim: true, },
  email: { type: String, required: true , trim: true,},
  mobileNumber: { type: String, required: true , trim: true,},
  age: { type: Number, required: true,  },
  fromStation: { type: String, required: true, trim: true, },
  toStation: { type: String, required: true, trim: true, },
  seatNumber: { type: Number, required: true },
  isSingleLady: { type: Boolean, required: true },
  passengerType: { type: String, required: true, trim: true, },
  fare: { type: Number, required: true },
  paymentType: { type: String, required: true, trim: true, },
  busId: { type: String, required: true , trim: true,},
  pnrNumber: { type: String, required: true, trim: true, }
});

export const TicketModel = model<Ticket>('Ticket', ticketSchema);

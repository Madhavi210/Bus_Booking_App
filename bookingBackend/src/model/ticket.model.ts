import { Schema, model, Document } from 'mongoose';
import { Ticket } from '../interface/ticket.interface';

const ticketSchema = new Schema<Ticket>({
  bookingId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  age: { type: Number, required: true },
  fromStation: { type: String, required: true },
  toStation: { type: String, required: true },
  seatNumber: { type: Number, required: true },
  isSingleLady: { type: Boolean, required: true },
  passengerType: { type: String, required: true },
  fare: { type: Number, required: true },
  paymentType: { type: String, required: true },
  busId: { type: String, required: true },
  pnrNumber: { type: String, required: true }
});

export const TicketModel = model<Ticket>('Ticket', ticketSchema);

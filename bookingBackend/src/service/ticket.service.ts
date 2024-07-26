import { TicketModel } from '../model/ticket.model';
import { Ticket } from '../interface/ticket.interface';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export class TicketService {
  async createTicket(ticketData: Omit<Ticket, 'pnrNumber'>): Promise<Ticket> {
    // Generate a PNR number
    const pnrNumber = `G${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    logger.info(`Generated PNR number: ${pnrNumber}`);
    // Create a new ticket
    const ticket = new TicketModel({ ...ticketData, pnrNumber });

    // Save the ticket to the database
    await ticket.save();
    return ticket;
  }

  async getTicketByBookingId(bookingId: string): Promise<Ticket | null> {
    // Find the ticket by booking ID
    return TicketModel.findOne({ bookingId }).exec();
  }
}

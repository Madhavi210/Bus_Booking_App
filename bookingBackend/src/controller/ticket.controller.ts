import { Request, Response } from 'express';
import { TicketService } from '../service/ticket.service';

const ticketService = new TicketService();

export class TicketController {
  async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const ticketData = req.body;
      const ticket = await ticketService.createTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create ticket', error });
    }
  }

  async getTicket(req: Request, res: Response): Promise<void> {
    try {
      const  bookingId = req.params.id;
      const ticket = await ticketService.getTicketByBookingId(bookingId);
      if (ticket) {
        res.status(200).json(ticket);
      } else {
        res.status(404).json({ message: 'Ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve ticket', error });
    }
  }
}

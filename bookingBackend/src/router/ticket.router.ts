import { Router } from 'express';
import { TicketController } from '../controller/ticket.controller';

const ticketController = new TicketController();
const router = Router();

router.post('/', ticketController.createTicket);
router.get('/:id', ticketController.getTicket);

export default router;

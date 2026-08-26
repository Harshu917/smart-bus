import express from 'express';
import { createTicket, getTickets, getTicketById, validateTicket } from '../controllers/ticketController.js';

const router = express.Router();

router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.post('/:id/validate', validateTicket);

export default router;

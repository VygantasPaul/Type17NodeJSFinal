import express from 'express';
const router = express.Router();
import {
    ADD_TICKET,
    ALL_TICKETS,
    GET_TICKET_ID,
    BUY_TICKET_TO_USER,
    REMOVE_TICKET,
    REMOVE_TICKET_FROM_USER
} from '../controller/ticket.js'
import auth from '../middleware/auth.js'
import authTicket from '../middleware/authTicket.js'
import validation from '../middleware/validation.js'
import ticketSchema from '../validation/ticketSchema.js';

router.post('/', authTicket, validation(ticketSchema), ADD_TICKET)
router.get('/:id', auth, GET_TICKET_ID)

router.delete('/:id/', auth, REMOVE_TICKET)
router.get('/', auth, ALL_TICKETS)

router.post('/:id/buy', auth, BUY_TICKET_TO_USER)
router.delete('/:id/remove', auth, REMOVE_TICKET_FROM_USER)

export {
    GET_TICKET_ID,
    ADD_TICKET,
    BUY_TICKET_TO_USER,
    REMOVE_TICKET,
    REMOVE_TICKET_FROM_USER
}
export default router;


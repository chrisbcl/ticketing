import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest
} from '@chris-tickets/common';
import express from 'express';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/TicketUpdatedPublisher';
import { Ticket } from '../models/ticket';
import { natsClientManager } from '../nats-client-manager';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    validateRequest,
    async (req, res) => {
        const ticket = await Ticket.findById(req.params.id);
        const { title, price } = req.body;

        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket');
        }

        ticket.set({ title, price });
        await ticket.save();

        new TicketUpdatedPublisher(natsClientManager.client!).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });

        res.send(ticket);
    }
);

export { router as updateTicketRouter };

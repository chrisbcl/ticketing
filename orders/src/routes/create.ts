import { BadRequestError, NotFoundError, requireAuth, validateRequest } from '@chris-tickets/common';
import express from 'express';
import { body } from 'express-validator';
import { Order, OrderStatus } from '../models/order';
import { ParamsDictionary } from 'express-serve-static-core';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/OrderCreatedPublisher';
import { natsClientManager } from '../nats-client-manager';

interface OrderCreateBody {
    ticketId: string;
}

const router = express.Router();

router.post<ParamsDictionary, any, OrderCreateBody>(
    '/api/orders',
    requireAuth,
    body('ticketId').notEmpty().withMessage('ticketId must be provided'),
    validateRequest,
    async (req, res) => {
        const { ticketId } = req.body;

        // Find the ticket that the user is trying to order
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure that the ticket is not already reserved
        const isReserved = await ticket.isReserved();

        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }

        // Calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + parseInt(process.env.EXPIRATION_WINDOW_SECONDS!));

        // Build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        await order.save();

        // Publish an event that the order has been created
        new OrderCreatedPublisher(natsClientManager.client).publish({
            id: order.id,
            expiresAt: order.expiresAt.toISOString(),
            status: order.status,
            userId: order.userId,
            version: order.version,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price
            }
        });

        res.status(201).send(order);
    }
);

export { router as createOrderRouter };

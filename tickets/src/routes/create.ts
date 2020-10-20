import { requireAuth, validateRequest } from '@chris-tickets/common';
import express from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { body } from 'express-validator';
import { version } from 'mongoose';
import { TicketCreatedPublisher } from '../events/publishers/TicketCreatedPublisher';
import { Ticket, TicketAttrs } from '../models/ticket';
import { natsClientManager } from '../nats-client-manager';

const router = express.Router();

router.post<ParamsDictionary, any, TicketAttrs>(
    '/api/tickets',
    requireAuth,
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    validateRequest,
    async (req, res) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });

        await ticket.save();

        new TicketCreatedPublisher(natsClientManager.client!).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });

        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };

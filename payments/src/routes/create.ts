import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest
} from '@chris-tickets/common';
import express from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publishers/PaymentCreatedPublisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsClientManager } from '../nats-client-manager';
import { stripe } from '../stripe';

const router = express.Router();

interface PaymentCreateBody {
    token: string;
    orderId: string;
}

router.post<ParamsDictionary, any, PaymentCreateBody>(
    '/api/payments',
    requireAuth,
    body('token').notEmpty(),
    body('orderId').notEmpty(),
    validateRequest,
    async (req, res) => {
        const { orderId, token } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for a cancelled order');
        }

        const charge = await stripe.charges.create({
            currency: 'eur',
            amount: order.price * 100,
            source: token
        });

        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });

        await payment.save();

        new PaymentCreatedPublisher(natsClientManager.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };

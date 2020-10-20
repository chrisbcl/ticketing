import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@chris-tickets/common';
import express from 'express';
import { OrderCancelledPublisher } from '../events/publishers/OrderCancelledPublisher';
import { Order, OrderStatus } from '../models/order';
import { natsClientManager } from '../nats-client-manager';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Complete) {
        throw new BadRequestError('Order already completed');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // Publish an event saying an order was cancelled
    new OrderCancelledPublisher(natsClientManager.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });

    res.status(204).send(order);
});

export { router as deleteOrderRouter };

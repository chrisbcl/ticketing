import { natsClientManager } from '../../../nats-client-manager';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../OrderCancelledListener';
import { Order } from '../../../models/order';
import { OrderCancelledPayload, OrderStatus } from '@chris-tickets/common';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsClientManager.client);

    // Create an order
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 200,
        status: OrderStatus.Created,
        userId: '123',
        version: 0
    });

    await order.save();

    // Create a fake data event
    const data: OrderCancelledPayload = {
        version: order.version + 1,
        id: order.id,
        ticket: { id: mongoose.Types.ObjectId().toHexString() }
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, order };
};

it('finds, cancels and saves an order', async () => {
    const { order, data, listener, msg } = await setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    // Assert an order was cancelled
    const cancelledOrder = await Order.findById(order.id);

    expect(cancelledOrder).toBeDefined();
    expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
    expect(cancelledOrder!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    // Assert to make sure ack was called
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number ', async () => {
    const { msg, data, order, listener } = await setup();

    data.version = order.version + 2;

    try {
        // @ts-ignore
        await listener.onMessage(data, msg);
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled();
});

import { natsClientManager } from '../../../nats-client-manager';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../OrderCreatedListener';
import { OrderCreatedPayload, OrderStatus } from '@chris-tickets/common';
import { Order } from '../../../models/order';

const setup = () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsClientManager.client);

    // Create a fake data event
    const data: OrderCreatedPayload = {
        version: 0,
        id: mongoose.Types.ObjectId().toHexString(),
        ticket: { id: mongoose.Types.ObjectId().toHexString(), price: 200 },
        userId: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: '123'
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('creates and saves an order', async () => {
    const { data, listener, msg } = setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    // Assert an order was created
    const order = await Order.findById(data.id);

    expect(order).toBeDefined();
    expect(order!.status).toEqual(data.status);
    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { data, listener, msg } = setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    // Assert to make sure ack was called
    expect(msg.ack).toHaveBeenCalled();
});

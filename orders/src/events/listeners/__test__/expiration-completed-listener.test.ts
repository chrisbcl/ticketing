import { ExpirationCompletedPayload, OrderCancelledPayload, OrderStatus } from '@chris-tickets/common';
import { natsClientManager } from '../../../nats-client-manager';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompletedListener } from '../ExpirationCompletedListener';
import { Order } from '../../../models/order';

const setup = async (orderStatus: OrderStatus = OrderStatus.Created) => {
    // Create an instance of the listener
    const listener = new ExpirationCompletedListener(natsClientManager.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 90,
        version: 0
    });

    await ticket.save();

    // Create and save an order
    const order = Order.build({
        userId: mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        status: orderStatus,
        ticket
    });

    await order.save();

    // Create a fake data event
    const data: ExpirationCompletedPayload = {
        orderId: order.id
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, order };
};

it('does not cancel an order if the order was already complete', async () => {
    const { data, listener, msg, order } = await setup(OrderStatus.Complete);

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it('cancels an order', async () => {
    const { data, listener, msg, order } = await setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    // Assert an order was cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder).toBeDefined();
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('publishes an OrderCancelled event', async () => {
    const { data, listener, msg, order } = await setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    const eventData: OrderCancelledPayload = JSON.parse(
        (natsClientManager.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    // Assert to make sure ack was called
    expect(msg.ack).toHaveBeenCalled();
});

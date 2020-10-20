import { OrderCancelledPayload, OrderCreatedPayload, OrderStatus, TicketUpdatedPayload } from '@chris-tickets/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsClientManager } from '../../../nats-client-manager';
import { OrderCreatedListener } from '../OrderCreatedListener';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../OrderCancelledListener';

const setup = async () => {
    const orderId = mongoose.Types.ObjectId().toHexString();
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsClientManager.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20,
        userId: mongoose.Types.ObjectId().toHexString()
    });
    ticket.set({ orderId });
    await ticket.save();

    // Create the fake event data object
    const data: OrderCancelledPayload = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };

    // Create message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
};

it('updates the ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    // @ts-ignore
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toBeUndefined();
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // @ts-ignore
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, data, msg } = await setup();

    // @ts-ignore
    await listener.onMessage(data, msg);

    expect(natsClientManager.client.publish).toHaveBeenCalled();

    const ticketUpdatedData: TicketUpdatedPayload = JSON.parse(
        (natsClientManager.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(ticketUpdatedData.orderId).toBeUndefined();
});

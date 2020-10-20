import { OrderCreatedPayload, OrderStatus, TicketUpdatedPayload } from '@chris-tickets/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsClientManager } from '../../../nats-client-manager';
import { OrderCreatedListener } from '../OrderCreatedListener';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsClientManager.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20,
        userId: mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    // Create the fake event data object
    const data: OrderCreatedPayload = {
        id: mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        status: OrderStatus.Created,
        userId: ticket.userId,
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    // Create message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
};

it('sets the orderId of the ticket ', async () => {
    const { listener, data, msg, ticket } = await setup();

    // @ts-ignore
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
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

    expect(data.id).toEqual(ticketUpdatedData.orderId);
});

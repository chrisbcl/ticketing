import { TicketUpdatedPayload } from '@chris-tickets/common';
import { natsClientManager } from '../../../nats-client-manager';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../TicketUpdatedListener';

const setup = async () => {
    // Create an instance of the listener
    const listener = new TicketUpdatedListener(natsClientManager.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 90,
        version: 0
    });

    await ticket.save();

    // Create a fake data event
    const data: TicketUpdatedPayload = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'Movie concert',
        price: 200,
        userId: mongoose.Types.ObjectId().toHexString()
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
};

it('finds, updates and saves a ticket', async () => {
    const { ticket, data, listener, msg } = await setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    // Assert a ticket was updated
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
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
    const { msg, data, ticket, listener } = await setup();

    data.version = ticket.version + 2;

    try {
        // @ts-ignore
        await listener.onMessage(data, msg);
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled();
});

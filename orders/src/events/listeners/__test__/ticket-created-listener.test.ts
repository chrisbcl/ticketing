import { TicketCreatedPayload } from '@chris-tickets/common';
import { natsClientManager } from '../../../nats-client-manager';
import { TicketCreatedListener } from '../TicketCreatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = () => {
    // Create an instance of the listener
    const listener = new TicketCreatedListener(natsClientManager.client);

    // Create a fake data event
    const data: TicketCreatedPayload = {
        version: 0,
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 200,
        userId: mongoose.Types.ObjectId().toHexString()
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
    const { data, listener, msg } = setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    // Assert a ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { data, listener, msg } = setup();

    // Call the onMessage function with the data object + message object
    // @ts-ignore
    await listener.onMessage(data, msg);

    // Assert to make sure ack was called
    expect(msg.ack).toHaveBeenCalled();
});

import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket, TicketDocument } from '../../models/ticket';
import { signUp } from '../../test/utils';
import mongoose from 'mongoose';

const buildTicket = async (title: string) => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title,
        price: 20,
        version: 0
    });
    await ticket.save();

    return ticket;
};

const createOrder = async (userCookie: string[], ticketId: string) => {
    const response = await request(app).post('/api/orders').set('Cookie', userCookie).send({ ticketId }).expect(201);
    return response;
};

it('can only be accessed if the user is signed in', async () => {
    await request(app).get('/api/orders').send({}).expect(401);
});

it('fetches orders for a particular user', async () => {
    // Create 3 tickets
    const ticket1 = await buildTicket('concert #1');
    const ticket2 = await buildTicket('concert #2');
    const ticket3 = await buildTicket('concert #3');

    // Create 1 order as User #1
    const user1 = signUp();
    await createOrder(user1, ticket1.id);

    // Create 2 orders as User #2
    const user2 = signUp();
    const { body: order1 } = await createOrder(user2, ticket2.id);
    const { body: order2 } = await createOrder(user2, ticket3.id);

    // Make request to get requests from User #2
    const response = await request(app).get('/api/orders').set('Cookie', user2).send();

    // Make sure we only got the orders for the User #2
    expect(response.body).toHaveLength(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
});

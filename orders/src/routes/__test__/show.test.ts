import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signUp } from '../../test/utils';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
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

it('returns a not found error (404) when the order id is not found', async () => {
    const id = mongoose.Types.ObjectId();

    await request(app).get(`/api/orders/${id}`).set('Cookie', signUp()).expect(404);
});

it('returns a not authorized error (401) when the order is not associated with the current user', async () => {
    const ticket = await buildTicket();
    const user1 = signUp();
    const user2 = signUp();

    const { body: order } = await createOrder(user1, ticket.id);

    await request(app).get(`/api/orders/${order.id}`).set('Cookie', user2).expect(401);
});

it('fetches an order', async () => {
    const user = signUp();

    // Create a ticket
    const ticket = await buildTicket();

    // Make a request to build an order with the ticket
    const { body: order } = await createOrder(user, ticket.id);

    // Make a request to fetch the order
    const { body: fetchedOrder } = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

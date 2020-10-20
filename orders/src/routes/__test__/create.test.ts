import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signUp } from '../../test/utils';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsClientManager } from '../../nats-client-manager';

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

it('has a router handler listening to /api/orders for post resquests', async () => {
    const response = await request(app).post('/api/orders').send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/orders').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app).post('/api/orders').set('Cookie', signUp()).send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid ticket id is provided', async () => {
    await request(app).post('/api/orders').set('Cookie', signUp()).send({ ticketId: '' }).expect(400);
});

it('returns an error if the ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app).post('/api/orders').set('Cookie', signUp()).send({ ticketId }).expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = await buildTicket();

    const order = Order.build({
        userId: 'testId',
        ticket,
        expiresAt: new Date(),
        status: OrderStatus.Created
    });
    await order.save();

    await request(app).post('/api/orders').set('Cookie', signUp()).send({ ticketId: ticket.id }).expect(400);
});

it('reserves a ticket', async () => {
    const ticket = await buildTicket();

    const orderResponse = await createOrder(signUp(), ticket.id);

    const order = await Order.findById(orderResponse.body.id);

    expect(order).not.toBeNull();
    expect(order!.id).toEqual(orderResponse.body.id);
});

it('publishes an event when an order is created', async () => {
    const ticket = await buildTicket();

    await createOrder(signUp(), ticket.id);

    expect(natsClientManager.client.publish).toHaveBeenCalled();
});

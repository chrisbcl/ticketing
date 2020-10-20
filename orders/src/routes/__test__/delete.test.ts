import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signUp } from '../../test/utils';
import mongoose from 'mongoose';
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

it('returns a not found error (404) when the order id is not found', async () => {
    const id = mongoose.Types.ObjectId();

    await request(app).delete(`/api/orders/${id}`).set('Cookie', signUp()).expect(404);
});

it('returns a not authorized error (401) when the order is not associated with the current user', async () => {
    const ticket = await buildTicket();
    const user1 = signUp();
    const user2 = signUp();

    const { body: order } = await createOrder(user1, ticket.id);

    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user2).expect(401);
});

it('marks an order as cancelled', async () => {
    const user = signUp();

    // Create a Ticket
    const ticket = await buildTicket();

    // Make a request to create an Order
    const { body: order } = await createOrder(user, ticket.id);

    // Make a request to cancel the Order
    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

    // expectation to make sure the order is cancelled
    const cancelledOrder = await Order.findById(order.id);

    expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('publishes a order cancelled event', async () => {
    const ticket = await buildTicket();
    const user = signUp();

    const { body: order } = await createOrder(user, ticket.id);

    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

    expect(natsClientManager.client.publish).toHaveBeenCalledTimes(2);
});

import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signUp } from '../../test/utils';
import { natsClientManager } from '../../nats-client-manager';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket is not found', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signUp())
        .send({ title: 'Ticket Title', price: 20 })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).send({ title: 'Ticket Title', price: 20 }).expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const title = 'Title';
    const price = 20;

    const response = await request(app).post('/api/tickets').set('Cookie', signUp()).send({ title, price });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signUp())
        .send({ title: 'Title updated', price: 30 })
        .expect(401);

    const ticket = await request(app).get(`/api/tickets/${response.body.id}`).send();

    expect(ticket.body.title).toEqual(title);
    expect(ticket.body.price).toEqual(price);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = signUp();

    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'Title', price: 20 });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: '', price: 20 })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'Title', price: -20 })
        .expect(400);
});

it('updates a ticket when providing valid inputs', async () => {
    const originalTicket = { title: 'Title', price: 20 };
    const updateTicket = { title: 'Updated Title', price: 31 };
    const cookie = signUp();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: originalTicket.title, price: originalTicket.price });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send(updateTicket).expect(200);

    const ticket = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);

    expect(ticket.body.title).toEqual(updateTicket.title);
    expect(ticket.body.price).toEqual(updateTicket.price);
});

it('publishes an event', async () => {
    const originalTicket = { title: 'Title', price: 20 };
    const updateTicket = { title: 'Updated Title', price: 31 };
    const cookie = signUp();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: originalTicket.title, price: originalTicket.price });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send(updateTicket).expect(200);

    expect(natsClientManager.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
    const cookie = signUp();

    const { body: ticketResponse } = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'Concert', price: 20 })
        .expect(201);

    const ticket = await Ticket.findById(ticketResponse.id);
    ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });

    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${ticketResponse.id}`)
        .set('Cookie', cookie)
        .send({ title: 'Concert updated', price: 200 })
        .expect(400);
});

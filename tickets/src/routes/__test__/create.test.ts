import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsClientManager } from '../../nats-client-manager';
import { signUp } from '../../test/utils';

it('has a router handler listening to /api/tickets for post resquests', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app).post('/api/tickets').set('Cookie', signUp()).send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    await request(app).post('/api/tickets').set('Cookie', signUp()).send({ title: '', price: 10 }).expect(400);

    await request(app).post('/api/tickets').set('Cookie', signUp()).send({ price: 10 }).expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signUp())
        .send({ title: 'Ticket title', price: -10 })
        .expect(400);

    await request(app).post('/api/tickets').set('Cookie', signUp()).send({ title: 'Ticket title' }).expect(400);
});

it('creates a ticket with valid inputs', async () => {
    const title = 'Ticket title';
    const price = 20;
    const tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    await request(app).post('/api/tickets').set('Cookie', signUp()).send({ title, price }).expect(201);

    const ticketsAfter = await Ticket.find({});
    expect(ticketsAfter.length).toEqual(1);
    expect(ticketsAfter[0].title).toEqual(title);
    expect(ticketsAfter[0].price).toEqual(price);
});

it('publishes an event', async () => {
    const title = 'Ticket title';
    const price = 20;

    await request(app).post('/api/tickets').set('Cookie', signUp()).send({ title, price }).expect(201);

    expect(natsClientManager.client.publish).toHaveBeenCalled();
});

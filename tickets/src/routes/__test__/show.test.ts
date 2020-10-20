import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { signUp } from '../../test/utils';

it('returns a 404 if the ticket is not found', async () => {
    await request(app).get(`/api/tickets/${mongoose.Types.ObjectId().toHexString()}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
    const title = 'Concert';
    const price = 20;

    const response = await request(app).post('/api/tickets').set('Cookie', signUp()).send({ title, price }).expect(201);

    const ticket = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);

    expect(ticket.body.title).toEqual(title);
    expect(ticket.body.price).toEqual(price);
});

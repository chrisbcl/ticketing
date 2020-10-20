import request from 'supertest';
import { app } from '../../app';
import { signUp } from '../../test/utils';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@chris-tickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

const buildOrder = async (
    userId: string = mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus = OrderStatus.Created,
    price: number = 200
) => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price,
        status,
        userId,
        version: 0
    });
    await order.save();

    return order;
};

it('returns an 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', signUp())
        .send({ token: 'tok_visa', orderId: mongoose.Types.ObjectId().toHexString() })
        .expect(404);
});

it('returns an 401 when purchasing an order that does not belong to the user', async () => {
    const order = await buildOrder();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signUp())
        .send({ token: 'tok_visa', orderId: order.id })
        .expect(401);
});

it('returns an 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = await buildOrder(userId, OrderStatus.Cancelled);

    await request(app)
        .post('/api/payments')
        .set('Cookie', signUp(userId))
        .send({ token: 'tok_visa', orderId: order.id })
        .expect(400);
});

it('returns a 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = await buildOrder(userId, OrderStatus.Created, price);

    await request(app)
        .post('/api/payments')
        .set('Cookie', signUp(userId))
        .send({ token: 'tok_visa', orderId: order.id })
        .expect(201);

    const { data } = await stripe.charges.list({ limit: 50 });
    const charge = data.find((c) => c.amount === price * 100);

    expect(charge).toBeDefined();
    expect(charge!.currency).toEqual('eur');

    const payment = await Payment.findOne({ stripeId: charge!.id, orderId: order.id });
    expect(payment).not.toBeNull();
});

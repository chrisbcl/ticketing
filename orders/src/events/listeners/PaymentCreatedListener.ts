import { Listener, OrderStatus, PaymentCreatedEvent, PaymentCreatedPayload, Subject } from '@chris-tickets/common';
import { Message, Stan } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    protected subject: Subject.PaymentCreated;
    protected queueGroupName: string;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.PaymentCreated;
        this.queueGroupName = QUEUE_GROUP_NAME;
    }
    protected async onMessage(data: PaymentCreatedPayload, msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Complete });

        await order.save();

        msg.ack();
    }
}

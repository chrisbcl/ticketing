import { Listener, OrderCancelledEvent, OrderCancelledPayload, OrderStatus, Subject } from '@chris-tickets/common';
import { Message, Stan } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    protected subject: Subject.OrderCancelled;
    protected queueGroupName: string;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.OrderCancelled;
        this.queueGroupName = QUEUE_GROUP_NAME;
    }
    protected async onMessage(data: OrderCancelledPayload, msg: Message): Promise<void> {
        const { id, version } = data;

        const order = await Order.findByEvent({ id, version });

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled, version });

        await order.save();

        msg.ack();
    }
}

import { Listener, OrderCreatedEvent, OrderCreatedPayload, Subject } from '@chris-tickets/common';
import { Message, Stan } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    protected subject: Subject.OrderCreated;
    protected queueGroupName: string;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.OrderCreated;
        this.queueGroupName = QUEUE_GROUP_NAME;
    }
    protected async onMessage(data: OrderCreatedPayload, msg: Message): Promise<void> {
        const { id, version, status, userId, ticket } = data;

        const order = Order.build({
            id,
            version,
            status,
            userId,
            price: ticket.price
        });

        await order.save();

        msg.ack();
    }
}

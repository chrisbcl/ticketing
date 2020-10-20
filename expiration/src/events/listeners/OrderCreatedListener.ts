import { Listener, OrderCreatedEvent, OrderCreatedPayload, Subject } from '@chris-tickets/common';
import { Message, Stan } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    protected subject: Subject.OrderCreated;
    protected queueGroupName: string;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.OrderCreated;
        this.queueGroupName = QUEUE_GROUP_NAME;
        1111;
    }

    protected async onMessage(data: OrderCreatedPayload, msg: Message): Promise<void> {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`Waiting ${delay} miliseconds to process the job`);
        await expirationQueue.add({ orderId: data.id }, { delay });

        msg.ack();
    }
}

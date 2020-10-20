import { OrderCreatedEvent, Publisher, Subject } from '@chris-tickets/common';
import { Stan } from 'node-nats-streaming';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    protected subject: Subject.OrderCreated;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.OrderCreated;
    }
}

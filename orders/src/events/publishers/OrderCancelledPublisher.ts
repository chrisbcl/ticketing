import { OrderCancelledEvent, Publisher, Subject } from '@chris-tickets/common';
import { Stan } from 'node-nats-streaming';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    protected subject: Subject.OrderCancelled;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.OrderCancelled;
    }
}

import { PaymentCreatedEvent, Publisher, Subject } from '@chris-tickets/common';
import { Stan } from 'node-nats-streaming';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    protected subject: Subject.PaymentCreated;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.PaymentCreated;
    }
}

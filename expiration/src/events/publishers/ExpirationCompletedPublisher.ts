import { ExpirationCompletedEvent, Publisher, Subject } from '@chris-tickets/common';
import { Stan } from 'node-nats-streaming';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    protected subject: Subject.ExpirationCompleted;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.ExpirationCompleted;
    }
}

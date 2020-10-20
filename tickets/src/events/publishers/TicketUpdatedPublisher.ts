import { Publisher, Subject, TicketUpdatedEvent } from '@chris-tickets/common';
import { Stan } from 'node-nats-streaming';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    protected subject: Subject.TicketUpdated;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.TicketUpdated;
    }
}

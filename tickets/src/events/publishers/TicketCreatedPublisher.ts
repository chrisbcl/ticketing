import { Publisher, Subject, TicketCreatedEvent } from '@chris-tickets/common';
import { Stan } from 'node-nats-streaming';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    protected subject: Subject.TicketCreated;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.TicketCreated;
    }
}

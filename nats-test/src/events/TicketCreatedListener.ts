import { Stan, Message } from 'node-nats-streaming';
import { Listener, Subject, TicketCreatedEvent } from '@chris-tickets/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    protected readonly subject: Subject.TicketCreated;
    protected queueGroupName: string;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.TicketCreated;
        this.queueGroupName = 'payments-service';
    }

    protected onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!');
        console.log(data);

        msg.ack();
    }
}

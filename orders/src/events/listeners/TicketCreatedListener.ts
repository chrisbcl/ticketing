import { Listener, Subject, TicketCreatedEvent, TicketCreatedPayload } from '@chris-tickets/common';
import { Message, Stan } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    protected subject: Subject.TicketCreated;
    protected queueGroupName: string;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.TicketCreated;
        this.queueGroupName = QUEUE_GROUP_NAME;
    }

    protected async onMessage(data: TicketCreatedPayload, msg: Message): Promise<void> {
        const { id, title, price, version } = data;

        const ticket = Ticket.build({ id, title, price, version });
        await ticket.save();

        msg.ack();
    }
}

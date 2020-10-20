import { Listener, Subject, TicketUpdatedEvent, TicketUpdatedPayload } from '@chris-tickets/common';
import { Message, Stan } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    protected subject: Subject.TicketUpdated;
    protected queueGroupName: string;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.TicketUpdated;
        this.queueGroupName = QUEUE_GROUP_NAME;
    }

    protected async onMessage(data: TicketUpdatedPayload, msg: Message): Promise<void> {
        const { title, price, id, version } = data;

        const ticket = await Ticket.findByEvent({ id, version });

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({ title, price, version });

        await ticket.save();

        msg.ack();
    }
}

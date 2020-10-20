import { Listener, OrderCancelledEvent, OrderCancelledPayload, Subject } from '@chris-tickets/common';
import { Message, Stan } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    protected subject: Subject.OrderCancelled;
    protected queueGroupName: string;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.OrderCancelled;
        this.queueGroupName = QUEUE_GROUP_NAME;
    }

    protected async onMessage(data: OrderCancelledPayload, msg: Message): Promise<void> {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        // If no ticket is found throw error
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Set the orderId to undefined
        ticket.set({ orderId: undefined });

        // Save the ticket
        await ticket.save();

        // Publish an updated ticket event
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });

        // Ack the message
        msg.ack();
    }
}

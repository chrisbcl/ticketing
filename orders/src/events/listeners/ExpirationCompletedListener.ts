import {
    ExpirationCompletedEvent,
    ExpirationCompletedPayload,
    Listener,
    OrderStatus,
    Subject,
    TicketCreatedEvent,
    TicketCreatedPayload
} from '@chris-tickets/common';
import { Message, Stan } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsClientManager } from '../../nats-client-manager';
import { OrderCancelledPublisher } from '../publishers/OrderCancelledPublisher';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    protected subject: Subject.ExpirationCompleted;
    protected queueGroupName: string;

    constructor(client: Stan) {
        super(client);
        this.subject = Subject.ExpirationCompleted;
        this.queueGroupName = QUEUE_GROUP_NAME;
    }

    protected async onMessage(data: ExpirationCompletedPayload, msg: Message): Promise<void> {
        const { orderId } = data;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error(`Order ${orderId} not found`);
        }

        if (order.status === OrderStatus.Cancelled || order.status === OrderStatus.Complete) {
            msg.ack();
            return;
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        new OrderCancelledPublisher(natsClientManager.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
}

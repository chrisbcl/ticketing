import { OrderStatus } from '@chris-tickets/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TicketDocument } from './ticket';

export { OrderStatus };

// Describes the attributes that are required to create a new Order
export interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
}

// Describes the Order JSON format to be sent as the response
interface OrderResponse {
    id: string;
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
}

// Describes the properties that a Order Model has
interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attrs: OrderAttrs): OrderDocument;
}

// Describes the properties that a Order Document has
interface OrderDocument extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
    version: number;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }
    },
    {
        toJSON: {
            transform: (doc: OrderDocument): OrderResponse => ({
                id: doc.id,
                userId: doc.userId,
                status: doc.status,
                expiresAt: doc.expiresAt,
                ticket: doc.ticket
            })
        }
    }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (orderAttrs: OrderAttrs) => {
    return new Order(orderAttrs);
};

export const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

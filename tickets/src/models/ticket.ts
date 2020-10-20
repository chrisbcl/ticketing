import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Describes the attributes that are required to create a new Ticket
export interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// Describes the Ticket JSON format to be sent as the response
interface TicketResponse {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

// Describes the properties that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attrs: TicketAttrs): TicketDocument;
}

// Describes the properties that a Ticket Document has
interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        userId: {
            type: String,
            required: true
        },
        orderId: {
            type: String
        }
    },
    {
        toJSON: {
            transform: (doc: TicketDocument): TicketResponse => ({
                id: doc.id,
                title: doc.title,
                price: doc.price,
                userId: doc.userId,
                version: doc.version
            })
        }
    }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (ticketAttrs: TicketAttrs) => {
    return new Ticket(ticketAttrs);
};

export const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);

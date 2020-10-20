import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// Describes the attributes that are required to create a new Ticket
export interface TicketAttrs {
    id: string;
    title: string;
    price: number;
    version: number;
}

// Describes the Ticket JSON format to be sent as the response
interface TicketResponse {
    id: string;
    title: string;
    price: number;
    version: number;
}

// Describes the properties that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attrs: TicketAttrs): TicketDocument;
    findByEvent(event: { id: string; version: number }): Promise<TicketDocument | null>;
}

// Describes the properties that a Ticket Document has
export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
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
        }
    },
    {
        toJSON: {
            transform: (doc: TicketDocument): TicketResponse => ({
                id: doc.id,
                title: doc.title,
                price: doc.price,
                version: doc.version
            })
        }
    }
);

ticketSchema.set('versionKey', 'version');
//ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.pre('save', function (done) {
    // @ts-ignore
    this.$where = {
        version: this.get('version') - 1
    };

    done();
});

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
};

ticketSchema.statics.build = ({ id, ...rest }: TicketAttrs) => {
    return new Ticket({ _id: id, ...rest });
};

/* Query the orders database to find an order where the ticket is present
 * and his status is not cancelled. If we find an order from the query means
 * that the ticket is reserved
 */
ticketSchema.methods.isReserved = async function () {
    // the value of this equals the ticket
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [OrderStatus.Created, OrderStatus.Complete, OrderStatus.AwaitingPayment]
        }
    });

    return !!existingOrder;
};

export const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);

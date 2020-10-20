import { OrderStatus } from '@chris-tickets/common';
import mongoose from 'mongoose';

// Describes the attributes that are required to create a new Order
export interface OrderAttrs {
    id: string;
    version: number;
    status: OrderStatus;
    price: number;
    userId: string;
}

// Describes the Order JSON format to be sent as the response
interface OrderResponse {
    id: string;
    version: number;
    status: OrderStatus;
    price: number;
    userId: string;
}

// Describes the properties that a Order Model has
interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attrs: OrderAttrs): OrderDocument;
    findByEvent(event: { id: string; version: number }): Promise<OrderDocument | null>;
}

// Describes the properties that a Order Document has
interface OrderDocument extends mongoose.Document {
    version: number;
    status: OrderStatus;
    price: number;
    userId: string;
}

const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        userId: {
            type: String,
            required: true
        }
    },
    {
        toJSON: {
            transform: (doc: OrderDocument): OrderResponse => ({
                id: doc.id,
                price: doc.price,
                userId: doc.userId,
                version: doc.version,
                status: doc.status
            })
        }
    }
);

orderSchema.set('versionKey', 'version');

orderSchema.pre('save', function (done) {
    // @ts-ignore
    this.$where = {
        version: this.get('version') - 1
    };

    done();
});

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Order.findOne({
        _id: event.id,
        version: event.version - 1
    });
};

orderSchema.statics.build = ({ id, ...rest }: OrderAttrs) => {
    return new Order({ _id: id, ...rest });
};

export const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

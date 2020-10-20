import { OrderStatus } from '@chris-tickets/common';
import mongoose from 'mongoose';

// Describes the attributes that are required to create a new Payment
export interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

// Describes the Payment JSON format to be sent as the response
interface PaymentResponse {
    id: string;
    orderId: string;
    stripeId: string;
}

// Describes the properties that a Payment Model has
interface PaymentModel extends mongoose.Model<PaymentDocument> {
    build(attrs: PaymentAttrs): PaymentDocument;
}

// Describes the properties that a Payment Document has
interface PaymentDocument extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        stripeId: {
            type: String,
            required: true
        }
    },
    {
        toJSON: {
            transform: (doc: PaymentDocument): PaymentResponse => ({
                id: doc._id,
                orderId: doc.orderId,
                stripeId: doc.stripeId
            })
        }
    }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

export const Payment = mongoose.model<PaymentDocument, PaymentModel>('Payment', paymentSchema);

import { OrderStatus } from '@chris-tickets/common';

export interface Ticket {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
}

export interface Order {
    id: string;
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: Ticket;
}

export interface Payment {
    id: string;
    orderId: string;
    stripeId: string;
}

import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/TicketCreatedListener';
import { stringify } from 'querystring';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), { url: 'http://localhost:4222' });

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    111;

    new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

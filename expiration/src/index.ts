import { OrderCreatedListener } from './events/listeners/OrderCreatedListener';
import { natsClientManager } from './nats-client-manager';

const start = async () => {
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    try {
        await natsClientManager.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsClientManager.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        1;
        process.on('SIGINT', () => natsClientManager.client.close());
        process.on('SIGTERM', () => natsClientManager.client.close());

        new OrderCreatedListener(natsClientManager.client).listen();
    } catch (error) {
        console.log(error);
    }
};

start();

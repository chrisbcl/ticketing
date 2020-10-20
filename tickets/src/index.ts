import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/OrderCancelledListener';
import { OrderCreatedListener } from './events/listeners/OrderCreatedListener';
import { natsClientManager } from './nats-client-manager';

const port = process.env.PORT || 3000;

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

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

        process.on('SIGINT', () => natsClientManager.client.close());
        process.on('SIGTERM', () => natsClientManager.client.close());

        new OrderCreatedListener(natsClientManager.client).listen();
        new OrderCancelledListener(natsClientManager.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }

    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    });
};

start();

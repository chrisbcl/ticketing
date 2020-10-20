import Queue from 'bull';
import { ExpirationCompletedPublisher } from '../events/publishers/ExpirationCompletedPublisher';
import { natsClientManager } from '../nats-client-manager';

interface JobPayload {
    orderId: string;
}

export const expirationQueue = new Queue<JobPayload>('order:expiration', {
    redis: process.env.REDIS_HOST
});

expirationQueue.process(async (job) => {
    await new ExpirationCompletedPublisher(natsClientManager.client).publish({ orderId: job.data.orderId });
});

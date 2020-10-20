import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

jest.mock('../nats-client-manager');

process.env.STRIPE_KEY =
    'sk_test_51HcKKmH2t4SEoWmlYjV1AY6BpSVFngdUZoKRjH8mn6TN0awSbAa1vaTtj04Wfj0ut4gKgWnnVAMhF1PFFIPe7NJK00KMn9dbn9';

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfg';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

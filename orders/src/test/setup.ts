import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

jest.mock('../nats-client-manager');

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfg';
    process.env.EXPIRATION_WINDOW_SECONDS = '900';

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

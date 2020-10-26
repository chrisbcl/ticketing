import mongoose from 'mongoose';
import { app } from './app';

const port = process.env.PORT || 3000;

const start = async () => {
    console.log('starting......');

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
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

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, errHandler, currentUser } from '@chris-tickets/common';
import { createOrderRouter } from './routes/create';
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);
app.use(currentUser);

app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(createOrderRouter);
app.use(deleteOrderRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errHandler);

export { app };

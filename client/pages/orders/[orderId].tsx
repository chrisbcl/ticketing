import { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import { Order, Payment } from '../../interfaces/interfaces';
import { STRIPE_PUBLISHABLE_KEY } from '../../interfaces/keys';
import { AppGlobalProps } from '../_app';

interface OrderShowProps extends AppGlobalProps {
    order: Order;
}

const OrderShow = ({ order, currentUser }: OrderShowProps) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest<Payment>({
        method: 'post',
        url: '/api/payments',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const secondsLeft = new Date(order.expiresAt).getSeconds() - new Date().getSeconds();
            setTimeLeft(secondsLeft);
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    return (
        <div>
            <h1>{order.ticket.title}</h1>
            {timeLeft > 0 && (
                <div>
                    <div>Time left to pay: {timeLeft} seconds</div>
                    <StripeCheckout
                        token={({ id }) => doRequest({ token: id })}
                        stripeKey={STRIPE_PUBLISHABLE_KEY}
                        amount={order.ticket.price * 100}
                        email={currentUser.email}
                    />
                    {errors}
                </div>
            )}
            {timeLeft <= 0 && <div>Order has expired</div>}
        </div>
    );
};

OrderShow.getInitialProps = async (context: NextPageContext, client: AxiosInstance) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;

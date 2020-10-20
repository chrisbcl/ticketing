import { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';
import { Order, Ticket } from '../../interfaces/interfaces';

interface TicketShowProps {
    ticket: Ticket;
}

const TicketShow = ({ ticket }: TicketShowProps) => {
    const { doRequest, errors } = useRequest<Order>({
        method: 'post',
        url: '/api/orders',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });
    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>{ticket.price}</h4>
            {errors}
            <button className='btn btn-primary' onClick={() => doRequest()}>
                Purchase
            </button>
        </div>
    );
};

TicketShow.getInitialProps = async (context: NextPageContext, client: AxiosInstance) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);

    return { ticket: data };
};

export default TicketShow;

import { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import { Order } from '../../interfaces/interfaces';

interface OrderIndexProps {
    orders: Order[];
}

const OrderIndex = ({ orders }: OrderIndexProps) => {
    return (
        <div>
            <ul>
                {orders.map(({ id, ticket, status }) => (
                    <li key={id}>
                        {ticket.title} - {status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

OrderIndex.getInitialProps = async (context: NextPageContext, client: AxiosInstance) => {
    const { data } = await client.get('/api/orders');

    return { orders: data };
};

export default OrderIndex;

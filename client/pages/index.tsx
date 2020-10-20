import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import React from 'react';
import { buildClient } from '../api/build-client';
import { Ticket } from '../interfaces/interfaces';
import { AppGlobalProps } from './_app';

interface LandingPageProps extends AppGlobalProps {
    tickets: Ticket[];
}

const LandingPage = ({ tickets }: LandingPageProps) => {
    const ticketList = tickets?.map(({ id, title, price }) => (
        <tr key={id}>
            <td>{title}</td>
            <td>{price}</td>
            <td>
                <Link href='/tickets/[ticketId]' as={`/tickets/${id}`}>
                    <a>View</a>
                </Link>
            </td>
        </tr>
    ));

    return (
        <div>
            <h1>Tickets</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>{ticketList}</tbody>
            </table>
        </div>
    );
};

LandingPage.getInitialProps = async (context: NextPageContext, client: AxiosInstance) => {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
};

export default LandingPage;

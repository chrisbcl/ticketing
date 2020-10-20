import Router from 'next/router';
import { SyntheticEvent, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { Ticket } from '../../interfaces/interfaces';

const CreateTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const { doRequest, errors } = useRequest<Ticket>({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = (e: SyntheticEvent) => {
        e.preventDefault;

        doRequest();
    };

    const onPriceBlur = () => {
        const value = parseFloat(price);

        if (Number.isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    };

    return (
        <div>
            <h1>Create Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label>Title</label>
                    <input className='form-control' value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className='form-group'>
                    <label>Price</label>
                    <input
                        className='form-control'
                        type='number'
                        value={price}
                        onBlur={onPriceBlur}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                {errors}
                <button className='btn btn-primary'>Submit</button>
            </form>
        </div>
    );
};

export default CreateTicket;

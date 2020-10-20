import { FormEvent, useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/useRequest';

interface UserCredentialsFormProps {
    url: string;
    title: string;
    btnText: string;
}

const UserCredentialsForm = ({ url, title, btnText }: UserCredentialsFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url,
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>{title}</h1>
            <div className='form-group'>
                <label>Email address</label>
                <input className='form-control' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='form-group'>
                <label>Password</label>
                <input
                    className='form-control'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {errors}
            <button className='btn btn-primary'>{btnText}</button>
        </form>
    );
};

export default UserCredentialsForm;

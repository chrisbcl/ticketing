import 'bootstrap/dist/css/bootstrap.css';
import { buildClient } from '../api/build-client';
import { AppContext, AppProps } from 'next/app';
import Header from '../components/Header';
import { NextPageContext } from 'next';
import { AxiosInstance } from 'axios';
import { BaseContext } from 'next/dist/next-server/lib/utils';
import { ComponentType } from 'react';

export interface AppGlobalProps {
    currentUser: { id: string; email: string };
}

const AppComponent = ({ Component, pageProps, currentUser }: AppProps & AppGlobalProps) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <div className='container'>
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );
};

AppComponent.getInitialProps = async (appContext: AppContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};

    if (appContext.Component.getInitialProps) {
        // @ts-ignore
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }

    return {
        pageProps,
        ...data
    };
};

export default AppComponent;

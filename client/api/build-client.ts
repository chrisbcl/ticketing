import axios from 'axios';
import { NextPageContext } from 'next';

export const buildClient = ({ req }: NextPageContext) => {
    if (typeof window === 'undefined') {
        // we are on the server
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
            headers: req.headers
        });
    } else {
        // we are on the browser
        return axios.create({
            baseURL: '/'
        });
    }
};

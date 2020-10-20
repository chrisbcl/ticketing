import axios from 'axios';
import { ReactNode, useState } from 'react';
import ErrorList from '../components/ErrorList';

interface Request<T extends object> {
    url: string;
    method: string;
    body?: object;
    onSuccess?: (data: T) => void;
}

const useRequest = <T extends object = object>({ url, method, body = {}, onSuccess = () => undefined }: Request<T>) => {
    const [errors, setErrors] = useState<ReactNode>(null);

    const doRequest = async (props: object = {}): Promise<[null | T, null | ReactNode]> => {
        try {
            setErrors(null);
            const response = await axios[method](url, {
                ...body,
                ...props
            });

            onSuccess(response.data);

            return response.data;
        } catch (error) {
            setErrors(<ErrorList errors={error.response.data.errors} />);
        }
    };

    return {
        doRequest,
        errors
    };
};

export default useRequest;

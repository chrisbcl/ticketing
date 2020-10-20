interface ErrorsProps {
    errors: ErrorResponse[];
}

export interface ErrorResponse {
    message: string;
}

const ErrorList = ({ errors }: ErrorsProps) => {
    return (
        <div className='alert alert-danger'>
            <h4>Ops!</h4>
            <ul className='my-0'>
                {errors.map(({ message }) => (
                    <li key={message}>{message}</li>
                ))}
            </ul>
        </div>
    );
};

export default ErrorList;

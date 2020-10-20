import UserCredentialsForm from '../../components/UserCredentialsForm';

const Signin = () => {
    return <UserCredentialsForm url='/api/users/signin' title='Sign In' btnText='Sign In' />;
};

export default Signin;

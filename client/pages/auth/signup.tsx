import UserCredentialsForm from '../../components/UserCredentialsForm';

const Signup = () => {
    return <UserCredentialsForm url='/api/users/signup' title='Sign Up' btnText='Sign Up' />;
};

export default Signup;

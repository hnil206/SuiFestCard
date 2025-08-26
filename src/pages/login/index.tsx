import getAuthUrl from '@/api/auth/getAuthUrl';

const test = getAuthUrl();
console.log(test);
const Login = () => {
  return <div onClick={() => (window.location.href = test)}>Login</div>;
};

export default Login;

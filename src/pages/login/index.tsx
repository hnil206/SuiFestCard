import getAuthUrl from '@/api/auth/getAuthUrl';

const test = getAuthUrl();
console.log(test);
const Login = () => {
  return (
    <div>
      <div onClick={() => (window.location.href = test)}>Login</div>
      {/* <AvailableCard /> */}
    </div>
  );
};

export default Login;

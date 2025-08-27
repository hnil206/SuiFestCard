import { useState } from 'react';
import getAuthUrl from '@/api/auth/getAuthUrl';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to initiate login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div onClick={handleLogin} style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}>
        {isLoading ? 'Loading...' : 'Login with Twitter'}
      </div>
    </div>
  );
};

export default Login;

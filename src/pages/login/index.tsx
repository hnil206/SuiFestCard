import { useState } from 'react';
import getAuthUrl from '@/api/auth/getAuthUrl';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const authUrl = await getAuthUrl();

      // Safari-compatible redirect using window.open with _self target
      // This prevents Safari from blocking the redirect as a popup
      window.open(authUrl, '_self');
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

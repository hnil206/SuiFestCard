import { ReactNode, useState } from 'react';
import getAuthUrl from '@/api/auth/getAuthUrl';
import { useAuth } from '@/context/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoginLoading(true);
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to initiate login. Please try again.');
      setIsLoginLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: '20px',
          }}
        >
          <h2>Access Denied</h2>
          <p>Please login to access this page</p>
          <button
            onClick={handleLogin}
            disabled={isLoginLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: isLoginLoading ? '#ccc' : '#1da1f2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoginLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            {isLoginLoading ? 'Loading...' : 'Login with Twitter'}
          </button>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

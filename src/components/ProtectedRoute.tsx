import { ReactNode, useState } from 'react';
import getAuthUrl from '@/api/auth/getAuthUrl';
import { useAuth } from '@/context/useAuth';

import Button from './button';
import LandingBackground from './landing/LandingBackground';

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
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex flex-col overflow-x-clip">
          {/* Top section with login */}
          <div className="flex w-full flex-col-reverse items-center justify-center gap-8 pb-12 pt-8 md:flex-col md:pb-16 md:pt-12">
            <div className="flex w-full flex-col items-center justify-center px-5 md:px-0">
              <div className="w-full max-w-2xl pb-6 text-center text-xl font-medium leading-tight md:pb-12 lg:text-[40px]">
                <p>Log in to create your personalized</p>
                <p>#SuiFest Card</p>
              </div>

              <Button
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                }
                onClick={handleLogin}
                disabled={isLoginLoading}
              >
                {isLoginLoading ? 'Loading...' : <>Login with</>}
              </Button>
            </div>

            <LandingBackground />
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

import { ReactNode, useState } from 'react';
import getAuthUrl from '@/api/auth/getAuthUrl';
import { useAuth } from '@/context/useAuth';

import AvailableCard from './AvailableCard';

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
        <div className="flex min-h-screen bg-black text-white xxs:flex-col-reverse xxs:items-start xxs:justify-around xs:flex-col-reverse xs:items-start xs:justify-around sm:flex-col-reverse sm:items-start sm:justify-around md:flex-col md:justify-start lg:flex-col lg:justify-start">
          {/* Top section with login */}
          <div className="flex w-full flex-col items-center justify-center px-5 pb-16 pt-12">
            <div className="w-full max-w-2xl pb-6 text-center text-xl md:pb-16 lg:pb-16 lg:text-[40px]">
              <p className="font-normal leading-tight text-white">Log in to create your personalized</p>
              <p className="m-0 font-normal leading-tight text-white">#SuiFest2025 Card</p>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoginLoading}
              className={`flex w-full items-center justify-center gap-2.5 rounded-3xl border-0 bg-white py-3 text-lg font-medium text-black outline-none transition-all duration-200 ease-in-out hover:scale-105 hover:bg-gray-100 md:w-auto md:px-8 md:py-4 ${
                isLoginLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
              } `}
            >
              {isLoginLoading ? (
                'Loading...'
              ) : (
                <>
                  Login with
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Bottom section with full-width image */}
          <div className="pointer-events-none sticky left-0 top-0 z-0 flex w-full select-none items-start justify-center">
            <div className="absolute h-[250px] w-full xs:h-[375px] lg:h-[514px]">
              <img
                src="/bg.png"
                alt="Background"
                className="top-0 z-[-1] h-[250px] w-full object-cover xs:h-[375px] lg:h-[514px] lg:object-fill"
              />
              <div className="absolute inset-0 left-1/2 top-5 flex w-fit -translate-x-1/2 transform items-center justify-center overflow-hidden border-[4px] border-gray-500 xxs:h-[210px] xxs:-translate-y-2.5 xxs:rounded-[12px] xs:h-[305px] xs:translate-y-0.5 xs:rounded-[12px] sm:h-[310px] sm:-translate-y-1.5 sm:rounded-[12px] md:h-[320px] md:-translate-y-2 md:rounded-[22px] lg:h-[431px] lg:translate-y-[0.5px] lg:rounded-[27.75px]">
                <div className="h-full xxs:w-[145px] xs:w-[285px] sm:w-[285px] md:w-[210px] lg:w-[19.5vw]"></div>
                <AvailableCard className="xxs:max-w-[140px] xs:max-w-[215px] sm:max-w-[210px] md:w-[210px] md:max-w-[300px] lg:w-[20vw] lg:max-w-[565px]" />
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

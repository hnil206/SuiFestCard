import React, { ReactNode } from 'react';

import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-black font-diatype text-white">
      <Header />
      <main className="container relative z-10 mx-auto flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

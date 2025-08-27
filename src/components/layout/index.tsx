import React, { ReactNode } from 'react';

import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="container mx-auto flex-grow p-4">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

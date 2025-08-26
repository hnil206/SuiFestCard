import React, { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return <div className="min-h-screen">{children}</div>;
};

export default Layout;

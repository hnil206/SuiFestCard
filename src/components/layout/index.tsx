const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <main className="container mx-auto flex-grow p-4">{children}</main>
    </div>
  );
};

export default Layout;

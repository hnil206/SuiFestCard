import { createRootRoute, Outlet } from '@tanstack/react-router';

// components

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

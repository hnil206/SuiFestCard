import React from 'react';
import { Link } from '@tanstack/react-router';

const Home = () => {
  return (
    <div>
      HomePage
      <div>
        <Link
          to="/login"
          activeOptions={
            {
              // If the route points to the root of it's parent,
              // make sure it's only active if it's exact
              // exact: to === '.',
            }
          }
          preload="intent"
          className={`block px-3 py-2 text-blue-700`}
          // Make "active" links bold
          activeProps={{ className: `font-bold` }}
        >
          To Login Page
        </Link>
      </div>
    </div>
  );
};

export default Home;

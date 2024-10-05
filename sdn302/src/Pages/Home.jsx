// Home.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../Components/Home_components/Layout';

function Home() {
  return (
    <div>
      <Layout />
      <Outlet />
    </div>
  );
}

export default Home;

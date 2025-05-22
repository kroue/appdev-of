import React from 'react';
import Navbar from '../../src/components/Navbar'; 
import Footer from '../../src/components/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;

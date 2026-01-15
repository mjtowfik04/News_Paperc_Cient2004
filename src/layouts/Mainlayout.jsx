import React from 'react';
import Navber from './Navber';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar ফিক্সড উপরে */}
      <Navber />

      {/* মেইন কন্টেন্ট – Navbar-এর নিচে */}
      <main className="flex-1 pt-20"> {/* pt-20 দিয়ে Navbar-এর জন্য স্পেস */}
        <Outlet />
      </main>

      {/* Footer নিচে */}
      <Footer />
    </div>
  );
};

export default MainLayout;
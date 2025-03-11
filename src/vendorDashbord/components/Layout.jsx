import React from 'react';
import SideMenu from './SideBar';
import NavBar from './NavBar';
import Footer from './forms/Footer';
import { Outlet } from 'react-router-dom'; // This will render the child routes


const Layout = () => {
    return (
      <div className="dashboard-layout">
        <NavBar />
        <div className="dashboard-body">
          <SideMenu />
          <main>
            {/* This is where the route content (main content) will be rendered */}
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default Layout;

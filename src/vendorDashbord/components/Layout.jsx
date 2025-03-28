import React from "react";
import NavBar from "./NavBar";
import SideMenu from "./SideBar";
import Footer from "./forms/Footer";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {/* NavBar Component */}
      <NavBar />

      <div className="main-content">
        {/* SideMenu Component */}
        <SideMenu />

        <div className="content">
          {/* This is where the child components (pages) will be rendered */}
          {children}
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Layout;

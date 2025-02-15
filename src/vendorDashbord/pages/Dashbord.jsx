import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import VendorLogin from '../components/forms/VendorLogin'
import VendorRegistration from '../components/forms/VendorRegistration'
import  { useState } from 'react';

const Dashbord = () => {

  const [formType, setFormType] = useState('');
  const handleFormSwitch = (form) => {
    setFormType(form);
  };
  return (
    <>
    <section className="landingSection">
       <NavBar />
       <div className="vendorSection">
       <SideBar />
       </div>
       
    </section>
    </>
  )
}

export default Dashbord
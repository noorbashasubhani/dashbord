import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import VendorLogin from '../components/forms/VendorLogin'
import VendorRegistration from '../components/forms/VendorRegistration'
import  { useState } from 'react';

const LandingPage = () => {

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
       <div className="form-container">
            {formType === 'login' && <VendorLogin />}
            {formType === 'register' && <VendorRegistration />}
          </div>
    </section>
    </>
  )
}

export default LandingPage
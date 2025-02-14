import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import VendorLogin from '../components/forms/VendorLogin'
import VendorRegistration from '../components/forms/VendorRegistration'


const LoginPage = () => {
  return (
    <>
    <section className="landingSection">
       <NavBar />
       <div className="vendorSection">
       <SideBar />
       <VendorLogin />
       </div>
    </section>
    </>
  )
}

export default LoginPage
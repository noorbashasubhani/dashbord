import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import VendorLogin from '../components/forms/VendorLogin'
import VendorRegistration from '../components/forms/VendorRegistration'

const LandingPage = () => {
  return (
    <>
    <section className="landingSection">
       <NavBar />
       <div className="vendorSection">
       <SideBar />
       <VendorRegistration />
       </div>
    </section>
    </>
  )
}

export default LandingPage
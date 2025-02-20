import React from 'react'
import Dashbord from './vendorDashbord/pages/Dashbord'
import { Routes,Route } from 'react-router-dom'
import VendorLogin from './vendorDashbord/components/forms/VendorLogin'
import ProtectedRoute from './protextedRoute'
import VendorRegistration from './vendorDashbord/components/forms/VendorRegistration'
import Designation from './vendorDashbord/pages/Designation';
import Cabs from './vendorDashbord/pages/Cabs';
import Airoplan from './vendorDashbord/pages/Airoplan';
import Hotels from './vendorDashbord/pages/Hotels'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<VendorLogin />}></Route>
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashbord />} />} />
        <Route path="/User-Registartion"  element={<VendorRegistration />}></Route>
        <Route path="/Designation-List" element={<Designation />}></Route>
        <Route path="/Cabs-List" element={<Cabs />}></Route>
        <Route path="/Airoplan-List" element={<Airoplan />}></Route>
        <Route path="/Hotels" element={<Hotels />}></Route>
      </Routes>
      
    </div>
  )
}

export default App

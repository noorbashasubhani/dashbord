import React from 'react'
import Dashbord from './vendorDashbord/pages/Dashbord'
import { Routes,Route } from 'react-router-dom'
import VendorLogin from './vendorDashbord/components/forms/VendorLogin'
import ProtectedRoute from './protextedRoute'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<VendorLogin />}></Route>
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashbord />} />} />
        
      </Routes>
      
    </div>
  )
}

export default App

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
import Notfound from './vendorDashbord/pages/Notfound'
import Holidays from './vendorDashbord/pages/Holidays'
import ChangePassword from './vendorDashbord/pages/ChangePaasword'
import Employees from './vendorDashbord/pages/Employees'
import Flyers from './vendorDashbord/pages/Flyers'
import Library from './vendorDashbord/pages/Library'
import MyProfile from './vendorDashbord/pages/MyProfile'
import Editprofile from './vendorDashbord/pages/Editprofile'
import { EmpProvider } from '../EmpContext'

const App = () => {
  return (
    <div>
      <EmpProvider>
      <Routes>
        <Route path="/" element={<VendorLogin />}></Route> 
        <Route path="*" element={<Notfound />} />





        <Route path="/dashboard" element={<ProtectedRoute element={<Dashbord />} />} /> 
        <Route path="/User-Registartion" element={<ProtectedRoute element={<VendorRegistration />} />} /> 
        <Route path="/Designation-List" element={<ProtectedRoute element={<Designation />} />} /> 
        <Route path="/Cabs-List" element={<ProtectedRoute element={<Cabs />} />} /> 
        <Route path="/Airoplan-List" element={<ProtectedRoute element={<Airoplan />} />} /> 
        <Route path="/Hotels" element={<ProtectedRoute element={<Hotels />} />} /> 
        <Route path="/Holidays-List" element={<ProtectedRoute element={<Holidays />} />} />
        <Route path="/Password" element={<ProtectedRoute element={<ChangePassword />} />} />
        <Route path="/Emp-Details" element={<ProtectedRoute element={<Employees />} />} />
        <Route path="/Fly" element={<ProtectedRoute element={<Flyers />} />} />
        <Route path="/Librarys" element={<ProtectedRoute element={<Library />} />} />
        <Route path="/Profile" element={<ProtectedRoute element={<MyProfile />} />} />
        <Route path="/Edit-Profile" element={<ProtectedRoute element={<Editprofile />} />} />
        
      </Routes>
      </EmpProvider>

    </div>
  )
}

export default App

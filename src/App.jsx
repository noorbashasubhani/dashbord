import React from 'react'
import LandingPage from './vendorDashbord/pages/LandingPage'
import { Routes,Route } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/Login" element={<LandingPage />}>

        </Route>
      </Routes>
      
    </div>
  )
}

export default App
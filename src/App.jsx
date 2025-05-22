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
import Escalation from './vendorDashbord/pages/Escalation'
import Packages from './vendorDashbord/pages/Packages'
import SendMessageToWhatsApp from './vendorDashbord/pages/SendMessageToWhatsApp'
import Notification from './vendorDashbord/pages/Notification'
import Position from './vendorDashbord/pages/Position'
import AdvanceSalary from './vendorDashbord/pages/AdvanceSalary'
import Lead from './vendorDashbord/pages/Lead'
import Testing from './vendorDashbord/pages/Testing'
import Chat from './vendorDashbord/pages/Chat'
import RegistrationEmployee from './vendorDashbord/pages/RegistrationEmployee'
import BirthdayList from './vendorDashbord/pages/BirthdayList'
import Incandexc from './vendorDashbord/pages/Incandexc'
import Destinations from './vendorDashbord/pages/Destinations'
import Ratechats from './vendorDashbord/pages/Ratechats'
import Rip from './vendorDashbord/pages/Rip'
import Team from './vendorDashbord/pages/Team'
import Allusers from './vendorDashbord/pages/Allusers'
import PendingUsers from './vendorDashbord/pages/PendingUsers'
import Partners from './vendorDashbord/pages/Partners'
import Documets from './vendorDashbord/pages/Documets'
import PasswordVisible from './vendorDashbord/pages/PasswordVisible';
import Recovery from './vendorDashbord/pages/Recovery'
import DomesticCredit from './vendorDashbord/pages/DomesticCredit'
import IntCredite from './vendorDashbord/pages/IntCredite'
import Allcredite from './vendorDashbord/pages/Allcredite'
import Registartion from './vendorDashbord/pages/Registarion'
import Master from './vendorDashbord/pages/Master'
import Leaves from './vendorDashbord/pages/Leaves'
import LeadsComments from './vendorDashbord/pages/LeadsComments'
import Rnrleads from './vendorDashbord/pages/Rnrleads'
import Process from './vendorDashbord/pages/Process'
import DeleteLeads from './vendorDashbord/pages/DeleteLeads'
import MonthwiseLeads from './vendorDashbord/pages/MonthwiseLeads'
import SourceWiseLeads from './vendorDashbord/pages/SourceWiseLeads'
import SearchLeads from './vendorDashbord/pages/SearchLeads'
import PendingItenary from './vendorDashbord/pages/PendingItenary'
import DeleteIternary from './vendorDashbord/pages/DeleteIternary'
import DomesticForm from './vendorDashbord/pages/DomesticForm'
import Accounts from './vendorDashbord/pages/Accounts'
import Tee from './vendorDashbord/pages/Tee'
//import { EmpProvider } from '../EmpContext'
const App = () => {
  return (
    <div>
      
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
        <Route path="/Escalation" element={<ProtectedRoute element={<Escalation />} />} />
        <Route path="/Package" element={<ProtectedRoute element={<Packages />} />} />
        <Route path="/Whatsup" element={<ProtectedRoute element={<SendMessageToWhatsApp />} />} />
        <Route path="/Team" element={<ProtectedRoute element={<Team />} />} />
        <Route path="/Notifications" element={<ProtectedRoute element={<Notification />} />} />
        <Route path="/Position" element={<ProtectedRoute element={<Position />} />} />
        <Route path="/AdvanceSalary" element={<ProtectedRoute element={<AdvanceSalary />} />} />
        <Route path="/Lead" element={<ProtectedRoute element={<Lead />} />} />
        <Route path="/Testing" element={<ProtectedRoute element={<Testing />} />} />
        <Route path="/live-Chating" element={<ProtectedRoute element={<Chat />} />} />
        <Route path="/Employee-Registration" element={<ProtectedRoute element={<RegistrationEmployee />} />} />
        <Route path="/Birthday-List" element={<ProtectedRoute element={<BirthdayList />} />} />
        <Route path="/Inclusion-and-Exclusions" element={<ProtectedRoute element={<Incandexc />} />} />
        <Route path="/Destinations" element={<ProtectedRoute element={<Destinations />} />} />
        <Route path="/Rate-chats" element={<ProtectedRoute element={<Ratechats />} />} />
        <Route path="/Rip" element={<ProtectedRoute element={<Rip />} />} />
        <Route path="/All-Users" element={<ProtectedRoute element={<Allusers />} />} />
        <Route path="/All-Partners" element={<ProtectedRoute element={<Partners />} />} />
        <Route path="/Download-doc" element={<ProtectedRoute element={<Documets />} />} />
        <Route path="/Pending-Users" element={<ProtectedRoute element={<PendingUsers />} />} />
        <Route path="/Password-visible" element={<ProtectedRoute element={<PasswordVisible />} />} />
        <Route path="/Recovery" element={<ProtectedRoute element={<Recovery />} />} />
        <Route path="/Domestic-Credit" element={<ProtectedRoute element={<DomesticCredit />} />} />
        <Route path="/International-Credit" element={<ProtectedRoute element={<IntCredite />} />} />
        <Route path="/All-Credit" element={<ProtectedRoute element={<Allcredite />} />} />
        <Route path="/User-Registration" element={<ProtectedRoute element={<Registartion />} />} />
        <Route path="/Masters" element={<ProtectedRoute element={<Master />} />} />
        <Route path="/Leaves" element={<ProtectedRoute element={<Leaves />} />} />
        <Route path="/lead-comments/:lead_id" element={<ProtectedRoute element={<LeadsComments />} />} />
        <Route path="/R-N-R" element={<ProtectedRoute element={<Rnrleads />} />} />
        <Route path="/Lead-process/:lead_id" element={<ProtectedRoute element={<Process />} />} />
        <Route path="/Lead-Delete" element={<ProtectedRoute element={<DeleteLeads />} />} />
        <Route path="/Month-wise_leads" element={<ProtectedRoute element={<MonthwiseLeads />} />} />
        <Route path="/Source-wise_leads" element={<ProtectedRoute element={<SourceWiseLeads />} />} />
        <Route path="/Search" element={<ProtectedRoute element={<SearchLeads />} />} />
        <Route path="/Pending-Itenary" element={<ProtectedRoute element={<PendingItenary />} />} />
        <Route path="/Delete-Itenary" element={<ProtectedRoute element={<DeleteIternary />} />} />
        <Route path="/Domestic-Form/:row_id" element={<ProtectedRoute element={<DomesticForm />} />} />
        <Route path="/ACCOUNTS" element={<ProtectedRoute element={<Accounts />} />} />
         <Route path="/tee" element={<ProtectedRoute element={<Tee />} />} />
        
      </Routes>
      
      
      

    </div>
  )
}

export default App

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useIdleLogout from '../pages/useIdleLogout';

const SideMenu = () => {
  useIdleLogout();
  const navigate = useNavigate();
  const [isSubmenuVisible, setSubmenuVisible] = useState({
    products: false,
    firms: false,
  });

  const toggleSubmenu = (menu) => {
    setSubmenuVisible((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const departments = () =>{
    navigate('/Designation-List');
  }
  const cabs = () =>{
    navigate('/Cabs-List');
  }
  const airoplan = () =>{
   navigate('/Airoplan-List');
  }
  const holidys = () =>{
    navigate('/Holidays-List'); 
  }

  const empDetails = ()=>{
    navigate('/Emp-Details');
  }
  const flyDetails = ()=>{
    navigate('/Fly');
  }
  const library = ()=>{
    navigate('/Librarys');
  }
  const Escalation = ()=>{
    navigate('/Escalation');
  }
  const Package = ()=>{
     navigate('/Package');
  }
  const Notifications=()=>{
    navigate('/Notifications');
  }
  const positions=()=>{
    navigate('/Position');
  }
  const Advance=()=>{
    navigate('/AdvanceSalary');
  }
  const Lead=()=>{
    navigate('/Lead');
  }
  const dashbord=()=>{
    navigate('/dashbord');
  }
  const birthday=()=>{
    navigate('/Birthday-List');
  }
  const inc_extS=()=>{
    navigate('/Inclusion-and-Exclusions');
  }
  const ad_salary=()=>{
    navigate('/AdvanceSalary');
  }
  const destlist=()=>{
    navigate('/Destinations');
  }
  const rate=()=>{
    navigate('/Rate-chats');
  }
  const Hotelsclic=()=>{
    navigate('/Hotels');
  }
  const Team=()=>{
    navigate('/Team');
  }
  const alusers=()=>{
    navigate('/All-Users');
  }
  const partners=()=>{
    navigate('/All-Partners');
  }
  const ripdetails=()=>{
    navigate('/Rip'); 
  }
  const userNew=()=>{
    navigate('/Pending-Users'); 
  }
  const pass=()=>{
    navigate('/Password-visible');
  }
  const recfun=()=>{
    navigate('/Recovery');
  }
  const d_credit=()=>{
    
    navigate('/Domestic-Credit');
  }
  const mast=()=>{ navigate('/Masters');}

  const Leavess=()=>{
    navigate('/Leaves');
  }
  const Leads=()=>{
    navigate('/Lead');
  }
  const rnsleads=()=>{
    navigate('/R-N-R');
  }
  const sourcedet=()=>{
    navigate('/Source-wise_leads');
  }
  const Search=()=>{
    navigate('/Search');
  }
  const pendingitenary=()=>{
    navigate('/Pending-Itenary');
  }
  return (
    <aside id="sidebar" className="sidebar">
  <ul className="sidebar-nav" id="sidebar-nav">
    <li className="nav-item">
      <a className="nav-link" onClick={dashbord}>
        <i className="bi bi-grid" />
        <span>Dashboard</span>
      </a>
    </li>
    {/* End Dashboard Nav */}
    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#components-nav"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-airplane-engines" />
        <span>Leads</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="components-nav"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a onClick={Leads}>
            <i className="bi bi-airplane-engines" />
            <span>Leads List</span>
          </a>
        </li>
        <li>
          <a onClick={rnsleads}>
            <i className="bi bi-backpack" />
            <span>R-N-R Leads</span>
          </a>
        </li>
        
        <li>
          <a onClick={Search}>
            <i className="bi bi-search" />
            <span>Search Leads</span>
          </a>
        </li>
        <li>
          <a onClick={sourcedet}>
            <i className="bi bi-signpost" />
            <span>Month Wise Leads</span>
          </a>
        </li>
        
      </ul>
    </li>
    
    {/* End Components Nav */}
    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#forms-nav"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-transparency" />
        <span>Itenary</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="forms-nav"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a onClick={pendingitenary}>
            <i className="bi bi-transparency" />
            <span>Itenary</span>
          </a>
        </li>
        <li>
          <a href="forms-layouts.html">
            <i className="bi bi-ui-radios-grid" />
            <span>Partner Approval</span>
          </a>
        </li>
        <li>
          <a href="forms-editors.html">
            <i className="bi bi-usb-symbol" />
            <span>Quality Check</span>
          </a>
        </li>
        <li>
          <a href="forms-validation.html">
            <i className="bi bi-calculator" />
            <span>Quick Caluculation</span>
          </a>
        </li>
      </ul>
    </li>
    <li className="nav-item">
      <a className="nav-link collapsed" href="pages-blank.html">
        <i className="bi bi-file-earmark" />
        <span>Google Review</span>
      </a>
    </li>
    {/* End Forms Nav */}
    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#tables-nav"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-box-seam-fill" />
        <span>Vochers</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="tables-nav"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a href="tables-general.html">
            <i className="bi bi-box2" />
            <span>Vochers List</span>
          </a>
        </li>
        <li>
          <a href="tables-data.html">
            <i className="bi bi-gift-fill" />
            <span>Gift Vochers</span>
          </a>
        </li>
      </ul>
    </li>
    {/* End Tables Nav */}
    <li class="nav-heading">Finantial</li>
    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#charts-nav"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-life-preserver" />
        <span>Reservations</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="charts-nav"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a href="charts-chartjs.html">
            <i className="bi bi-alipay" />
            <span>Package Payment</span>
          </a>
        </li>
        <li>
          <a onClick={d_credit}>
            <i className="bi bi-credit-card-2-back-fill" />
            <span>Credit Note</span>
          </a>
        </li>
       
      </ul>
    </li>
    {/* End Charts Nav */}
    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#icons-nav"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-bag-check-fill" />
        <span>Accounts</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="icons-nav"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a href="icons-bootstrap.html">
            <i className="bi bi-piggy-bank" />
            <span>Ledger</span>
          </a>
        </li>
        <li>
          <a onClick={recfun}>
            <i className="bi bi-recycle" />
            <span>Recoveries</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-repeat" />
            <span>Reiumbursment</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-paypal" />
            <span>Partner Payout</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-scissors" />
            <span>Partner Deductions</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-tools" />
            <span>Employee Deductions</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-wallet2" />
            <span>Receipts</span>
          </a>
        </li>
      </ul>
    </li>
    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#icons-nav23"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-book-half" />
        <span>Finacial</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="icons-nav23"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a href="icons-bootstrap.html">
            <i className="bi bi-book" />
            <span>CIH</span>
          </a>
        </li>
        <li>
          <a href="icons-remix.html">
            <i className="bi bi-file-bar-graph" />
            <span>P&L</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-currency-exchange" />
            <span>Revenue Report</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-currency-rupee" />
            <span>Payable  Report</span>
          </a>
        </li>
        
      </ul>
    </li>

    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#icons-nav234"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-bricks" />
        <span>Reports</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="icons-nav234"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a href="icons-bootstrap.html">
            <i className="bi bi-circle" />
            <span>Productivity Report</span>
          </a>
        </li>
        <li>
          <a href="icons-remix.html">
            <i className="bi bi-circle" />
            <span>Daily Sales Report</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-circle" />
            <span>Leads Comments</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-circle" />
            <span>Partner  Report</span>
          </a>
        </li>
        
      </ul>
    </li>
    <li className="nav-item">
      <a className="nav-link collapsed" href="pages-faq.html">
        <i className="bi bi-question-circle" />
        <span>Customer Support</span>
      </a>
    </li>

    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#icons-navusers"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-gem" />
        <span>User Setting</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="icons-navusers"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a onClick={alusers}>
            <i className="bi bi-circle" />
            <span>All Users</span>
          </a>
        </li>
        <li>
          <a onClick={userNew}>
            <i className="bi bi-circle" />
            <span>New Users</span>
          </a>
        </li>
       
        <li>
          <a onClick={pass}>
            <i className="bi bi-circle" />
            <span>Password Visibility </span>
          </a>
        </li>
        
      </ul>
    </li>



    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#icons-navmast"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-suitcase-lg-fill" />
        <span>Master Setting</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="icons-navmast"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a  onClick={mast}>
            <i className="bi bi-slack" />
            <span>Master Details</span>
          </a>
        </li>
        
        <li>
          <a onClick={departments}>
            <i className="bi bi-pin-fill" />
            <span>Dept & Desg Details</span>
          </a>
        </li>
        
        <li>
          <a onClick={inc_extS}>
            <i className="bi bi-option" />
            <span>Inc & Excluds  </span>
          </a>
        </li>
        <li>
          <a  onClick={destlist}>
            <i className="bi bi-person-walking" />
            <span>Destinations  </span>
          </a>
        </li>
        
        
      </ul>
    </li>

    <li class="nav-heading">Human & Resource</li>

    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#icons-hrm"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-person-rolodex" />
        <span>HRM</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="icons-hrm"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a onClick={empDetails}>
            <i className="bi bi-person-bounding-box" />
            <span>Employees</span>
          </a>
        </li>
        <li>
          <a href="icons-remix.html">
            <i className="bi bi-telephone" />
            <span>Contact Details</span>
          </a>
        </li>
        <li>
          <a onClick={Leavess}>
            <i className="bi bi-calendar2-date" />
            <span>Leave Details</span>
          </a>
        </li>
        <li>
          <a onClick={holidys}>
            <i className="bi bi-umbrella" />
            <span>Holidays Details </span>
          </a>
        </li>
        <li>
          <a onClick={birthday}>
            <i className="bi bi-cake2-fill" />
            <span>Birthday Details  </span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-calendar2-fill" />
            <span>Attendance Details   </span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-handbag" />
            <span>Payroll Details   </span>
          </a>
        </li>
        <li>
          <a onClick={ripdetails}>
            <i className="bi bi-hammer" />
            <span>RIP Details   </span>
          </a>
        </li>
        <li>
          <a onClick={Advance}>
            <i className="bi bi-circle" />
            <span>Advance Salary    </span>
          </a>
        </li>
        <li>
          <a onClick={positions}>
            <i className="bi bi-person-raised-hand" />
            <span>Position Details   </span>
          </a>
        </li>
        <li>
          <a onClick={Notifications}>
            <i className="bi bi-bell" />
            <span>Notifications Details   </span>
          </a>
        </li>
        
      </ul>
    </li>



    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-target="#icons-ass"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi-buildings-fill" />
        <span>Assets Management</span>
        <i className="bi bi-chevron-down ms-auto" />
      </a>
      <ul
        id="icons-ass"
        className="nav-content collapse "
        data-bs-parent="#sidebar-nav"
      >
        <li>
          <a href="icons-bootstrap.html">
            <i className="bi bi-building" />
            <span>Assets List</span>
          </a>
        </li>
        <li>
          <a href="icons-remix.html">
            <i className="bi bi-building-fill-down" />
            <span>Assets Used List</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-building-fill-up" />
            <span>Assets Handover</span>
          </a>
        </li>
        <li>
          <a href="icons-boxicons.html">
            <i className="bi bi-buildings" />
            <span>Assets Report </span>
          </a>
        </li>
        
      </ul>
    </li>


    {/* End Icons Nav */}
    <li className="nav-heading">PARTICIPANTS</li>
    <li className="nav-item">
      <a className="nav-link collapsed" onClick={Team}>
        <i className="bi bi-people-fill" />
        <span>Teams</span>
      </a>
    </li>
    {/* End Profile Page Nav */}
    
    {/* End F.A.Q Page Nav */}
    <li className="nav-item">
      <a className="nav-link collapsed" href="pages-contact.html">
        <i className="bi bi-person-square" />
        <span>Itenary Customers</span>
      </a>
    </li>
    {/* End Contact Page Nav */}
    <li className="nav-item">
      <a className="nav-link collapsed" onClick={partners}>
        <i className="bi bi-person-video2" />
        <span> Partners</span>
      </a>
    </li>

    <li className="nav-item">
  <a
    className="nav-link collapsed"
    data-bs-target="#components-sip"
    data-bs-toggle="collapse"
    href="#"
  >
    <i className="bi bi-airplane-engines" />
    <span>Suppliers</span>
    <i className="bi bi-chevron-down ms-auto" />
  </a>
  <ul
    id="components-sip"
    className="nav-content collapse"
    data-bs-parent="#sidebar-nav"
  >
    <li>
      <a onClick={cabs}>
        <i className="bi bi-bus-front" />
        <span>Cab List</span>
      </a>
    </li>
    <li>
      <a onClick={airoplan}>
        <i className="bi bi-airplane" />
        <span>Airport List</span>
      </a>
    </li>
    <li>
          <a onClick={Hotelsclic}>
            <i className="bi bi-house-fill" />
            <span>Hotel List</span>
          </a>
        </li>
        <li>
          <a onClick={rate}>
            <i className="bi bi-houses" />
            <span>Rate Chart</span>
          </a>
        </li>

   
  </ul>
</li>


    <li className="nav-heading">MISCELLANEOUS</li>
    <li className="nav-item">
      <a className="nav-link collapsed" onClick={Package}>
        <i className="bi bi-xbox" />
        <span> Holiday Packages</span>
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link collapsed" onClick={Escalation}>
        <i className="bi bi-card-checklist" />
        <span> Complaints</span>
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link collapsed" onClick={library}>
        <i className="bi bi-columns-gap" />
        <span> Library</span>
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link collapsed" onClick={flyDetails}>
        <i className="bi bi-dropbox" />
        <span> Marketing</span>
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link collapsed" href="pages-register.html">
        <i className="bi bi-chat" />
        <span> Live Chat</span>
      </a>
    </li>
    {/* End Register Page Nav */}
   
    {/* End Error 404 Page Nav */}
   
    {/* End Blank Page Nav */}
  </ul>
</aside>

  );
};

export default SideMenu;

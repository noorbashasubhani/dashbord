import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import SideMenu from '../components/SideBar'
import Footer from '../components/forms/Footer'
import { useState,userEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../data/apiUrl'

export const ViewEmployees = () => {
    const {row_id}=useParams();
    const [empdata,setEmpdata]=useState('');
    const [activeTab, setActiveTab] = useState('personal');

   const getEmployeData=async()=>{

        const isData=await fetch(`${API_URL}/vendor/Single-user/${row_id}`);
        if(!isData.ok){
            throw new Error('Data not coming in this url');
        }
        const resultData=await isData.json();
        setEmpdata(resultData.data);

   }

   useEffect(()=>{
    getEmployeData();
   },[row_id]);

  return (
    <>
    <NavBar />
    <SideMenu />
    <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>View Employee Details</b></h4>
          <nav className="d-flex align-items-center">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Employee</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
          </nav>
        </div>

        <section>
  <ul className="nav nav-tabs mb-3" role="tablist">
    <li className="nav-item" role="presentation">
      <button className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>Personal</button>
    </li>
    <li className="nav-item" role="presentation">
      <button className={`nav-link ${activeTab === 'family' ? 'active' : ''}`} onClick={() => setActiveTab('family')}>Family</button>
    </li>
    <li className="nav-item" role="presentation">
      <button className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>Experience</button>
    </li>
    <li className="nav-item" role="presentation">
      <button className={`nav-link ${activeTab === 'bank' ? 'active' : ''}`} onClick={() => setActiveTab('bank')}>Bank / Reference</button>
    </li>
  </ul>

  {activeTab === 'personal' && (
    <table className="table table-bordered table-striped">
      <tbody>
        <tr><th>Emp ID</th><td>{empdata.employee_id || 'N/A'}</td></tr>
        <tr><th>Full Name</th><td>{empdata.first_name} {empdata.last_name}</td></tr>
        <tr><th>Email</th><td>{empdata.email}</td></tr>
        <tr><th>Mobile</th><td>{empdata.mobile_no || 'N/A'}</td></tr>
        <tr><th>Department</th><td>{empdata.department_id?.name || 'N/A'}</td></tr>
        <tr><th>Designation</th><td>{empdata.designation_id?.name || 'N/A'}</td></tr>
        <tr><th>DOB</th><td>{new Date(empdata.date_of_birthday).toLocaleDateString()}</td></tr>
        <tr><th>Gender</th><td>{empdata.gender || 'N/A'}</td></tr>
        <tr><th>User Type</th><td>{empdata.user_type}</td></tr>
        <tr><th>Pan Number</th><td>{empdata.pan_number}</td></tr>
      </tbody>
    </table>
  )}

  {activeTab === 'family' && (
    <table className="table table-bordered table-striped">
      <tbody>
        <tr><th>Father Name</th><td>{empdata.fathername}</td></tr>
        <tr><th>Mother Name</th><td>{empdata.mothername}</td></tr>
        <tr><th>Father Number</th><td>{empdata.fathername_no || 'N/A'}</td></tr>
        <tr><th>Mother Number</th><td>{empdata.mothername_no || 'N/A'}</td></tr>
        <tr><th>Mobile Number</th><td>{empdata.mobile_no || 'N/A'}</td></tr>
      </tbody>
    </table>
  )}

  {activeTab === 'experience' && (
    <table className="table table-bordered table-striped">
      <tbody>
        <tr><th>Are You Fresher?</th><td>{empdata.are_you_fresher || 'N/A'}</td></tr>
        <tr><th>Previous Company</th><td>{empdata.previous_company || 'N/A'}</td></tr>
        <tr><th>Designation</th><td>{empdata.previous_designation || 'N/A'}</td></tr>
        <tr><th>Manager Name</th><td>{empdata.reporting_manager_name || 'N/A'}</td></tr>
        <tr><th>Manager No</th><td>{empdata.reporting_manager_no || 'N/A'}</td></tr>
        <tr><th>From Date</th><td>{empdata.from_date}</td></tr>
        <tr><th>To Date</th><td>{empdata.to_date}</td></tr>
        <tr><th>Experience</th><td>{empdata.experience_details}</td></tr>
        <tr><th>Qualification</th><td>{empdata.heigher_qualification}</td></tr>
        <tr><th>Year</th><td>{empdata.qualification_year}</td></tr>
        <tr><th>Percentage</th><td>{empdata.pecentage}</td></tr>
        <tr><th>Institute</th><td>{empdata.institute_name}</td></tr>
      </tbody>
    </table>
  )}

  {activeTab === 'bank' && (
    <table className="table table-bordered table-striped">
      <tbody>
        <tr><th>Bank Name</th><td>{empdata.bank_name}</td></tr>
        <tr><th>Branch</th><td>{empdata.branch_name}</td></tr>
        <tr><th>Account No</th><td>{empdata.bank_ac_number}</td></tr>
        <tr><th>IFSC</th><td>{empdata.ifc_no}</td></tr>
        <tr><th>Ref Name 1</th><td>{empdata.ref_no_one}</td></tr>
        <tr><th>Ref Name 2</th><td>{empdata.ref_no_two}</td></tr>
        <tr><th>Ref Mobile 1</th><td>{empdata.ref_mobile_one}</td></tr>
        <tr><th>Ref Mobile 2</th><td>{empdata.ref_mobile_two}</td></tr>
      </tbody>
    </table>
  )}
</section>

      </main>
    <Footer />
    </>
  )
}

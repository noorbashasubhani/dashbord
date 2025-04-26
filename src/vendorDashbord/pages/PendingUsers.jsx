import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

import { useNavigate } from 'react-router-dom';

const PendingUsers = () => {
  const [emp, setEmp] = useState([]); // Should be an array to store employee details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();





  useEffect(() => {
    // Fetch data from the "Employees" collection
    const fetchEmp = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Pendinguser`); // Corrected endpoint
       // console.log((`${API_URL}/vendor/Userlist`));
        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }
        const data = await response.json();
        setEmp(data.data); // This will store the list of employees
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmp();
  }, []);

  const [delmodel,setDelmodel]=useState(false);
  const [delid,setDelid]=useState(null);
  const delPend=(row_id)=>{
     setDelmodel(true);
     setDelid(row_id);
  }

  const defaultColumn=async(row_id)=>{
      try{
         const responce=await fetch(`${API_URL}/vendor/DelUser/${row_id}`,{
            method:'DELETE'
         });
         if(!responce){
            throw new Error('Datd no tli linksss');
         }
         setEmp((prev) => prev.filter((user) => user._id !== row_id));
         setDelmodel(false);
      }catch(err){
        console.log(err.message);
      }
  }

  const addFun=()=>{
    navigate('/User-Registration');
  }
  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-person-fill mx-2"></i><b>Pending Users Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Pending</a>
              </li>
              <li className="breadcrumb-item active">List</li>
              <li onClick={addFun} className="btn btn-primary btn-sm">+ Add </li>
            </ol>
          </nav>
        </div>
        {delmodel && (

        <div className="modal show" style={{"display":"block"}} id="viewPackageModal" tabIndex="-1" aria-labelledby="viewPackageModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="viewPackageModalLabel">Team Details</h5>
                <button type="button" onClick={() => setDelmodel(false)} className="btn-close btn-sm"  data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <center><p>Are you sure want to delete ?</p></center>
              </div>
              <div className="modal-footer">
                 <button type="button" className="btn btn-secondary btn-sm" 
                  onClick={() => setDelmodel(false)}>Close</button>               
                   <button type="button" className="btn btn-success btn-sm" data-bs-dismiss="modal" onClick={()=>defaultColumn(delid)}>Yes Delete</button>
              </div>
            </div>
          </div>
        </div>


)}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Users Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  
                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}
                  
                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead style={{ fontSize: "13px" }}>
                        <tr>
                          <th>S.No</th>
                          <th>Employee ID</th>
                          <th>Employee Name</th>
                          <th>Email E-mail</th>
                          
                          <th>Request Sent Date </th>
                         
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: "13px" }}>
                        {/* Loop through the employee data and populate the table rows */}
                        {emp.map((emps, index) => (
                          <tr key={emps._id}> {/* Use emps._id for the key */}                         
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{emps.employee_id}</td>
                            <td>{emps.first_name} {emps.last_name}</td> {/* Employee name */}
                            <td>{emps.email}</td> {/* Employee joining date */}                           
                            <td>{emps.requested_date}</td> {/* Employee joining date */}
                            <td>
                                <button className="btn btn-sm btn-primary">Approve</button>
                                <button className="btn btn-sm btn-danger" onClick={()=>delPend(emps._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PendingUsers;

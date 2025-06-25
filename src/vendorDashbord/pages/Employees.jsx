import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { useNavigate } from 'react-router-dom';


const Employees = () => {
  const navigate = useNavigate();
  const [emp, setEmp] = useState([]); // Should be an array to store employee details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetchEmp();
  }, []);
    // Fetch data from the "Employees" collection
    const fetchEmp = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Userlist`); // Corrected endpoint
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

    

 const goTonew=(row_id)=>{
      navigate('/View-Employee/'+`${row_id}`); // Replace with your target URL path
 }
 const editFunc=(row_id)=>{
    navigate('/EDIT-EMP/'+`${row_id}`); // Replace with your target URL path
 }

 const delFun=async(row_id)=>{
   const delData=await fetch(`${API_URL}/vendor/DelUser/${row_id}`,{
    method:'DELETE'
   });
   if(!delData.ok){
    throw new Error('Data not delete in this link');
   }
   fetchEmp();
 }

  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-person-fill mx-2"></i><b>Employee Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Employee</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Employee Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  
                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}
                  
                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <div className="table-responsive">
  <table className="table table-striped table-bordered table-hover">
                      <thead style={{ fontSize: "13px" }}>
                        <tr>
                          <th>S.No</th>
                          <th>Employee ID</th>
                          <th>Employee Name</th>
                          <th>Email E-mail</th>
                          <th>Department Name</th>
                          <th>Designation Name</th>
                          <th>Joining Date</th>
                          <th>Work Location</th>
                          <th>Salary</th>
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
                            <td>{emps.department_id?.name || 'N/A'}</td> {/* Employee joining date */}
                            <td>{emps.designation_id?.name || 'N/A'}</td> {/* Employee joining date */}
                            <td>{emps.joining_date}</td> {/* Employee joining date */}
                            <td>Hyderabad Begumpet White House Building</td> {/* Employee joining date */}
                            <td>confidential</td> {/* Employee joining date */}
                            <td>
                              <button className="btn btn-sm btn-primary" onClick={()=>goTonew(emps._id)}>View</button>
                              <button className="btn btn-sm btn-danger" onClick={()=>delFun(emps._id)}>Delete</button>
                              <button className="btn btn-success btn-sm" onClick={()=>editFunc(emps._id)}>Edit</button>
                              </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
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

export default Employees;

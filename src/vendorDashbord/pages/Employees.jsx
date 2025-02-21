import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Employees = () => {
  const [emp, setEmp] = useState([]); // Should be an array to store employee details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the "Employees" collection
    const fetchEmp = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Userlist`); // Corrected endpoint
       // console.log((`${API_URL}/vendor/Userlist`));
        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }
        const data = await response.json();
        setEmp(data); // This will store the list of employees
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmp();
  }, []);

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
                    <table className="table datatable table-striped">
                      <thead style={{ fontSize: "13px" }}>
                        <tr>
                          <th>S.No</th>
                          <th>Employee Name</th>
                          <th>Email ID</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: "13px" }}>
                        {/* Loop through the employee data and populate the table rows */}
                        {emp.map((emps, index) => (
                          <tr key={emps._id}> {/* Use emps._id for the key */}
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{emps.first_name} {emps.last_name}</td> {/* Employee name */}
                            <td>{emps.email}</td> {/* Employee joining date */}
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

export default Employees;

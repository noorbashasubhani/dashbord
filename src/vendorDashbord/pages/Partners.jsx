import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Partners = () => {
  const [emp, setEmp] = useState([]); // Should be an array to store employee details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the "Employees" collection
    const fetchEmp = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Userlist`); // Corrected endpoint
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
          <h4><i className="bi bi-person-fill mx-2"></i><b>All Partners Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Partners</a>
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
                    <div className="table-responsive">
  <table className="table table-striped table-bordered table-hover">
                      <thead style={{ fontSize: "13px" }}>
                        <tr>
                          <th>S.No</th>
                          <th>Partner Code</th>
                          <th>Name</th>
                          <th>Partner Type</th>
                          <th>Location</th>
                          <th>Address</th>
                          <th>E-mail</th>
                          <th>Mobile</th>
                          <th>Active Since</th>
                          <th>Status</th>
                          <th>View Partner</th>
                          <th>QR Links</th>
                          <th>View QR Scanner</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: "13px" }}>
                        {/* Loop through the employee data and populate the table rows */}
                        {emp.map((emps, index) => (
                          <tr key={emps._id}> {/* Use emps._id for the key */}
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{emps?.partner_code || 'N/A'}</td> {/* Partner Code */}
                            <td>{emps?.first_name} {emps?.last_name || 'N/A'}</td> {/* Name */}
                            <td>{emps?.partner_type || 'N/A'}</td> {/* Partner Type */}
                            <td>{emps?.location || 'N/A'}</td> {/* Location */}
                            <td>{emps?.address || 'N/A'}</td> {/* Address */}
                            <td>{emps?.email || 'N/A'}</td> {/* Email */}
                            <td>{emps?.mobile || 'N/A'}</td> {/* Mobile */}
                            <td>{emps?.active_since || 'N/A'}</td> {/* Active Since */}
                            <td>{emps?.status || 'Inactive'}</td> {/* Status */}
                            <td>
                              <button className="btn btn-info btn-sm">View</button>
                            </td>
                            <td>
                              <button className="btn btn-primary btn-sm">QR Link</button>
                            </td>
                            <td>
                              <button className="btn btn-success btn-sm">View QR Scanner</button>
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

export default Partners;

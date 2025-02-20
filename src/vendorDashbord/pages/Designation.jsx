import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Dashboard = () => {
  const [departments, setDepartments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the "Designation" collection
    const fetchDesignations = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/GroupDesinations`);
        if (!response.ok) {
          throw new Error('Failed to fetch designations');
        }
        const data = await response.json();
        setDepartments(data); // This will store the data grouped by department
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignations();
  }, []);

  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i class="bi bi-pin-fill mx-2"></i><b>Departments & Designation Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Departments</a>
              </li>
              <li className="breadcrumb-item active">Designation</li>
              
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
               + Add Designation
            </button>
          </nav>
          
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{"font-size":"14px"}}>Departments & Designation Details </h6>
                  <p className="" style={{"font-size":"13px", "margin-top":"-15px"}}>
                  Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.


                    
                  </p>
                  
                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}
                  
                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}
                 
                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <table className="table datatable table-stripped">
                      <thead style={{fontSize:"13px"}}>
                        <tr>
                            <th>S.No</th>
                          <th>Department</th>
                          {/* Dynamically generate columns for each designation */}
                          <th>Designations</th>
                          
                        </tr>
                      </thead>
                      <tbody style={{"font-size":"13px"}}>
                        {/* Loop through each department */}
                        {
                        
                        Object.keys(departments).map((department,index) => {
                          // Get the designations for the current department
                          const designations = departments[department];
                          return (
                            <tr key={department}>
                                <td>{index+1}</td>
                              <td>{department}</td>
                              <td>
                                {/* Render all designations in a single cell */}
                                {designations.map((designation, index) => (
                                  <span key={designation._id}>
                                    {designation.name}
                                    {index < designations.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </td>

                            </tr>
                          );
                        })}
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

export default Dashboard;

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Dashboard = () => {
  const [airplan, setairplan] = useState([]); // Should be an array to store multiple airports
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the "Airplan-List" collection
    const fetchAirplan = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Airplan-List`);
        if (!response.ok) {
          throw new Error('Failed to fetch airplan details');
        }
        const data = await response.json();
        setairplan(data); // This will store the list of airplan details
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAirplan();
  }, []);

  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Airport Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Airport</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
               + Add Airport
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{"font-size":"14px"}}>Airport Details</h6>
                  <p className="" style={{"font-size":"13px", "margin-top":"-15px"}}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  
                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}
                  
                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead style={{fontSize:"13px"}}>
                        <tr>
                          <th>S.No</th>
                          <th>Airport Name</th>
                          <th>Airport Location</th>
                          <th>Airport Code</th>
                          <th>Airport Created Date</th>
                        </tr>
                      </thead>
                      <tbody style={{fontSize: "13px"}}>
                        {/* Loop through the airplan data and populate the table rows */}
                        {airplan.map((airport, index) => (
                          <tr key={airport._id}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{airport.airport_name}</td> {/* Airport name */}
                            <td>{airport.airport_city}</td> {/* Airport location */}
                            <td>{airport.airport_code}</td> {/* Airport code */}
                            <td>{airport.created_date}</td> {/* Created date */}
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

export default Dashboard;

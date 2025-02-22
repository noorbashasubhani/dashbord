import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Cabs = () => {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the "Cab-list" collection
    const fetchCabs = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Cab-list`);
        if (!response.ok) {
          throw new Error('Failed to fetch Cab Details');
        }
        const data = await response.json();
        setCabs(data); // This will store the list of cabs
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCabs();
  }, []);

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Cabs Details</b></h4>
          <nav className="d-flex align-items-center">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Cabs</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
              + Add Cab
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ "font-size": "14px" }}>Cabs Details Table </h6>
                  <p className="" style={{ "font-size": "13px", "margin-top": "-15px" }}>
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
                          <th>State</th>
                          <th>Location</th>
                          <th>Name</th>
                          <th>Email or Contact Num</th>
                          <th>Vehicle Type</th>
                          <th>Capacity</th>
                          <th>Per Day Cost</th>
                          <th>Km</th>
                          <th>Created Date</th>
                        </tr>
                      </thead>
                      <tbody style={{ "font-size": "13px" }}>
                        {/* Loop through the cabs */}
                        {cabs.map((cab, index) => (
                          <tr key={cab._id}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{cab.state_name}</td> {/* State */}
                            <td>{cab.service_location}</td> {/* Location */}
                            <td>{cab.supplier_name}</td> {/* Cab Name */}
                            <td>{cab.email_contact}</td> {/* Email or Contact Number */}
                            <td>{cab.vehicle_type}</td> {/* Vehicle Type */}
                            <td>{cab.seating_capacity}</td> {/* Capacity */}
                            <td>{cab.per_day_cost}</td> {/* Per Day Cost */}
                            <td>{cab.rate_per_km}</td> {/* Kilometers */}
                            <td>{new Date(cab.created_date).toLocaleDateString()}</td> {/* Created Date */}
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

export default Cabs;

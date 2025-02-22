import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Dashboard = () => {
  const [airplan, setAirplan] = useState([]); // Store airport details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [newAirport, setNewAirport] = useState({
    airport_name: '',
    airport_city: '',
    airport_code: ''
  });

  useEffect(() => {
    const fetchAirplan = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Airplan-List`);
        if (!response.ok) {
          throw new Error('Failed to fetch airplan details');
        }
        const data = await response.json();
        setAirplan(data); // Store the airport list
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAirplan();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirport({
      ...newAirport,
      [name]: value
    });
  };

  // Handle form submission to add a new airport
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/vendor/Add-Airports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAirport),
      });

      if (!response.ok) {
        throw new Error('Failed to add airport');
      }

      const data = await response.json();
      setAirplan([...airplan, data.data]); // Update the list with the new airport
      setShowModal(false); // Close the modal
      setNewAirport({ airport_name: '', airport_city: '', airport_code: '' }); // Reset the form
    } catch (err) {
      setError(err.message);
    }
  };

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

      {/* Modal for adding a new airport */}
      {showModal && (
        <div className="modal" tabIndex="-1" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Airport</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label>Airport Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="airport_name"
                      value={newAirport.airport_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Airport Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="airport_city"
                      value={newAirport.airport_city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Airport Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="airport_code"
                      value={newAirport.airport_code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Airport
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Dashboard;

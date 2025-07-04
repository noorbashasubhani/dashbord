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

const [err,setErr]=useState({
  airport_name: '',
  airport_city: '',
  airport_code: ''
});

const formValidate=()=>{
  let isVaid=true;
  const errMsg={...err};
  Object.keys(errMsg).forEach((key)=>{
    errMsg[key]='';
  });

  if(!newAirport.airport_name){
    errMsg.airport_name='Please Enter Airoplan Name';
    isVaid=false;
  }
  setErr(errMsg);
  return isVaid;
}

  const [selectedAirportId, setSelectedAirportId] = useState(null); // Track the airport to edit

  useEffect(() => {
    const fetchAirplan = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Airplan-List`);
        if (!response.ok) {
          throw new Error('Failed to fetch airplan details');
        }
        const data = await response.json();
        setAirplan(data.data); // Store the airport list
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

  // Handle form submission to add or update airport
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formValidate()){
      return;
    }
    try {
      const url = selectedAirportId
        ? `${API_URL}/vendor/Airport/${selectedAirportId}` // Update endpoint
        : `${API_URL}/vendor/Add-Airports`; // Add new airport
      const method = selectedAirportId ? 'PUT' : 'POST'; // Change HTTP method for updating
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAirport),
      });

      if (!response.ok) {
        throw new Error('Failed to save airport');
      }

      const data = await response.json();
      if (selectedAirportId) {
        setAirplan(airplan.map((airport) =>
          airport._id === selectedAirportId ? data.data : airport
        ));
      } else {
        setAirplan([...airplan, data.data]); // Update the list with the new airport
      }
      setShowModal(false); // Close the modal
      setNewAirport({ airport_name: '', airport_city: '', airport_code: '' }); // Reset the form
      setSelectedAirportId(null); // Reset selected airport ID
    } catch (err) {
      setError(err.message);
    }
  };

  // Open modal for editing an airport
  const handleEditClick = (airport) => {
    setNewAirport({
      airport_name: airport.airport_name,
      airport_city: airport.airport_city,
      airport_code: airport.airport_code,
    });
    setSelectedAirportId(airport._id); // Set the airport ID to update
    setShowModal(true);
  };


  // Handle deleting an airport
  const handleDeleteClick = async (airportId) => {
    if (window.confirm('Are you sure you want to delete this airport?')) {
      try {
        const response = await fetch(`${API_URL}/vendor/Airport/${airportId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete airport');
        }

        // Remove the deleted airport from the state
        setAirplan(airplan.filter(airport => airport._id !== airportId));
      } catch (err) {
        setError(err.message);
      }
    }
  };


  const [sqlQquery,setSqlQquery]=useState(null);
  
  const queryData=airplan.filter((items)=>{
    const airportname = items.airport_name ? items.airport_name.toLowerCase() : '';
    const dates=items.created_date ? items.created_date : ''

    const qury=sqlQquery ? sqlQquery.toLowerCase() : '';
    return airportname.includes(qury) || dates.includes(qury);
  });

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
            <div className="px-5 mx-5">
            <input type="text" className="form-control" name="Search" placeholder="Search..." 
            value={sqlQquery}  onChange={(e)=>{setSqlQquery(e.target.value)}}/>
            </div>
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
                  <p className="" style={{"font-size":"13px", "margin-top":"-15px"}}>Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.</p>
                  
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
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody style={{fontSize: "13px"}}>
                        {/* Loop through the airplan data and populate the table rows */}
                        {queryData.map((airport, index) => (
                          <tr key={airport._id}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{airport.airport_name}</td> {/* Airport name */}
                            <td>{airport.airport_city}</td> {/* Airport location */}
                            <td>{airport.airport_code}</td> {/* Airport code */}
                            <td>{airport.created_date}</td> {/* Created date */}
                            <td>
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEditClick(airport)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger ms-2"
                                onClick={() => handleDeleteClick(airport._id)}
                              >
                                Delete
                              </button>
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

      {/* Modal for adding or editing an airport */}
      {showModal && (
        <div className="modal" tabIndex="-1" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedAirportId ? 'Edit Airport' : 'Add Airport'}</h5>
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
                      
                    />
                    {err.airport_name && <p className="text-danger">{err.airport_name}</p>}
                  </div>
                  <div className="form-group mb-3">
                    <label>Airport Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="airport_city"
                      value={newAirport.airport_city}
                      onChange={handleInputChange}
                      
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
                      
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {selectedAirportId ? 'Update Airport' : 'Save Airport'}
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

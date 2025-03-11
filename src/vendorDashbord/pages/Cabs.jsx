import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';

const Cabs = () => {
  const [cabs, setCabs] = useState([]); // To store the list of cabs
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [newCab, setNewCab] = useState({
    state_name: '',
    service_location: '',
    supplier_name: '',
    email_contact: '',
    vehicle_type: '',
    seating_capacity: '',
    per_day_cost: '',
    rate_per_km: '',
  });
  const [selectedCabId, setSelectedCabId] = useState(null); // To store the selected cab ID

  // Fetch data from the "Cab-list" collection
  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Cab-list`);
        if (!response.ok) {
          throw new Error('Failed to fetch Cab Details');
        }
        const data = await response.json();
        setCabs(data); // Store the list of cabs
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchCabs();
  }, []);

  // Handle input changes in the add cab form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCab((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (cab) => {
    setNewCab({
      state_name: cab.state_name,
      service_location: cab.service_location,
      supplier_name: cab.supplier_name,
      email_contact: cab.email_contact,
      vehicle_type: cab.vehicle_type,
      seating_capacity: cab.seating_capacity,
      per_day_cost: cab.per_day_cost,
      rate_per_km: cab.rate_per_km,
    });
    setSelectedCabId(cab._id); // Set selected cab ID for editing
    setShowModal(true);
  };

  // Handle the form submission to add new cab
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = { ...newCab };

    try {
      let response;
      if (selectedCabId) {
        // Update existing cab
        response = await fetch(`${API_URL}/vendor/Cabs/${selectedCabId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
         toast.success('Cabs Details updated successfully');
      } else {
        // Add new cab
        response = await fetch(`${API_URL}/vendor/add-cab`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        
      }

      if (!response.ok) throw new Error('Failed to save cab');
      const data = await response.json();

      if (selectedCabId) {
        // Update the cab in the list
        setCabs((prevCabs) => prevCabs.map((cab) => (cab._id === selectedCabId ? data.data : cab)));
        toast.success('Cab updated successfully!');
      } else {
        // Add new cab to the list
        setCabs((prevCabs) => [...prevCabs, data.data]);
        toast.success('New cab added successfully!');
      }
      setShowModal(false);
      setSelectedCabId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteCab = async (id) => {
    try {
      const response = await fetch(`${API_URL}/vendor/DeleteCab/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete library');
      }
      // Filter out the deleted item from the state
      setCabs(cabs.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

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
<ToastContainer />
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Cabs Details Table</h6>
                  <p className="" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>

                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}

                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead style={{ fontSize: '13px' }}>
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
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {/* Loop through the cabs */}
                        {cabs.map((cab, index) => (
                          <tr key={cab._id}>
                            <td>{index + 1}</td>
                            <td>{cab.state_name}</td>
                            <td>{cab.service_location}</td>
                            <td>{cab.supplier_name}</td>
                            <td>{cab.email_contact}</td>
                            <td>{cab.vehicle_type}</td>
                            <td>{cab.seating_capacity}</td>
                            <td>{cab.per_day_cost}</td>
                            <td>{cab.rate_per_km}</td>
                            <td>{new Date(cab.created_date).toLocaleDateString()}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteCab(cab._id)}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEditClick(cab)}
                              >
                                Edit
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

        {/* Modal for Adding/Editing Cab */}
        {showModal && (
          <div className="modal show" style={{ display: 'block' }} onClick={() => setShowModal(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content container-fluid">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedCabId ? 'Edit Cab' : 'Add New Cab'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div className="mb-3">
                      <label htmlFor="state_name" className="form-label">State</label>
                      <input
                        type="text"
                        id="state_name"
                        name="state_name"
                        value={newCab.state_name}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="service_location" className="form-label">Location</label>
                      <input
                        type="text"
                        id="service_location"
                        name="service_location"
                        value={newCab.service_location}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="supplier_name" className="form-label">Cab Name</label>
                      <input
                        type="text"
                        id="supplier_name"
                        name="supplier_name"
                        value={newCab.supplier_name}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email_contact" className="form-label">Email or Contact Number</label>
                      <input
                        type="text"
                        id="email_contact"
                        name="email_contact"
                        value={newCab.email_contact}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vehicle_type" className="form-label">Vehicle Type</label>
                      <input
                        type="text"
                        id="vehicle_type"
                        name="vehicle_type"
                        value={newCab.vehicle_type}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="seating_capacity" className="form-label">Seating Capacity</label>
                      <input
                        type="number"
                        id="seating_capacity"
                        name="seating_capacity"
                        value={newCab.seating_capacity}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="per_day_cost" className="form-label">Per Day Cost</label>
                      <input
                        type="number"
                        id="per_day_cost"
                        name="per_day_cost"
                        value={newCab.per_day_cost}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="rate_per_km" className="form-label">Rate Per KM</label>
                      <input
                        type="number"
                        id="rate_per_km"
                        name="rate_per_km"
                        value={newCab.rate_per_km}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary" disabled={false}>
                        {selectedCabId ? 'Update' : 'Save'}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Cabs;

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Hotels = () => {
  const [hotels, setHotels] = useState([]); // Store multiple hotels
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [editHotel, setEditHotel] = useState(null); // To store the hotel being edited
  const [successMessage, setSuccessMessage] = useState('');
  const [newHotel, setNewHotel] = useState({
    hotel_state: '',
    hotel_city: '',
    hotel_name: '',
    distance_from: '',
    price: '',
    contact_no: '',
    hotel_addres: '',
    google_link: ''
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Gethotels`);
        if (!response.ok) {
          throw new Error('Failed to fetch hotel details');
        }
        const data = await response.json();
  
        // Ensure that data is an array and contains valid hotel objects
        if (Array.isArray(data)) {
          setHotels(data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHotels();
  }, []);
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel(prevHotel => ({
      ...prevHotel,
      [name]: value
    }));
  };

  const handleAddHotelSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/vendor/Add-hotel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHotel),
      });

      if (!response.ok) {
        throw new Error('Failed to add hotel');
      }

      const data = await response.json();
      setHotels([...hotels, data.data]); // Update the hotels list
      setShowModal(false); // Close the modal
      setNewHotel({
        hotel_state: '',
        hotel_city: '',
        hotel_name: '',
        distance_from: '',
        price: '',
        contact_no: '',
        hotel_addres: '',
        google_link: ''
      }); // Clear the form

       setSuccessMessage('Hotel added successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (hotel) => {
    setEditHotel(hotel); // Set the hotel being edited
    setNewHotel({
      hotel_state: hotel.hotel_state || '',
    hotel_city: hotel.hotel_city || '',
    hotel_name: hotel.hotel_name || '',
    distance_from: hotel.distance_from || '',
    price: hotel.price || '',
    contact_no: hotel.contact_no || '',
    hotel_addres: hotel.hotel_addres || '',
    google_link: hotel.google_link || ''
    });
    setShowModal(true); // Open the modal
  };

  const handleEditHotelSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/vendor/Update-Hotels/${editHotel._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHotel),
      });

      if (!response.ok) {
        throw new Error('Failed to update hotel');
      }

      const data = await response.json();
      //setHotels(prevHotels => [data.data,...prevHotels]);
      setHotels([...hotels, data.data]); 
      setShowModal(false); // Close the modal
      setEditHotel(null); // Reset the editHotel

      
      
    } catch (err) {
      setError(err.message);
    }
  };



  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        const response = await fetch(`${API_URL}/vendor/Delete-Hotel/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete hotel');
        }

        // Remove the deleted hotel from the state
        setHotels(hotels.filter(hotel => hotel._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Hotels Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Hotels</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
               + Add Hotels
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{"font-size":"14px"}}>Hotels Details</h6>
                  <p className="" style={{"font-size":"13px", "margin-top":"-15px"}}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>

                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}

                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}
                  {successMessage && <div className="alert alert-success">{successMessage}</div>}
                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead style={{fontSize:"13px"}}>
                        <tr>
                          <th>S.No</th>
                          <th>Hotel State</th>
                          <th>Hotel Location</th>
                          <th>Hotel Name</th>
                          <th>Distance</th>
                          <th>Price</th>
                          <th>Contact No</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody style={{fontSize: "13px"}}>
                      {hotels.map((hotel, index) => (
  // Ensure hotel object is valid
  hotel ? (
    <tr key={hotel._id}>
      <td>{index + 1}</td>
      <td>{hotel.hotel_state || 'N/A'}</td>
      <td>{hotel.hotel_city || 'N/A'}</td>
      <td>{hotel.hotel_name || 'N/A'}</td>
      <td>{hotel.distance_from || 'N/A'}</td>
      <td>{hotel.price || 'N/A'}</td>
      <td>{hotel.contact_no || 'N/A'}</td>
      <td>
        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(hotel)}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(hotel._id)}>Delete</button>
      </td>
    </tr>
  ) : null
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

      {/* Modal for adding/editing hotel */}
      {showModal && (
        <div className="modal" tabIndex="-1" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editHotel ? 'Edit Hotel' : 'Add Hotel'}</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={editHotel ? handleEditHotelSubmit : handleAddHotelSubmit}>
                  <div className="form-group mb-3">
                    <label>Hotel State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="hotel_state"
                      value={newHotel.hotel_state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Hotel Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="hotel_city"
                      value={newHotel.hotel_city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Hotel Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="hotel_name"
                      value={newHotel.hotel_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Distance</label>
                    <input
                      type="text"
                      className="form-control"
                      name="distance_from"
                      value={newHotel.distance_from}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Price</label>
                    <input
                      type="text"
                      className="form-control"
                      name="price"
                      value={newHotel.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Contact No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact_no"
                      value={newHotel.contact_no}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Google Link</label>
                    <input
                      type="text"
                      className="form-control"
                      name="google_link"
                      value={newHotel.google_link}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="hotel_addres"
                      value={newHotel.hotel_addres}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editHotel ? 'Update Hotel' : 'Save Hotel'}
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

export default Hotels;

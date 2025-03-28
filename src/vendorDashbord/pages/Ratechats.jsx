import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Ratechats = () => {
  // Correct usage of useState hook
  const [chats, setChat] = useState([]); // Initialize chats state
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [addmodel, setAddmodel] = useState(false);
  const [ids, setIds] = useState(null);
  const [demodel, setDelmodel] = useState(false);
  const [search,setSearch]=useState();
  const [form, setForm] = useState({
    city_name: '',
    hotel_name: '',
    expair_date: '',
  });

  const [error, setError] = useState({
    city_name: '',
    hotel_name: '',
    expair_date: '',
  });

  const formvalidation = () => {
    const newError = {};
    let isValid = true;

    // Validate city_name
    if (!form.city_name) {
      newError.city_name = 'Please Enter Your City Name';
      isValid = false;
    }

    // Validate hotel_name
    if (!form.hotel_name) {
      newError.hotel_name = 'Please Enter Hotel Name';
      isValid = false;
    }

    // Validate expair_date
    if (!form.expair_date) {
      newError.expair_date = 'Please Enter Expiry Date';
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  // Table data functionality
  useEffect(() => {
    const getRates = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Rate-chat`);
        if (!response.ok) {
          throw new Error('Data not fetching');
        }
        const data = await response.json();
        setChat(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getRates();
  }, []);

  // Adding functionality 
  const addRates = () => {
    setAddmodel(true);
    setIds(null);
    setForm({ city_name: '', hotel_name: '', expair_date: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const saveData = async () => {
    // Check if form is valid before proceeding
    if (!formvalidation()) {
      return false;
    }

    try {
      if (ids === null) {
        // POST request to add new rate
        const response = await fetch(`${API_URL}/vendor/Rate-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        const newData = await response.json();
        setChat((prevData) => [newData.data, ...prevData]);
        setForm({ city_name: '', hotel_name: '', expair_date: '' });
        setAddmodel(false);
      } else {
        // PUT request to update existing rate
        const response = await fetch(`${API_URL}/vendor/Rate-chat/${ids}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        const newData = await response.json();
        setChat((prevData) =>
          prevData.map((item) => (item._id === ids ? newData.data : item))
        );
        setForm({ city_name: '', hotel_name: '', expair_date: '' });
        setAddmodel(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const editRate = (RatingID) => {
    setAddmodel(true);
    setIds(RatingID);
    const rateData = chats.find((chat) => chat._id === RatingID);
    if (rateData) {
      setForm({
        city_name: rateData.city_name,
        hotel_name: rateData.hotel_name,
        expair_date: rateData.expair_date
          ? new Date(rateData.expair_date).toISOString().split('T')[0]
          : '',
      });
    }
  };

  // Delete Functionality
  const deleteRate = async (RatingID) => {
    setDelmodel(true);
    setIds(RatingID);
  };

  const handleDeleteCancel = () => {
    setDelmodel(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Rate-chat/${ids}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Remove the deleted item from the local state (chats)
        setChat((prevData) => prevData.filter((item) => item._id !== ids));

        // Close the modal after successful deletion
        setDelmodel(false);
        setIds(null); // Reset ids state
      } else {
        console.log('Failed to delete');
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const SearchData=chats.filter((items)=>{
     const city_name=items.city_name ? items.city_name.toLowerCase() : ''
     const hotel_name=items.hotel_name ? items.hotel_name.toLowerCase() : ''
     const searchTerm=search ? search.toLowerCase() : '';
     
     return city_name.includes(searchTerm) || hotel_name.includes(searchTerm)

  });

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4>
            <i className="bi bi-pin-fill mx-2"></i>
            <b>Rate Charts</b>
          </h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Rate Charts</a>
              </li>
              <li className="breadcrumb-item active">Rate</li>
            </ol>
            <div>
            <input
  type="text"
  name="search_entry"
  id="search_entry"
  value={search}
  onChange={(e) => setSearch(e.target.value)}  // Correct the function to receive 'e'
/>
 </div>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={addRates}>
              + Add Rate Charts
            </button>
          </nav>
        </div>
       
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>
                    Departments & Designation Details
                  </h6>
                  <p style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>

                  {/* Loading state */}
                  {loading && <p><center>Loading...</center></p>}

                  {/* Table with dynamic data */}
                  {!loading && (
                    <table className="table datatable table-striped">
                      <thead style={{ fontSize: '13px' }}>
                        <tr>
                          <th>S.No</th>
                          <th>City Name</th>
                          <th>Hotel Name</th>
                          <th>Expiry Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {SearchData.length > 0 ? (
                          SearchData.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.city_name}</td>
                              <td>{item.hotel_name}</td>
                              <td>{item.expair_date ? new Date(item.expair_date).toLocaleDateString() : 'N/A'}</td>
                              <td>
                                <button className="btn btn-warning btn-sm" onClick={() => editRate(item._id)}>
                                  Edit
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteRate(item._id)}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'right' }}>
                              <center>No data available</center>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {addmodel && (
        <div className="modal fade show d-block" id="addRateModal" tabIndex="-1" aria-hidden="false" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{ids !== null ? 'Edit Rate Chart' : 'Add Rate Chart'}</h5>
                <button type="button" className="btn-close" onClick={() => setAddmodel(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="city_name" className="form-label">City Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city_name"
                      name="city_name"
                      value={form.city_name}
                      onChange={handleInputChange}
                    />
                    {error.city_name && <p className="error text-danger">{error.city_name}</p>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="hotel_name" className="form-label">Hotel Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="hotel_name"
                      name="hotel_name"
                      value={form.hotel_name}
                      onChange={handleInputChange}
                    />
                    {error.hotel_name && <p className="error text-danger">{error.hotel_name}</p>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="expair_date" className="form-label">Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="expair_date"
                      name="expair_date"
                      value={form.expair_date}
                      onChange={handleInputChange}
                    />
                    {error.expair_date && <p className="error text-danger">{error.expair_date}</p>}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddmodel(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={saveData}>
                  Save Rate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {demodel && (
        <div className="modal fade show d-block" id="deleteModal" tabIndex="-1" aria-hidden="false" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={handleDeleteCancel} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this rate chart?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Ratechats;

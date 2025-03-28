import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Rip = () => {
  const [chats, setChat] = useState([]); // State to hold data for display
  const [loading, setLoading] = useState(true); // Loading state for table
  const [addModel, setAddModel] = useState(false); // State for Add/Edit modal visibility
  const [ids, setIds] = useState(null); // State to store the current ID for editing/deleting
  const [delModel, setDelModel] = useState(false); // State for Delete confirmation modal
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

  // Validate form before submitting
  const formValidation = () => {
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

  // Fetch rates data from API
  useEffect(() => {
    const getRates = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/RIP`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setChat(data.data); // Assuming response.data contains your array of chats
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Stop loading state after fetching
      }
    };
    getRates();
  }, []);

  // Open Add modal
  const addRates = () => {
    setAddModel(true);
    setIds(null);
    setForm({ city_name: '', hotel_name: '', expair_date: '' });
  };

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Save data to the backend (Add or Update)
  const saveData = async () => {
    if (!formValidation()) {
      return;
    }

    try {
      if (ids === null) {
        // POST request for new data
        const response = await fetch(`${API_URL}/vendor/Rate-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        const newData = await response.json();
        setChat((prevData) => [newData.data, ...prevData]); // Add new data to existing state
        setForm({ city_name: '', hotel_name: '', expair_date: '' });
        setAddModel(false); // Close modal after saving
      } else {
        // PUT request for updating existing data
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
        setAddModel(false); // Close modal after updating
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Edit rate (populate form with existing data)
  const editRate = (RatingID) => {
    setAddModel(true);
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

  // Open delete modal
  const deleteRate = (RatingID) => {
    setDelModel(true);
    setIds(RatingID);
  };

  const handleDeleteCancel = () => {
    setDelModel(false);
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
        // Remove the deleted item from state
        setChat((prevData) => prevData.filter((item) => item._id !== ids));
        setDelModel(false); // Close delete modal
        setIds(null);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4>
            <i className="bi bi-pin-fill mx-2"></i>
            <b>Rip Details</b>
          </h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Rip Details</a>
              </li>
              <li className="breadcrumb-item active">Rip</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={addRates}>
              + Add Rip 
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
                          <th>Employee Name</th>
                          <th>Target Volume</th>
                          <th>No of Confirmations</th>
                          <th>Target Dates</th>
                          <th>No of Days</th>
                          <th>Visible To</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {chats.length > 0 ? (
                          chats.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.employee_name}</td>
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
                            <td colSpan="7" style={{ textAlign: 'center' }}>No data available</td>
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

      <Footer />
    </>
  );
};

export default Rip;

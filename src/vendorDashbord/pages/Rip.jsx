import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { jwtDecode } from 'jwt-decode';

const Rip = () => {
  const [chats, setChat] = useState([]); // State to hold data for display
  const [loading, setLoading] = useState(true); // Loading state for table
  const [addModel, setAddModel] = useState(false); // State for Add/Edit modal visibility
  const [ids, setIds] = useState(null); // State to store the current ID for editing/deleting
  const [delModel, setDelModel] = useState(false); // State for Delete confirmation modal
  const [employees, setEmployees] = useState([]);

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  //const token = localStorage.getItem('token'); 
  const [form, setForm] = useState({
    employee_name: '',
    visible_to: [],  // Multiple employees
    from_date: '',
    to_date: '',
    total_volume: '',
    no_of_confirmations: 0
  });

  const [error, setError] = useState({
    employee_name: '',
    visible_to: [],  // Multiple employees
    from_date: '',
    to_date: '',
    total_volume: '',
    no_of_confirmations: 0
  });

  // Validate form before submitting
  const formValidation = () => {
    const newError = {};
    let isValid = true;

    // Validate city_name
    if (!form.employee_name) {
      newError.employee_name = 'Please Enter Your City Name';
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
        // Fetch RIP data
        const response = await fetch(`${API_URL}/vendor/RIP`);
        if (!response.ok) {
          throw new Error('Failed to fetch RIP data');
        }
        const ripData = await response.json();
        setChat(ripData.data);
  
        // Fetch Employee List
        const empResponse = await fetch(`${API_URL}/vendor/Employelist`); // Your actual endpoint
        if (!empResponse.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const empData = await empResponse.json();
        setEmployees(empData.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
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


  const handleVisibleToChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setForm({ ...form, visible_to: selectedOptions });
  };
  // Save data to the backend (Add or Update)
  const saveData = async () => {
    

    try {
      if (ids === null) {
        // POST request for new data
        const response = await fetch(`${API_URL}/vendor/RIP`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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

  const getDateDiffInDays = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
                          <th>Created Date</th>
                          <th>Created By</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {chats.length > 0 ? (
                          chats.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.employee_name?.first_name}</td>
                              <td>{item.total_volume}</td>
                              <td>{item.no_of_confirmations}</td>
                              <td>{item.from_to_date?.from} to {item.from_to_date?.to}</td>
                              <td>
   (
  {getDateDiffInDays(item.from_to_date?.from, item.from_to_date?.to)} days)
</td>
                              
                              
                              <td>
  {item.visible_to && item.visible_to.length > 0 ? (
    item.visible_to.map((person, index) => (
      <span key={person._id}>
        {person.first_name}
        {index < item.visible_to.length - 1 && ', '}
      </span>
    ))
  ) : (
    <em>No visible users</em>
  )}
</td>
<td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
<td>{item.created_by?.first_name}</td>
<td>{item.status}</td>

                              <td>
                               <button className="btn btn-primary btn-sm w-100">Download Pdf</button>
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
      {addModel && (
  <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{ids ? 'Edit RIP' : 'Add RIP'}</h5>
          <button type="button" className="btn-close" onClick={() => setAddModel(false)}></button>
        </div>
        <div className="modal-body">
          
         <div className="mb-3">
  <label className="form-label">Employee Name</label>
  <select
    name="employee_name"
    className="form-select"
    value={form.employee_name}
    onChange={handleInputChange}
  >
    <option value="">-- Select Employee --</option>
    {employees.map((emp) => (
      <option key={emp._id} value={emp._id}>
        {emp.first_name}
      </option>
    ))}
  </select>
         </div>


         <div className="mb-3">
  <label className="form-label">Visible To</label>
  <select
    multiple
    name="visible_to"
    className="form-select"
    value={form.visible_to}
    onChange={handleVisibleToChange}
  >
    {employees.map((emp) => (
      <option key={emp._id} value={emp._id}>
        {emp.first_name} {emp.last_name}
      </option>
    ))}
  </select>
</div>



          <div className="mb-3">
            <label className="form-label">No Of Confirmation</label>
            <input
              type="text"
              name="no_of_confirmations"
              className="form-control"
              value={form.no_of_confirmations}
              onChange={handleInputChange}
            />
            {error.no_of_confirmations && <small className="text-danger">{error.no_of_confirmations}</small>}
          </div>
          <div className="mb-3">
            <label className="form-label">Total volume</label>
            <input
              type="text"
              name="total_volume"
              className="form-control"
              value={form.total_volume}
              onChange={handleInputChange}
            />
            {error.total_volume && <small className="text-danger">{error.total_volume}</small>}
          </div>

          <div className="mb-3">
  <label className="form-label">From Date</label>
  <input
    type="date"
    name="from_date"
    className="form-control"
    value={form.from_date}
    onChange={handleInputChange}
  />
  {error.from_date && <small className="text-danger">{error.from_date}</small>}
</div>

<div className="mb-3">
  <label className="form-label">To Date</label>
  <input
    type="date"
    name="to_date"
    className="form-control"
    value={form.to_date}
    onChange={handleInputChange}
  />
  {error.to_date && <small className="text-danger">{error.to_date}</small>}
</div>




        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setAddModel(false)}>Close</button>
          <button className="btn btn-primary" onClick={saveData}>{ids ? 'Update' : 'Save'}</button>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Rip;

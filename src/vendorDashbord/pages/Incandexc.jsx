import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { jwtDecode } from 'jwt-decode';

const Incandexc = () => {
  const [inc, setInc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelmodel, setShowDelmodel] = useState(false);
  const [deletid, setDeleteid] = useState(null);

  // State to manage the item being edited
  const [editingItem, setEditingItem] = useState(null);

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const [formData, setFormData] = useState({
    name: '',
    inc_type: '',
    travel_type: '',
    standed_type: ''
  });

  const [err, Seterr] = useState({
    name: '',
    inc_type: '',
    travel_type: '',
    standed_type: ''
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null); // Reset editing item when modal is closed
    setFormData({
      name: '',
      inc_type: '',
      travel_type: '',
      standed_type: ''
    });
  };

  const InputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formValidate = () => {
    let validate = true;
    const message = { name: '', inc_type: '', travel_type: '', standed_type: '' };
    if (!formData.name) {
      validate = false;
      message.name = "Please Enter Exclusive Or Inclusive Names";
    }
    Seterr(message);
    return validate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValidate()) {
      return;
    }
    const { name, inc_type, travel_type, standed_type } = formData;

    try {
      // If editing an existing item, update it
      let response;
      if (editingItem) {
        response = await fetch(`${API_URL}/vendor/inc-exc/${editingItem._id}`, {
          method: 'PUT', // Update the item
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            inc_type,
            travel_type,
            standed_type
          })
        });
      } else {
        // If not editing, create a new item
        response = await fetch(`${API_URL}/vendor/inc-exc/:${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            inc_type,
            travel_type,
            standed_type
          })
        });
      }

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }
      const data = await response.json();
      console.log('Data submitted successfully:', data);
      // Optionally clear the form data after successful submission
      setFormData({
        name: '',
        inc_type: '',
        travel_type: '',
        standed_type: ''
      });

      // Optionally show a success message (can be done via state)
      // toast.success('Inclusion / Exclusion added successfully!');
      if (editingItem) {
        // Update the item in the list
        setInc(inc.map(item => item._id === editingItem._id ? data.data : item));
      } else {
        // Add new item to the list
        setInc(formData => [data.data, ...formData]);
      }

      setShowModal(false);
      setEditingItem(null); // Reset editing item after success
    } catch (error) {
      console.log('Error:', error.message);
      // Optionally show an error message (can be done via state)
      // toast .error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const getInc = async () => {
      try {
        const responce = await fetch(`${API_URL}/vendor/incexc`);
        if (!responce.ok) {
          throw new Error('Data not Fetching here');
        }
        const data = await responce.json();
        setInc(data.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    getInc();
  }, []);

  const confirmDelt = (id) => {
    setDeleteid(id);
    setShowDelmodel(true);
  };

  const cancelDelete = () => {
    setShowDelmodel(false);
  };

  const deleteRow = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/inc-exc/${deletid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setInc(prv => prv.filter(items => items._id !== deletid));
      setShowDelmodel(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const editRow = (id) => {
    const itemToEdit = inc.find(item => item._id === id);
    setEditingItem(itemToEdit);
    setFormData({
      name: itemToEdit.name,
      inc_type: itemToEdit.inc_type,
      travel_type: itemToEdit.travel_type,
      standed_type: itemToEdit.standed_type
    });
    setShowModal(true); // Show the modal in edit mode
  };

  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Inclusions / Exclusions Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Inclusions / Exclusions</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
              + Add Inclusions / Exclusions
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Inclusions / Exclusions Details</h6>
                  <p className="" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  {/* Loading State */}
                  {loading && <p className="text-danger"><center>Loading...</center></p>}

                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead style={{ fontSize: '13px' }}>
                        <tr>
                          <th>S.No</th>
                          <th>Inclusions / Exclusions</th>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Standed Type</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {inc.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.inc_type}</td>
                            <td>{item.name}</td>
                            <td>{item.travel_type}</td>
                            <td>{item.standed_type}</td>
                            <td>{item.standed_type}</td>
                            <td>
                              <button className="btn btn-danger btn-sm" onClick={() => confirmDelt(item._id)}>Delete</button>
                              <button className="btn btn-primary btn-sm" onClick={() => editRow(item._id)}>Edit</button>
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

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">{editingItem ? 'Edit Inclusion / Exclusion' : 'Add Inclusion / Exclusion'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="exampleInputName" className="form-label">Inclusion/Exclusion Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className="form-control"
                        id="exampleInputName"
                        onChange={InputChange}
                      />
                     {err.name && <small className="text-primary">{err.name}</small>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="exampleInputType" className="form-label">Type</label>
                      <select
                        className="form-control"
                        value={formData.inc_type}
                        name="inc_type"
                        id="exampleInputType"
                        onChange={InputChange}
                      >
                        <option value="">--Select--</option>
                        <option>Inclusion</option>
                        <option>Exclusion</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="exampleInputType" className="form-label">Itinerary Type</label>
                      <select
                        className="form-control"
                        name="travel_type"
                        value={formData.travel_type}
                        id="exampleInputType"
                        onChange={InputChange}
                      >
                        <option value="">--Select--</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="exampleInputType" className="form-label">Standed Type</label>
                      <select
                        className="form-control"
                        value={formData.standed_type}
                        name="standed_type"
                        id="exampleInputType"
                        onChange={InputChange}
                      >
                        <option value="">--Select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                    <button type="submit" className="btn btn-primary">{editingItem ? 'Update' : 'Save'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
      {/* Modal for Delete Confirmation */}
      {showDelmodel && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="close" onClick={cancelDelete} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this item?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={deleteRow}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Incandexc;

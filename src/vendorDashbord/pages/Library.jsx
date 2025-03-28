import React, { useState, useEffect } from 'react';

import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';

const Library = () => {
  const [lib, setLib] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // For the delete confirmation modal
  const [deleteId, setDeleteId] = useState(null); // Store the ID of the item to be deleted
  const [newLibrary, setNewLibrary] = useState({
    name: '',
    libra_pdf: null,
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    libra_pdf: '',
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading state for form submission
  const [loadingDelete, setLoadingDelete] = useState(false); // Loading state for delete

  useEffect(() => {
    const fetchLib = async () => {
      try {
        const response = await fetch(`${API_URL}/Lib/Library-Details`);
        if (!response.ok) {
          throw new Error('No Data Available');
        }
        const data = await response.json();
        setLib(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLib();
  }, []);

  // Function to show the delete confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  // Function to delete the library
  const deleteLib = async () => {
    setLoadingDelete(true); // Start loading when delete is triggered
    try {
      const response = await fetch(`${API_URL}/Lib/DeleteLib/${deleteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete library');
      }
      setLib(lib.filter((item) => item._id !== deleteId));
      toast.success('Library deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete library!');
    } finally {
      setShowDeleteConfirm(false); // Close the confirmation modal
      setLoadingDelete(false); // Stop loading after the operation is complete
    }
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLibrary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewLibrary((prev) => ({
      ...prev,
      libra_pdf: file,
    }));
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    let errors = { name: '', libra_pdf: '' };

    // Name validation
    if (!newLibrary.name.trim()) {
      errors.name = 'Library name is required.';
      isValid = false;
    }

    // PDF file validation
    if (!newLibrary.libra_pdf) {
      errors.libra_pdf = 'PDF file is required.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Prevent form submission if invalid
    }

    setLoadingSubmit(true); // Set loading state to true when submitting

    const formData = new FormData();
    formData.append('name', newLibrary.name);
    formData.append('libra_pdf', newLibrary.libra_pdf);

    try {
      const response = await fetch(`${API_URL}/Lib/LibraryS`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to add library');
      }
      const data = await response.json();
      setLib((prevFly) => [data.data, ...prevFly]); 
      setShowModal(false);
      setNewLibrary({ name: '', libra_pdf: null });
      toast.success('Library added successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false); // Stop loading after the operation is complete
    }
  };

  const [query,setQuery]=useState('');

  const QueryData=lib.filter((item)=>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Layout>
      
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Library Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Library</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
            <div className="mr-5">
            <input type="text" className="form-control" name="Search" placeholder="Search..." 
            value={query}  onChange={(e)=>{setQuery(e.target.value)}}/>
            </div>
          <button
            className="btn btn-sm btn-dark mb-3 ms-auto"
            onClick={() => setShowModal(true)}
          >
            + Add Library
          </button>
        </div>
        <ToastContainer />
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Library Details</h6>
                  <p className="" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Explore our library list to check all the details and expiration dates.
                  </p>

                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}

                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Table layout */}
                  {!loading && !error && lib.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>Library Name</th>
                            <th>PDF Link</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {QueryData.map((libs) => {
                            const libpdfName = libs.libra_pdf.split('/').pop(); // Extract filename from URL
                            return (
                              <tr key={libs._id}>
                                <td>{libs.name}</td>
                                <td>
                                  <a
                                    href={libs.libra_pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Download PDF
                                  </a>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-dark"
                                    onClick={() => handleDeleteClick(libs._id)}
                                    disabled={loadingDelete} // Disable the delete button while loading
                                  >
                                    {loadingDelete ? 'Deleting...' : 'Delete'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Message if no library entries */}
                  {!loading && !error && lib.length === 0 && (
                    <p>No library items available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal for adding new library */}
        {showModal && (
          <div className="modal show" style={{ display: 'block' }} onClick={() => setShowModal(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Library</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Library Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newLibrary.name}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                      {formErrors.name && <p className="text-error">{formErrors.name}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="pdf" className="form-label">Upload PDF</label>
                      <input
                        type="file"
                        id="libra_pdf"
                        name="libra_pdf"
                        onChange={handleFileChange}
                        className="form-control"
                        disabled={loadingSubmit} // Disable file input when submitting
                      />
                      {formErrors.libra_pdf && <p className="text-error">{formErrors.libra_pdf}</p>}
                    </div>
                    <button
                      type="submit"
                      className="btn btn-dark"
                      disabled={loadingSubmit} // Disable the submit button while loading
                    >
                      {loadingSubmit ? 'Adding...' : 'Add Library'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation modal for delete */}
        {showDeleteConfirm && (
          <div className="modal show" style={{ display: 'block' }} onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Library</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this library?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={deleteLib}
                    disabled={loadingDelete} // Disable delete button during loading
                  >
                    {loadingDelete ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      
    </Layout>
  );
};

export default Library;

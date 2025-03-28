import React, { useState, useEffect } from 'react';

import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';

const Flyers = () => {
  const [fly, setFly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search,setSearch]=useState('');
  const [newFlyer, setNewFlyer] = useState({
    title: '',
    img: null,
    exp_Date: '',
  });
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [errors, setErrors] = useState({
    title: '',
    img: '',
    exp_Date: '',
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    flyerId: null,
  });

  useEffect(() => {
    const fetchFly = async () => {
      try {
        const response = await fetch(`${API_URL}/flyer/Flyercloudes`);
        if (!response.ok) {
          throw new Error('Failed to fetch flyer details');
        }
        const data = await response.json();
        setFly(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFly();
  }, []);

  const handleDeleteClick = (id) => {
    // Show confirmation modal before deleting
    setDeleteConfirmation({
      show: true,
      flyerId: id,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const { flyerId } = deleteConfirmation;
      const response = await fetch(`${API_URL}/flyer/DeleteFlyer/${flyerId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFly(fly.filter((flyer) => flyer._id !== flyerId));
        toast.success('Flyer Deleted successfully!');
      } else {
        throw new Error('Failed to delete flyer');
      }
    } catch (err) {
      setError(err.message);
    }
    // Close the confirmation modal
    setDeleteConfirmation({ show: false, flyerId: null });
  };

  const handleDeleteCancel = () => {
    // Close the confirmation modal without deleting
    setDeleteConfirmation({ show: false, flyerId: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlyer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewFlyer((prevState) => ({
      ...prevState,
      img: file,
    }));
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    if (!newFlyer.title) {
      newErrors.title = 'Title is required';
      formIsValid = false;
    }

    if (!newFlyer.img) {
      newErrors.img = 'Image is required';
      formIsValid = false;
    }

    if (!newFlyer.exp_Date) {
      newErrors.exp_Date = 'Expiration date is required';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', newFlyer.title);
      formData.append('img', newFlyer.img);
      formData.append('exp_Date', newFlyer.exp_Date);

      try {
        const response = await fetch(`${API_URL}/flyer/Add-coludFlyer`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to add flyer');
        }
        const data = await response.json();
        setFly((prevFly) => [data.data, ...prevFly]); // New flyer is added first
        setShowModal(false);
        toast.success('Flyer added successfully!');
      } catch (err) {
        setError(err.message);
      }
      finally {
        setLoading(false); // Set loading to false once the submission is complete
      }
    }
  };


 const searchData=fly.filter((itm)=>{
      const fly_name=itm.title ? itm.title.toLowerCase() : ''
      const searchrW=search ? search.toLowerCase():''

      return fly_name.includes(searchrW)
 });

  return (
    <Layout>
      
      
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Flyer Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Flyer</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
          <div>
                  <input type="text" name="sdete" value={search} className="form-controller" onChange={(e)=>setSearch(e.target.value)} placeHolder="Search Here ..."/>
                </div>
          <button className="btn btn-sm btn-dark mb-3 ms-auto" onClick={() => setShowModal(true)}>
            + Add Flyer
          </button>
        </div>
        <ToastContainer />
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Flyer Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }} >
                    Explore our flyer list to check all the details and expiration dates.
                  </p>
                  
                  {loading && <p><center>Loading...</center></p>}
                  
                  {error && <p className="text-danger">{error}</p>}

                  {!loading && !error && fly.length > 0 && (
                    <div className="gallery">
                      {searchData.map((flys, index) => (
                        <div key={flys._id} className="gallery-item">
                          <img
                            src={`${flys.img}`}
                            alt={flys.title}
                            className="gallery-image"
                          />
                          <div className="gallery-info">
                            <h5>{flys.title}</h5>
                            <p>{new Date(flys.exp_Date).toLocaleDateString()}</p>
                          </div>
                          <div className="delete-icon" onClick={() => handleDeleteClick(flys._id)}>
                            <i className="bi bi-trash" style={{ fontSize: '24px', color: 'red', cursor: 'pointer' }}></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loading && !error && fly.length === 0 && (
                    <p>No flyers available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal for Add Flyer */}
        {showModal && (
          <div className="modal show" style={{ display: 'block' }} onClick={() => setShowModal(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                
                <div className="modal-header">
                  <h5 className="modal-title">Add New Flyer</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Title</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newFlyer.title}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                      {errors.title && <div className="text-danger">{errors.title}</div>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="img" className="form-label">Upload Image</label>
                      <input
                        type="file"
                        id="img"
                        name="img"
                        onChange={handleImageChange}
                        className="form-control"
                      />
                      {errors.img && <div className="text-danger">{errors.img}</div>}
                    </div>
                    {previewImage && (
                      <div className="mb-3">
                        <label>Image Preview:</label>
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                        />
                      </div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="exp_Date" className="form-label">Expiration Date</label>
                      <input
                        type="date"
                        id="exp_Date"
                        name="exp_Date"
                        value={newFlyer.exp_Date}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                      {errors.exp_Date && <div className="text-danger">{errors.exp_Date}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Flyer'}</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {deleteConfirmation.show && (
          <div className="modal show" style={{ display: 'block' }} onClick={() => setDeleteConfirmation({ show: false, flyerId: null })}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button type="button" className="btn-close" onClick={() => setDeleteConfirmation({ show: false, flyerId: null })}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this flyer?</p>
                  <button className="btn btn-danger" onClick={handleDeleteConfirm}>Yes, Delete</button>
                  <button className="btn btn-secondary" onClick={handleDeleteCancel}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      </Layout>
    
  );
};

export default Flyers;

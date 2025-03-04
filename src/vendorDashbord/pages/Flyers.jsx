import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Flyers = () => {
  const [fly, setFly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newFlyer, setNewFlyer] = useState({
    title: '',
    img: null,
    exp_Date: '',
  });
  const [previewImage, setPreviewImage] = useState(null); // For image preview

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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/flyer/DeleteFlyer/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFly(fly.filter((flyer) => flyer._id !== id));
        //alert('Flyer deleted successfully');
      } else {
        throw new Error('Failed to delete flyer');
      }
    } catch (err) {
      setError(err.message);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setFly((prevFly) => [...prevFly, data.data]);
      setShowModal(false);
      toast.success('Flyer added successfully!');
     
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
          
          <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
            + Add Flyer
          </button>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Flyer Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore our flyer list to check all the details and expiration dates.
                  </p>
                  
                  {loading && <p><center>Loading...</center></p>}
                  
                  {error && <p className="text-danger">{error}</p>}

                  {!loading && !error && fly.length > 0 && (
                    <div className="gallery">
                      {fly.map((flys, index) => (
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
                          <div className="delete-icon" onClick={() => handleDelete(flys._id)}>
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

        {/* Modal for adding new flyer */}
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
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="img" className="form-label">Upload Image</label>
                      <input
                        type="file"
                        id="img"
                        name="img"
                        onChange={handleImageChange}
                        className="form-control"
                        required
                      />
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
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Flyer</button>
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

export default Flyers;

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Flyers = () => {
  const [fly, setFly] = useState([]); // Should be an array to store flyer details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the "Flyers" API endpoint
    const fetchFly = async () => {
      try {
        const response = await fetch(`${API_URL}/flyer/Flyer-list`); // Corrected endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch flyer details');
        }
        const data = await response.json();
        setFly(data.data); // This will store the list of flyers
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFly();
  }, []);

  // Delete function
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/flyer/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFly(fly.filter((flyer) => flyer._id !== id)); // Remove the deleted flyer from state
        alert('Flyer deleted successfully');
      } else {
        throw new Error('Failed to delete flyer');
      }
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
                  
                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}
                  
                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Gallery layout */}
                  {!loading && !error && fly.length > 0 && (
                    <div className="gallery">
                      {/* Loop through the flyer data and display it in a grid */}
                      {fly.map((flys, index) => (
                        <div key={flys._id} className="gallery-item">
                          <img
                            src={`${API_URL}/${flys.img}`}  // Assuming `flys.img` contains the URL of the image
                            alt={flys.title} // Use the title as alt text for accessibility
                            className="gallery-image"
                          />
                          <div className="gallery-info">
                            <h5>{flys.title}</h5>
                            <p>{new Date(flys.exp_Date).toLocaleDateString()}</p>
                          </div>
                          {/* Delete Icon */}
                          <div className="delete-icon" onClick={() => handleDelete(flys._id)}>
                            <i className="bi bi-trash" style={{ fontSize: '24px', color: 'red', cursor: 'pointer' }}></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message if no flyers are available */}
                  {!loading && !error && fly.length === 0 && (
                    <p>No flyers available.</p>
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

export default Flyers;

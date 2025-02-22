import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Library = () => {
  const [lib, setLib] = useState([]); // Use 'lib' for library details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // For controlling modal visibility

  useEffect(() => {
    // Fetch data from the "Library" API endpoint
    const fetchLib = async () => {
      try {
        const response = await fetch(`${API_URL}/Lib/Library-Details`); // Corrected endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch library details');
        }
        const data = await response.json();
        setLib(data.data); // This will store the list of library items
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLib();
  }, []);

  // Delete function to remove library entry
  const deleteLib = async (id) => {
    try {
      const response = await fetch(`${API_URL}/Lib/Library-Details/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete library');
      }
      // Filter out the deleted item from the state
      setLib(lib.filter((item) => item._id !== id));
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
          
          <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
            + Add Library
          </button>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Library Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }}>
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
                          {lib.map((libs) => (
                            <tr key={libs._id}>
                              <td>{libs.name}</td>
                              <td>
                                <a
                                  href={`${API_URL}/${libs.libra_pdf}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Download PDF
                                </a>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => deleteLib(libs._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Message if no library entries are available */}
                  {!loading && !error && lib.length === 0 && (
                    <p>No library items available.</p>
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

export default Library;

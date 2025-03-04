import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Escalation = () => {
  const [escale, setEscale] = useState([]); // Use an array to store multiple hotels
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the "GetHotels" API endpoint
    const fetchCompaints = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/complaints`);
        if (!response.ok) {
          throw new Error('Failed to fetch hotel details');
        }
        const data = await response.json();
        setEscale(data.data); // Store the list of hotels
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompaints();
  }, []);

  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Escalation Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Escalation</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
            <button className="btn btn-sm btn-dark mb-3 ms-auto" onClick={() => setShowModal(true)}>
               + Add Escalation
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{"font-size":"14px"}}>Escalation Details</h6>
                  <p className="" style={{"font-size":"13px", "margin-top":"-15px"}}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  
                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}
                  
                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead>
                      <th>S.No</th>
                      <th>Anonymous</th>
                      <th>Escalation From</th>
                      <th>Concern Specific</th>
                      <th>Escalation Regarding</th>
                      <th>Received Date</th>
                      <th>Status</th>
                      <th>Reason For Close</th>
                      <th> Actions</th>
                      </thead>
                      <tbody style={{fontSize: "13px"}}>
                        {/* Loop through the hotels data and populate the table rows */}
                        {escale.map((esc, index) => (
                          <tr key={esc._id}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{esc.annonymus}</td> {/* Hotel state */}
                            <td>{esc.added_by}</td> {/* Hotel location */}
                            <td>{esc.concern_specific}</td> {/* Hotel name */}
                            <td>{esc.concern}</td> {/* Hotel name */}
                            <td>{esc.created_date}</td> {/* Distance */}
                            <td>{esc.price}</td> {/* Price */}
                            <td>{esc.contact_no}</td> {/* Contact number */}
                            <td><button class="btn btn-sm btn-dark">Action</button></td>
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
      </main>

      <Footer />
    </>
  );
};

export default Escalation;

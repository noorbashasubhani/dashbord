import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Hotels = () => {
  const [hotels, setHotels] = useState([]); // Use an array to store multiple hotels
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the "GetHotels" API endpoint
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Gethotels`);
        if (!response.ok) {
          throw new Error('Failed to fetch hotel details');
        }
        const data = await response.json();
        setHotels(data); // Store the list of hotels
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Hotels Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Hotels</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
               + Add Hotels
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{"font-size":"14px"}}>Hotels Details</h6>
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
                      <thead style={{fontSize:"13px"}}>
                        <tr>
                          <th>S.No</th>
                          <th>Hotel State</th>
                          <th>Hotel Location</th>
                          <th>Hotel Name</th>
                          <th>Distance</th>
                          <th>Price</th>
                          <th>Contact No</th>
                        </tr>
                      </thead>
                      <tbody style={{fontSize: "13px"}}>
                        {/* Loop through the hotels data and populate the table rows */}
                        {hotels.map((hotel, index) => (
                          <tr key={hotel._id}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{hotel.hotel_state}</td> {/* Hotel state */}
                            <td>{hotel.hotel_city}</td> {/* Hotel location */}
                            <td>{hotel.hotel_name}</td> {/* Hotel name */}
                            <td>{hotel.distance_from}</td> {/* Distance */}
                            <td>{hotel.price}</td> {/* Price */}
                            <td>{hotel.contact_no}</td> {/* Contact number */}
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

export default Hotels;

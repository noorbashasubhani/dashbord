import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Destinations = () => {
    const [desing, setdesing] = useState([]);  // Initialize as an empty array
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const getDestinations=async()=>{
    try{
       const responce=await fetch(`${API_URL}/vendor/Destination`);
       if(!responce.ok){
        throw new Error('Data not fetcing');
       }

       const data = await responce.json();
       setdesing(data.data);
        }catch(err){
        console.log(err.message);
        }finally{
            setLoading(false);   
        }
    }
    getDestinations();
  },[]);

  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i class="bi bi-pin-fill mx-2"></i><b>Destinations Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Departments</a>
              </li>
              <li className="breadcrumb-item active">Designation</li>
              
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
               + Add Designation
            </button>
          </nav>
          
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{"font-size":"14px"}}>Departments & Designation Details </h6>
                  <p className="" style={{"font-size":"13px", "margin-top":"-15px"}}>
                  Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.


                    
                  </p>
                  
                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}
                  
                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}
                 
                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <table className="table datatable table-stripped">
                      <thead style={{fontSize:"13px"}}>
                        <tr>
                            <th>S.No</th>
                          <th>Destination Name</th>
                          <th>Country Name</th>
                          <th>Destination Type</th>
                          <th>Latitude</th>
                          <th>Longitude</th>
                          <th>	Is It Country ?</th>
                          <th>Status</th>
                          <th>Action</th>
                          
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {desing.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.destination_name}</td>
                            <td>{item.country_id ? item.country_id : 'N/A'}</td>
                            <td>{item.destination}</td>
                            <td>{item.latitude}</td>
                            <td>{item.longitude}</td>
                            <td>{item.is_country ? 'Yes' : 'No'}</td>
                            <td>{item.is_state ? 'Yes' : 'No'}</td>
                            <td>
                              {/* Action buttons */}
                              <button className="btn btn-warning btn-sm">Edit</button>
                              <button className="btn btn-danger btn-sm">Delete</button>
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
      </main>

      <Footer />
    </>
  );
};

export default Destinations;

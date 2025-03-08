import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const Packages = () => {
const [pack,setPack]=useState([]);

// Get Token Functionlaiye
const token = localStorage.getItem('token');
const decodedToken=jwtDecode(token);
const userId = decodedToken.userId; 



useEffect(()=>{
   const GetFun=async()=>{
    try{
     const arryQuery=await fetch(`${API_URL}/vendor/Package`);
     if(!arryQuery){
       throw new Error('Data no tcom');
     }
     const arrayData = await arryQuery.json();
     setPack(arrayData.data);
    }catch(errr){
     console.log(errr.message);
    }
   }
   GetFun();
},[]);
  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Packages Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Packages</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
          
          <button className="btn btn-sm btn-dark mb-3 ms-auto" onClick={() => setShowModal(true)}>
            + Add Packages
          </button>
        </div>
        <ToastContainer />
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Packages Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }} >
                    Explore our flyer list to check all the details and expiration dates.
                  </p>
                  
                 

                 
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Package Code</th>
                              <th>Package  Name</th>
                              
                              <th>duration</th>
                              <th>city Name</th>
                              <th>Destination</th>
                              <th>Cost</th>
                              <th>Added By</th>
                              
                              <th>Created Date</th>
                              <th style={{width:"420px"}}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                        {/* Ensure 'pack' is an array before calling map */}
                        {Array.isArray(pack) && pack.length > 0 ? (
                          pack.map((items, index) => (
                            <tr key={items._id}> {/* Make sure to use items._id for unique key */}
                              <td>{index + 1}</td> {/* Display the serial number */}
                              <td>{items.package_code}</td> {/* Display package code */}
                              <td>{items.package_name}</td> {/* Display package name */}
                              <td>{items.duration}</td> {/* Display package duration */}
                              <td>{items.city}</td> {/* Display city */}
                              <td>{items.destination}</td> {/* Display destination */}
                              <td>{items.cost}</td> {/* Display cost */}
                              <td>{items.added_by ? items.added_by.name : "Unknown"}</td> {/* Display added by */}
                              <td>{new Date(items.created_at).toLocaleDateString()}</td> {/* Display created date */}
                              <td>
                                {/* Add your actions like View/Edit/Delete here */}
                                <button className="btn btn-sm btn-primary">View</button>
                                <button className="btn btn-sm btn-warning ms-2">Edit</button>
                                <button className="btn btn-sm btn-danger ms-2">Delete</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">No packages found.</td>
                          </tr>
                        )}
                      </tbody>
                    
                        </table>
                      </div>
                  

                 
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

export default Packages;

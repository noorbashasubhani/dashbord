import React, { useState, useEffect, useContext } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { useNavigate } from 'react-router-dom';
import { EmpContext } from '../../../EmpContext';
import { API_URL } from '../data/apiUrl';

const Editprofile = () => {
 
 

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-person-circle mx-2"></i><b>Edit Profile</b></h4>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Profile Information</h6>
                  
                    <div className="d-flex align-items-center">
                      <img alt="Profile" className="rounded-circle" src="assets/img/profile-img.jpg" />
                      <div>
                        <h5></h5>
                        <p></p>
                      </div>
                    </div>
                
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Edit Profile Form */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Bank Details</h4>

                  {/* Profile details form */}
                  <form  className="d-flex flex-wrap justify-content-around">
                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        placeholder="Enter First Name"
                        />
                    </div>

                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        placeholder="Enter Last Name"

                      />
                    </div>

                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="email">E-Mail</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email Id"
                      />
                    </div>

                    <div className="form-group mr-3 mb-3">
                      <button type="submit" className="btn btn-sm btn-primary mt-5">Submit</button>
                    </div>
                  </form>
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

export default Editprofile;

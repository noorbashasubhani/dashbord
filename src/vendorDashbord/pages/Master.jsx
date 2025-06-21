import React, { useState, useEffect } from 'react';

import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';
import { Mybank } from './Mybank';
import Inflow from './Inflow';
import Outflow from './Outflow';
import Investiment from './Investiment';
import Taxes from './Taxes';
import Office_exc from './Office_exc';
import Otherexc from './Otherexc';
import Theam from './Theam';
const Master = () => {
  

  return (
    <Layout>
      
      
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Master Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Master</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
          
          
        </div>
        <ToastContainer />
        <section className="section">
            
          <div className="row">
            
            <div className="col-lg-12">
              <div className="card">
                
                <div className="card-body">
                    
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Bank Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }} >
                    Explore our flyer list to check all the details and expiration dates.
                  </p>
                  <div>
                  <Mybank />
                  <hr></hr>
                  
                  <Inflow />
                  <hr></hr>
                  <Outflow />
                  <hr></hr>
                  <Investiment />
                  <hr></hr>
                  <Taxes />
                  <hr></hr>
                  <Office_exc />
                  <hr></hr>
                  <Otherexc />
                  <hr></hr>
                  <Theam />
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       
       
      </main>
      </Layout>
  );
};

export default Master;

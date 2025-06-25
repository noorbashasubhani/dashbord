import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import DomesticPayments from './DomesticPayments';
import InternationalPyments from './InternationalPayments';

const ReservationTab = () => {
  

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-x-circle mx-2"></i><b>Reservation</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="/">Reservation</a>
              </li>
              <li className="breadcrumb-item active">Package Payments</li>
            </ol>
          </nav>
        </div>

        <section className="section">
  <div className="row">
    <div className="col-lg-12">
      <div className="card">
        <div className="card-body">
          <h6 className="card-title" style={{ fontSize: '14px' }}>Change Password</h6>
          <p className="" style={{ fontSize: '13px', marginTop: '-15px' }}>
            Please enter your new password below.
          </p>

          {/* Tabs */}
          <ul className="nav nav-tabs" id="paymentTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="domestic-tab"
                data-bs-toggle="tab"
                data-bs-target="#domestic"
                type="button"
                role="tab"
                aria-controls="domestic"
                aria-selected="true"
              >
                Domestic Payment
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="international-tab"
                data-bs-toggle="tab"
                data-bs-target="#international"
                type="button"
                role="tab"
                aria-controls="international"
                aria-selected="false"
              >
                International Payments
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content mt-3" id="paymentTabsContent">
            <div
              className="tab-pane fade show active"
              id="domestic"
              role="tabpanel"
              aria-labelledby="domestic-tab"
            >
             <DomesticPayments />
            </div>
            <div
              className="tab-pane fade"
              id="international"
              role="tabpanel"
              aria-labelledby="international-tab"
            >
              <InternationalPyments />
            </div>
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

export default ReservationTab;

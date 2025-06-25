import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import SideMenu from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import DomestiCredits from './DomestiCredits';
import InternationalCredits from './InternationalCredits';
import OngoingCustomer from './OngoingCustomer';
import CompletedCustomer from './CompletedCustomer';

export const CustomerSupports = () => {
  const [activeTab, setActiveTab] = useState('ongoing');

  return (
    <>
      <NavBar />
      <SideMenu />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Customer Supports</b></h4>
        </div>

        {/* Tabs */}
        <div className="d-flex mb-3">
          <button
            className={`btn btn-sm me-2 ${activeTab === 'ongoing' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('ongoing')}
          >
            Ongoing Trips
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Trips
          </button>
        </div>

        <section>
          {activeTab === 'ongoing' && (
            <div>
              {/* Replace with actual Ongoing component */}
              <OngoingCustomer />
            </div>
          )}
          {activeTab === 'completed' && (
            <div>
              {/* Replace with actual Completed component */}
              <CompletedCustomer />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

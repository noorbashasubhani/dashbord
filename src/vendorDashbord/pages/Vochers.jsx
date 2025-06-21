import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Vochers = () => {
  const [activeTab, setActiveTab] = useState('ongoing_domestic');

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4>
              <i className="bi bi-pin-fill mx-2"></i>
              <b>Vouchers Details</b>
            </h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item"><a href="#">Packages</a></li>
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
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Voucher Tabs</h6>
                  
                  {/* Tab Buttons */}
                  <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'ongoing_domestic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ongoing_domestic')}
                      >
                        Ongoing Domestic
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'ongoing_international' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ongoing_international')}
                      >
                        Ongoing International
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'completed_domestic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed_domestic')}
                      >
                        Completed Domestic
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'completed_international' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed_international')}
                      >
                        Completed International
                      </button>
                    </li>
                  </ul>

                  {/* You can add tab content here later */}
                  <div className="mt-4">
                    <p><strong>Selected Tab:</strong> {activeTab.replaceAll('_', ' ')}</p>
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

export default Vochers;

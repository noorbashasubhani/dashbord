import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Allcredite = () => {
  const [domesticData, setDomesticData] = useState([]);
  const [internationalData, setInternationalData] = useState([]);
  const [activeTab, setActiveTab] = useState('domestic');  // State to manage active tab

  // Fetch data for Domestic Creditnotes
  const getDomesticData = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Domestic-Creditnote`);
      if (!response.ok) {
        throw new Error('Error fetching domestic data');
      }
      const data = await response.json();
      setDomesticData(data.data); // Assuming the data is inside the `data` field
    } catch (err) {
      console.error(err.message);
    }
  };

  // Fetch data for International Creditnotes
  const getInternationalData = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Internation-Creditnote`);
      if (!response.ok) {
        throw new Error('Error fetching international data');
      }
      const data = await response.json();
      setInternationalData(data.data); // Assuming the data is inside the `data` field
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    // Fetch both datasets when the component mounts
    getDomesticData();
    getInternationalData();
  }, []);

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4>
            <i className="bi bi-pin-fill mx-2"></i>
            <b>Credit Notes</b>
          </h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Credit Notes</a>
              </li>
              <li className="breadcrumb-item active">All</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <a
                          className={`nav-link ${activeTab === 'domestic' ? 'active' : ''}`}
                          id="domestic-tab"
                          data-bs-toggle="tab"
                          href="#domestic"
                          role="tab"
                          onClick={() => setActiveTab('domestic')}
                        >
                          Domestic Credit Notes
                        </a>
                      </li>
                      <li className="nav-item" role="presentation">
                        <a
                          className={`nav-link ${activeTab === 'international' ? 'active' : ''}`}
                          id="international-tab"
                          data-bs-toggle="tab"
                          href="#international"
                          role="tab"
                          onClick={() => setActiveTab('international')}
                        >
                          International Credit Notes
                        </a>
                      </li>
                    </ul>

                    <div className="tab-content mt-4" id="myTabContent">
                      {/* Domestic Tab */}
                      <div
                        className={`tab-pane fade ${activeTab === 'domestic' ? 'show active' : ''}`}
                        id="domestic"
                        role="tabpanel"
                        aria-labelledby="domestic-tab"
                      >
                        <table className="table datatable table-striped">
                          <thead style={{ fontSize: '13px' }}>
                            <tr>
                              <th>S.No</th>
                              <th>Country Name</th>
                              <th>Supplier Name</th>
                              <th>Issue Date</th>
                              <th>Amount</th>
                              <th>Currency Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {domesticData.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.country_name}</td>
                                <td>{item.sup_name}</td>
                                <td>{item.issue_date}</td>
                                <td>{item.amount}</td>
                                <td>{item.currency_type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* International Tab */}
                      <div
                        className={`tab-pane fade ${activeTab === 'international' ? 'show active' : ''}`}
                        id="international"
                        role="tabpanel"
                        aria-labelledby="international-tab"
                      >
                        <table className="table datatable table-striped">
                          <thead style={{ fontSize: '13px' }}>
                            <tr>
                              <th>S.No</th>
                              <th>Country Name</th>
                              <th>Supplier Name</th>
                              <th>Issue Date</th>
                              <th>Amount</th>
                              <th>Currency Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {internationalData.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.country_name}</td>
                                <td>{item.sup_name}</td>
                                <td>{item.issue_date}</td>
                                <td>{item.amount}</td>
                                <td>{item.currency_type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </h6>
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

export default Allcredite;

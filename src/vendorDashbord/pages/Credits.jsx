import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideMenu from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import DomestiCredits from './DomestiCredits';
import InternationalCredits from './InternationalCredits';

export const Credits = () => {
  const [activeTab, setActiveTab] = useState('domestic');
  const [domesticData, setDomesticData] = useState([]);
  const [internationalData, setInternationalData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    // Fetch each tab's data
    fetch(`${API_URL}/credits/domestic`)
      .then(res => res.json())
      .then(data => setDomesticData(data));

    fetch(`${API_URL}/credits/international`)
      .then(res => res.json())
      .then(data => setInternationalData(data));

    fetch(`${API_URL}/credits/customers`)
      .then(res => res.json())
      .then(data => setCustomerData(data));
  }, []);

  const renderTable = (data) => (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            <td>{item.id}</td>
            <td>{item.amount}</td>
            <td>{item.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <NavBar />
      <SideMenu />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Credits Note</b></h4>
          <nav className="d-flex align-items-center">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item"><a href="#">Credits</a></li>
              <li className="breadcrumb-item active">List</li>
            </ol>
          </nav>
        </div>

        <section>
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'domestic' ? 'active' : ''}`}
                onClick={() => setActiveTab('domestic')}
              >
                Domestic
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'international' ? 'active' : ''}`}
                onClick={() => setActiveTab('international')}
              >
                International
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`}
                onClick={() => setActiveTab('customers')}
              >
                Customers
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {activeTab === 'domestic' && (
              <div className="tab-pane active">
                <DomestiCredits />
              </div>
            )}

            {activeTab === 'international' && (
              <div className="tab-pane active">
                <h5>International Credits</h5>
                <InternationalCredits />
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="tab-pane active">
                <h5>Customer Credits</h5>
                {renderTable(customerData)}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

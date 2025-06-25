import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideMenu from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import DomestiCredits from './DomestiCredits';
import InternationalCredits from './InternationalCredits';

export const Payable = () => {
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
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Payable Report</b></h4>
         
        </div>

        <section>
          
        </section>
      </main>
      <Footer />
    </>
  );
};

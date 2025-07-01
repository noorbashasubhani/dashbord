import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const PartnerReport = () => {
  const [data, setData] = useState([]);
  const [businessData, setBusinessData] = useState({}); // Store business info by partnerId

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/Partners`);
      const result = await res.json();
      if (res.ok) {
        setData(result.data);

        // Fetch business info for each partner
        result.data.forEach((partner) => {
          fetchBusinessByPartner(partner._id);
        });
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const fetchBusinessByPartner = async (partnerId) => {
    try {
      const res = await fetch(`${API_URL}/vendor/calPAR/${partnerId}`);
      const result = await res.json();
      if (res.ok) {
        setBusinessData(prev => ({ ...prev, [partnerId]: result.data }));
      } else {
        setBusinessData(prev => ({ ...prev, [partnerId]: { recent_business: 0, total_business: 0, last_sale_date: null } }));
      }
    } catch (err) {
      console.error('Business fetch error:', err);
      setBusinessData(prev => ({ ...prev, [partnerId]: { recent_business: 0, total_business: 0, last_sale_date: null } }));
    }
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '₹0';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN');
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Partner Business Details</b></h4>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Partner Business Details</h6>
                  <p style={{ fontSize: "13px", marginTop: "-15px" }}>
                    View the latest sales activity and cumulative business value for each partner.
                  </p>

                  <table className="table datatable table-striped">
                    <thead style={{ fontSize: "13px" }}>
                      <tr>
                        <th>S.No</th>
                        <th>Partner Name</th>
                        <th>Partner Type</th>
                        <th>Last Sale Date</th>
                        <th>Recent Business</th>
                        <th>Total Business Till Now</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "13px" }}>
                      {data.length > 0 ? (
                        data.map((item, index) => {
                          const bData = businessData[item._id] || {};
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.first_name || 'N/A'}</td>
                              <td>
                                {item.user_type === 'S'
                                  ? 'Super Partner'
                                  : item.user_type === 'L'
                                  ? 'Lead Generator'
                                  : item.user_type === 'P'
                                  ? 'Sales Partner'
                                  : 'N/A'}
                              </td>
                              <td>{formatDate(bData.last_sale_date)}</td>
                              <td>{formatCurrency(bData.recent_business)}</td>
                              <td>{formatCurrency(bData.total_business)}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

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

export default PartnerReport;

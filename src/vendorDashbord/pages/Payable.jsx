import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideMenu from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

export const Payable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPayableReport();
  }, []);

  const fetchPayableReport = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/payable-report`);
      const json = await res.json();
      if (res.ok) {
        setData(json.data || []);
      } else {
        console.error('Error fetching data:', json.message);
      }
    } catch (err) {
      console.error('Server error:', err.message);
    }
  };

  return (
    <>
      <NavBar />
      <SideMenu />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Payable Report</b></h4>
        </div>

        <section>
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>GHRN NO</th>
                  <th>Customer Name</th>
                  <th>Trip End Date</th>
                  <th>Travel Type</th>
                  <th>Payable Amount</th>
                  <th>Paid Amount</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
  data.map((item, index) => {
    const balance = item.payable_amount - item.paid_amount;
    const balanceStyle = {
      color: item.paid_amount > item.payable_amount  ? 'red' : 'green',
      fontWeight: 'bold'
    };

    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.ghrn_no}</td>
        <td>{item.customer_name}</td>
        <td>{item.trip_end_date?.split('T')[0]}</td>
        <td>{item.holiday_type}</td>
        <td>₹ {item.payable_amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td>₹ {item.paid_amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td style={balanceStyle}>
          ₹ {(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan="8" className="text-center">No data available</td>
  </tr>
)}

              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

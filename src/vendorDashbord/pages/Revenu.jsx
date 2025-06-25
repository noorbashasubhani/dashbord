import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideMenu from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

export const Revenue = () => {
    const [data,setData]=useState([]);

    const getData = async () => {
  try {
    const response = await fetch(`${API_URL}/vendor/Revenus`);

    if (!response.ok) {
      throw new Error(`Failed to fetch revenue data: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result?.data) {
      setData(result.data);
    } else {
      console.warn('API returned no data:', result);
      setData([]);
    }

  } catch (err) {
    console.error('Error fetching revenue data:', err.message);
    setData([]); // Optional: clear data on error
  }
};


    useEffect(()=>{
        getData();
    },[]);

  return (
    <>
      <NavBar />
      <SideMenu />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Revenue Report</b></h4>
        </div>

        <section className="p-4">
        <div>
      
      <div className="table-responsive">
        <table className="table table-bordered table-striped w-full">
            <caption className="caption-top h5 text-center mb-3">Domestic</caption>
          <thead className="table-dark">
            <tr>
              <th>Designation</th>
              <th>Revenue</th>
              <th>Executive</th>
              <th>TL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Operations Executive</td>
              <td>Rs: 0-74999</td>
              <td>0 %</td>
              <td>0 %</td>
            </tr>
            <tr>
              <td>Operations Executive</td>
              <td>Rs: 75000-119999</td>
              <td>4 %</td>
              <td>2 %</td>
            </tr>
            <tr>
              <td>Operations Executive</td>
              <td>Rs: 120000-149999</td>
              <td>5 %</td>
              <td>3 %</td>
            </tr>
            <tr>
              <td>Operations Executive</td>
              <td>Rs: Above 150000</td>
              <td>6 %</td>
              <td>4 %</td>
            </tr>
          </tbody>
        </table>
         <table className="table table-bordered table-striped w-full">
            <caption className="caption-top h5 text-center mb-3">International</caption>
          <thead className="table-dark">
            <tr>
              <th>Designation</th>
              <th>Revenue</th>
              <th>Executive</th>
              <th>TL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Operations Executive</td>
              <td>Rs: 0-89999</td>
              <td>0 %</td>
              <td>0 %</td>
            </tr>
            <tr>
              <td>Operations Executive</td>
              <td>Rs: 90000-149999</td>
              <td>4 %</td>
              <td>2 %</td>
            </tr>
            <tr>
              <td>Operations Executive</td>
              <td>Rs: 150000-199999</td>
              <td>5 %</td>
              <td>3 %</td>
            </tr>
            <tr>
              <td>Operations Executive</td>
              <td>Rs: Above 200000</td>
              <td>6 %</td>
              <td>4 %</td>
            </tr>
          </tbody>
        </table>
         <table className="table table-bordered table-striped w-full">
            <caption className="caption-top h5 text-center mb-3">Customer Support</caption>
          <thead className="table-dark">
            <tr>
              <th>Designation</th>
              <th>Revenue</th>
              <th>Customer Support</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Customer Support</td>
              <td>Rs: Below 1 Lac</td>
              <td>4 %</td>
            </tr>
            <tr>
              <td>Customer Support</td>
              <td>Rs: Above 1 Lac</td>
              <td>5 %</td>
            </tr>
          </tbody>
        </table>
        <table className="table table-bordered table-striped w-full">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Executive Name</th>
      <th>Land Cost</th>
      <th>Gogaga Profit</th>
      <th>Incentive Amount</th>
    </tr>
  </thead>
  <tbody>
    {data && data.length > 0 ? (
  data.map((item, index) => {
    const profit = item.totalGogagaProfit || 0;
    let incentive = 0;

    if (profit <= 74999) {
      incentive = 0;
    } else if (profit >= 75000 && profit <= 119999) {
      incentive = profit * 0.04;
    } else if (profit >= 120000 && profit <= 149999) {
      incentive = profit * 0.05;
    } else if (profit >= 150000) {
      incentive = profit * 0.06;
    }

    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.executiveName || 'N/A'}</td>
        <td>₹ {profit.toLocaleString('en-IN')}</td>
        <td>₹ {item.totalLandCost?.toLocaleString('en-IN') || 0}</td>
        <td>₹ {incentive.toLocaleString('en-IN')}</td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan="5" className="text-center text-muted">No data available</td>
  </tr>
)}

  </tbody>
</table>

      </div>
    </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Revenue;

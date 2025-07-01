import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/gst-invoice`);
      const data = await res.json();
      if (res.ok) {
        setInvoices(data.data);
      } else {
        console.error('Failed to fetch invoices:', data.message);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <>
     
        <div className="container">
          <h5 className="mb-3">All GST Invoices</h5>
          <button
  className="btn btn-primary mb-3"
  onClick={() => window.open('/add-invoice', '_blank')}
>
  Add Invoice
</button>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>GHRN No</th>
                <th>Date of Issue</th>
                <th>Payment Type</th>
                <th>Total Amount</th>
                <th>Rounded Off</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((inv, index) => {
                  const totalAmount = inv.items.reduce((sum, item) => sum + (item.total || 0), 0);
                  return (
                    <tr key={inv._id}>
                      <td>{index + 1}</td>
                      <td>{inv.ghrn_no}</td>
                      <td>{inv.date_of_issue?.split('T')[0]}</td>
                      <td>{inv.payment_type}</td>
                      <td>{totalAmount.toFixed(2)}</td>
                      <td>{inv.rounded_off || 0}</td>
                      <td>{inv.created_by?.name || 'N/A'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No invoice records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
     
      <Footer />
    </>
  );
};

export default Invoice;

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const paymentTypes = [
  { label: 'Full Payment', value: 'Full payment' },
  { label: 'Partial', value: 'Partial payment' },
  { label: 'Pending', value: 'Pending payment' },
];

const Receipts = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    doc_id: '',
    date_of_issue: '',
    payment_type: '',
    total_cost: '',
    payment_received: ''
  });
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/confirm`);
      const data = await res.json();
      setLeads(data.data || []);
    } catch (err) {
      console.error('Failed to fetch leads:', err.message);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pending_payment = form.total_cost - form.payment_received;

    try {
      const res = await fetch(`${API_URL}/vendor/receipts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        body: JSON.stringify({ ...form, pending_payment })
      });

      if (!res.ok) throw new Error('Failed to save receipt');

      setShowModal(false);
      setForm({
        doc_id: '',
        date_of_issue: '',
        payment_type: '',
        total_cost: '',
        payment_received: ''
      });
      setSelectedLead(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <main className="main">
        <div className="container mt-4">
          <button className="btn btn-primary btn-sm mb-3" onClick={() => setShowModal(true)}>Add Receipt</button>

          <h5>All Receipts</h5>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Partner</th>
                <th>Type</th>
                <th>Total</th>
                <th>Received</th>
                <th>Pending</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* map receipt data here */}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
  <div className="modal-header">
    <h5 className="modal-title">Add Receipt</h5>
    <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
  </div>

  {selectedLead && (
    <div className="border rounded p-3 bg-light mt-3">
      <h6 className="mb-3">Lead Information</h6>
      <table className="table table-bordered mb-0">
        <tbody>
          <tr>
            <td><strong>Customer Name:</strong> {selectedLead.customer_name}</td>
            <td><strong>Travel Destination:</strong> {selectedLead.holiday_destination?.destination_name || 'N/A'}</td>
            <td><strong>Travel Start Date:</strong> {new Date(selectedLead.start_date).toLocaleDateString()}</td>
            <td><strong>Total Package Cost:</strong> ₹{selectedLead.calculation_data?.total_package_cost}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )}

  <div className="modal-body">
    <div className="row mb-2 align-items-center">
      <label className="col-sm-4 col-form-label">Lead (Customer)</label>
      <div className="col-sm-8">
        <Select
          options={leads.map(lead => ({
            value: lead._id,
            label: `${lead.customer_name} - ${lead.ghrn_no}`,
            leadData: lead
          }))}
          onChange={(option) => {
            setForm({ ...form, doc_id: option.value });
            setSelectedLead(option.leadData);
          }}
        />
      </div>
    </div>

    <div className="row mb-2 align-items-center">
      <label className="col-sm-4 col-form-label">Date of Issue</label>
      <div className="col-sm-8">
        <input
          type="date"
          className="form-control"
          value={form.date_of_issue}
          onChange={(e) => setForm({ ...form, date_of_issue: e.target.value })}
          required
        />
      </div>
    </div>

    <div className="row mb-2 align-items-center">
      <label className="col-sm-4 col-form-label">Payment Type</label>
      <div className="col-sm-8">
        <Select
          options={paymentTypes}
          onChange={(option) => setForm({ ...form, payment_type: option.value })}
        />
      </div>
    </div>

    <div className="row mb-2 align-items-center">
      <label className="col-sm-4 col-form-label">Total Cost</label>
      <div className="col-sm-8">
        <input
          type="number"
          className="form-control"
          value={form.total_cost}
          onChange={(e) => setForm({ ...form, total_cost: e.target.value })}
          required
        />
      </div>
    </div>

    <div className="row mb-2 align-items-center">
      <label className="col-sm-4 col-form-label">Payment Received</label>
      <div className="col-sm-8">
        <input
          type="number"
          className="form-control"
          value={form.payment_received}
          onChange={(e) => setForm({ ...form, payment_received: e.target.value })}
          required
        />
      </div>
    </div>

    <div className="row mb-2 align-items-center">
      <label className="col-sm-4 col-form-label">Pending Payment</label>
      <div className="col-sm-8">
        <input
          type="number"
          className="form-control"
          value={
            form.total_cost && form.payment_received
              ? Number(form.total_cost) - Number(form.payment_received)
              : ''
          }
          readOnly
        />
      </div>
    </div>
  </div>

  <div className="modal-footer">
    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
    <button type="submit" className="btn btn-primary">Save</button>
  </div>
</form>

            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Receipts;

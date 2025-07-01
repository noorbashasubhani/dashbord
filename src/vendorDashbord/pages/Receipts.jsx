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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    doc_id: '',
    date_of_issue: '',
    payment_type: '',
    total_cost: '',
    payment_received: ''
  });
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [rec,setRec]= useState(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/GHRN-LEAD`);
      const data = await res.json();
      setLeads(data.data || []);
    } catch (err) {
      console.error('Failed to fetch leads:', err.message);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchReceiptlist();
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

  const fetchReceiptlist=async()=>{
    try{
      const dataNew=await fetch(`${API_URL}/vendor/receipts`);
      if(!dataNew.ok){
        throw new Error('Data not fetching');
      }
      const getData=await dataNew.json();
      setRec(getData.data);
    }catch(err){
      console.log(err.message);
    }
  }

  const delFun = (id) => {
  setDeleteId(id);
  setShowDeleteModal(true);
};

const confirmDelete = async () => {
  try {
    const res = await fetch(`${API_URL}/vendor/receipts/${deleteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    });

    if (!res.ok) throw new Error('Failed to delete receipt');

    setShowDeleteModal(false);
    setDeleteId(null);
    fetchReceiptlist(); // refresh list
  } catch (err) {
    console.error('Error deleting receipt:', err.message);
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
                <th>Reference No</th>
                <th>Receipt To</th>
                
                <th>Travel Start Date</th>
                <th>Total</th>
                <th>Received</th>
                <th>Pending</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
           <tbody>
  {Array.isArray(rec) && rec.length > 0 ? (
    rec.map((itms, index) => (
      <tr key={itms._id}>
        <td>{index + 1}</td>
        <td>{itms.doc_id?.ghrn_no || '-'}</td>
        <td>{itms.doc_id?.customer_name || '-'}</td>
        <td>{new Date(itms.doc_id?.start_date).toLocaleDateString() || '-'}</td>
        <td>{itms.total_cost}</td>
        <td>{itms.payment_received}</td>
        <td>{itms.pending_payment}</td>
        <td>{new Date(itms.date_of_issue).toLocaleDateString()}</td>
        <td><button className="btn btn-danger btn-sm" onClick={()=>delFun(itms._id)}>Delete</button></td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="9" className="text-center">No receipts found</td>
    </tr>
  )}
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
            <td><strong>Total Package Cost:</strong> ₹{selectedLead.total_amount}</td>
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
    const lead = option.leadData;
    setSelectedLead(lead);
    setForm({
      ...form,
      doc_id: option.value,
      total_cost: lead.total_amount || ''
    });
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
      {showDeleteModal && (
  <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Deletion</h5>
          <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} />
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this receipt?</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
        </div>
      </div>
    </div>
  </div>
)}

      <Footer />
    </>
  );
};

export default Receipts;

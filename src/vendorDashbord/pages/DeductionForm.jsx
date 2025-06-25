import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const deductionTypes = [
  { label: 'One Time', value: 'one_time' },
  { label: 'Recurring', value: 'recurring' }
];

const deductionTowardsOptions = [
  { label: 'Packages', value: 'packages' },
  { label: 'Others', value: 'others' }
];

const DeductionForm = () => {
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [deductions, setDeductions] = useState([]);
  const [viewModalItem, setViewModalItem] = useState(null);

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [deductionType, setDeductionType] = useState(null);
  const [cycle, setCycle] = useState('');
  const [amount, setAmount] = useState('');
  const [deductionTowards, setDeductionTowards] = useState(null);
  const [ghrnNumber, setGhrnNumber] = useState('');
  const [particulars, setParticulars] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch partners for dropdown
    (async () => {
      try {
        const res = await fetch(`${API_URL}/vendor/Employelist`);
        const json = await res.json();
        const formatted = (json.data || []).map(p => ({ label: p.first_name, value: p._id }));
        setPartners(formatted);
      } catch (err) {
        console.error('Error fetching partners', err);
      } finally {
        setLoadingPartners(false);
      }
    })();

    // Fetch existing deductions to display in table
    (async () => {
      try {
        const res = await fetch(`${API_URL}/vendor/Deductions`);
        const json = await res.json();
        setDeductions(json.data || []);
      } catch (err) {
        console.error('Error fetching deductions', err);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      partnerId: selectedPartner?.value,
      deductionType: deductionType?.value,
      cycle: deductionType?.value === 'one_time' ? cycle : '',
      amount: parseFloat(amount),
      deductionTowards: deductionTowards?.value,
      ghrnNumber: deductionTowards?.value === 'others' ? ghrnNumber : '',
      particulars
    };

    try {
      const res = await fetch(`${API_URL}/vendor/Deductions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (res.ok) {
        setDeductions(prev => [result.data, ...prev]);
        setShowModal(false);
        // reset form
        setSelectedPartner(null);
        setDeductionType(null);
        setCycle('');
        setAmount('');
        setDeductionTowards(null);
        setGhrnNumber('');
        setParticulars('');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to save deduction');
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-sliders mx-2"></i><b>Partners Deduction</b></h4>
          <button className="btn btn-dark btn-sm" onClick={() => setShowModal(true)}>
            + Add Deduction
          </button>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Deduction</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}/>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Partner</label>
                        <Select
                          options={partners}
                          isLoading={loadingPartners}
                          onChange={setSelectedPartner}
                          value={selectedPartner}
                          placeholder="Select partner..."
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Deduction Type</label>
                        <Select
                          options={deductionTypes}
                          onChange={setDeductionType}
                          value={deductionType}
                          placeholder="Choose type..."
                        />
                      </div>
                      {deductionType?.value === 'one_time' && (
                        <div className="col-md-6 mb-3">
                          <label>Deduction Cycle</label>
                          <input
                            type="month"
                            className="form-control"
                            value={cycle}
                            onChange={e => setCycle(e.target.value)}
                          />
                        </div>
                      )}
                      <div className="col-md-6 mb-3">
                        <label>Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Deduction Towards</label>
                        <Select
                          options={deductionTowardsOptions}
                          onChange={setDeductionTowards}
                          value={deductionTowards}
                          placeholder="Select towards..."
                        />
                      </div>
                      {deductionTowards?.value === 'packages' && (
                        <div className="col-md-6 mb-3">
                          <label>GHRN Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={ghrnNumber}
                            onChange={e => setGhrnNumber(e.target.value)}
                          />
                        </div>
                      )}
                      <div className="col-12 mb-3">
                        <label>Particulars</label>
                        <textarea
                          className="form-control"
                          value={particulars}
                          onChange={e => setParticulars(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deductions Table */}
        <div className="container mt-4">
          <h5>All Deductions</h5>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Partner</th>
                <th>Type</th>
                <th>Cycle</th>
                <th>Amount</th>
                <th>Towards</th>
                <th>GHRN No</th>
                <th>Particulars</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deductions.map((d, idx) => (
                <tr key={idx}>
                    <td>{idx+1}</td>
                  <td>{d.partnerId?.first_name}</td>
                  <td>{d.deductionType === 'one_time' ? 'One Time' : 'Recurring'}</td>
                  <td>{d.cycle || '-'}</td>
                  <td>₹{d.amount}</td>
                  <td>{d.deductionTowards}</td>
                  <td>{d.ghrnNumber || '-'}</td>
                  <td>{d.particulars}</td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => setViewModalItem(d)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        {viewModalItem && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Deduction Details</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setViewModalItem(null)}/>
                </div>
                <div className="modal-body">
                  <p><strong>Partner:</strong> {viewModalItem.partnerId.name}</p>
                  <p><strong>Type:</strong> {viewModalItem.deductionType === 'one_time' ? 'One Time' : 'Recurring'}</p>
                  <p><strong>Cycle:</strong> {viewModalItem.cycle || '-'}</p>
                  <p><strong>Amount:</strong> ₹{viewModalItem.amount}</p>
                  <p><strong>Towards:</strong> {viewModalItem.deductionTowards}</p>
                  <p><strong>GHRN No:</strong> {viewModalItem.ghrnNumber || '-'}</p>
                  <p><strong>Particulars:</strong> {viewModalItem.particulars}</p>
                  <p><strong>Date:</strong> {new Date(viewModalItem.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setViewModalItem(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default DeductionForm;

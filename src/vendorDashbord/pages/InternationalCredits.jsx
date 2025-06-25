import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';

const InternationalCredits = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [form, setForm] = useState({
    city: '',
    serviceType: '',
    supplierName: '',
    cnIssuedDate: '',
    validTill: '',
    refNumber: '',
    amount: '',
    currency_rate: '',
    travel_type: 'I'
  });

  useEffect(() => {
    getDome();
  }, []);

  const getDome = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/Domesti-Credit-list`);
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleShow = () => {
    setForm({
      city: '',
      serviceType: '',
      supplierName: '',
      cnIssuedDate: '',
      validTill: '',
      refNumber: '',
      amount: '',
      currency_rate: '',
      travel_type: 'I',
    });
    setSelectedCredit(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedCredit(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const url = selectedCredit && !selectedCredit.viewOnly
      ? `${API_URL}/vendor/CreditsUpdate/${selectedCredit._id}`
      : `${API_URL}/vendor/CreditsAdd`;
    const method = selectedCredit && !selectedCredit.viewOnly ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.data) {
        getDome();
        handleClose();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (credit) => {
    setSelectedCredit({ ...credit, viewOnly: false });
    setForm({
      city: credit.city || '',
      serviceType: credit.serviceType || '',
      supplierName: credit.supplierName || '',
      cnIssuedDate: credit.cnIssuedDate?.slice(0, 10) || '',
      validTill: credit.validTill?.slice(0, 10) || '',
      refNumber: credit.refNumber || '',
      amount: credit.amount || '',
      currency_rate: credit.currency_rate || '',
      travel_type: credit.travel_type || 'I',
    });
    setShowModal(true);
  };

  const handleView = (credit) => {
    setSelectedCredit({ ...credit, viewOnly: true });
    setForm({
      city: credit.city || '',
      serviceType: credit.serviceType || '',
      supplierName: credit.supplierName || '',
      cnIssuedDate: credit.cnIssuedDate?.slice(0, 10) || '',
      validTill: credit.validTill?.slice(0, 10) || '',
      refNumber: credit.refNumber || '',
      amount: credit.amount || '',
      currency_rate: credit.currency_rate || '',
      travel_type: credit.travel_type || 'I',
    });
    setShowModal(true);
  };

  return (
    <div className="table-responsive">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-sm btn-primary" onClick={handleShow}>+ Add Credit</button>
      </div>

      {showModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedCredit ? (selectedCredit.viewOnly ? 'View Credit' : 'Edit Credit') : 'Add Credit'}
                </h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    {['city', 'supplierName', 'refNumber'].map((field) => (
                      <div className="mb-3 col-md-6" key={field}>
                        <label className="form-label">{field.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                          type="text"
                          className="form-control"
                          name={field}
                          value={form[field]}
                          onChange={handleChange}
                          readOnly={selectedCredit?.viewOnly}
                        />
                      </div>
                    ))}
                    <div className="mb-3 col-md-6">
                      <label className="form-label">List Of Currency</label>
                      <select
                        className="form-select"
                        name="currency_rate"
                        value={form.currency_rate}
                        onChange={handleChange}
                        disabled={selectedCredit?.viewOnly}
                      >
                        <option value="">-- Select --</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="THB">THB</option>
                        <option value="IDR">IDR</option>
                        <option value="SGD">SGD</option>
                        <option value="MYR">MYR</option>
                        <option value="AED">AED</option>
                        <option value="AUD">AUD</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Travel Type</label>
                      <select
                        className="form-select"
                        name="travel_type"
                        value={form.travel_type}
                        onChange={handleChange}
                        disabled={selectedCredit?.viewOnly}
                      >
                        <option value="D">Domestic</option>
                        <option value="I">International</option>
                      </select>
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label">CN Issued Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="cnIssuedDate"
                        value={form.cnIssuedDate}
                        onChange={handleChange}
                        readOnly={selectedCredit?.viewOnly}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Valid Till</label>
                      <input
                        type="date"
                        className="form-control"
                        name="validTill"
                        value={form.validTill}
                        onChange={handleChange}
                        readOnly={selectedCredit?.viewOnly}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        readOnly={selectedCredit?.viewOnly}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                {!selectedCredit?.viewOnly && (
                  <button className="btn btn-primary" onClick={handleSave}>
                    {selectedCredit ? 'Update' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>S.No</th>
            <th>Country</th>
            
            <th>Currency Type</th>
            <th>Travel Type</th>
            <th>CN Issued</th>
            <th>Ref No</th>
            <th>Used Ref No</th>
            <th>Amount</th>
            <th>Used</th>
            <th>Balance</th>
            <th>Valid Till</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data
  .filter(item => item.travel_type === 'I') // ← Only show International entries
  .map((item, i) => {
    const balance = item.amount - (item.usedAmount || 0);
    return (
      <tr key={item._id}>
        <td>{i + 1}</td>
        <td>{item.city}</td>
        <td>{item.currency_rate}</td>
        <td>{item.travel_type === 'I' ? 'International' : 'Domestic'}</td>
        <td>{item.cnIssuedDate?.slice(0, 10)}</td>
        <td>{item.refNumber}</td>
        <td>{item.usedRefNumber || '-'}</td>
        <td>{item.amount}</td>
        <td>{item.usedAmount || 0}</td>
        <td>{balance}</td>
        <td>{item.validTill?.slice(0, 10)}</td>
        <td>{item.status || 'Active'}</td>
        <td>
          <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(item)}>Edit</button>
          <button className="btn btn-sm btn-primary" onClick={() => handleView(item)}>View</button>
        </td>
      </tr>
    );
  })}

        </tbody>
      </table>
    </div>
  );
};

export default InternationalCredits;

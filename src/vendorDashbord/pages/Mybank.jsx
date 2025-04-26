import React, { useState,useEffect } from 'react';
import { API_URL } from '../data/apiUrl';

export const Mybank = () => {
  const [showModal, setShowModal] = useState(false);
  const [bankList, setBankList] = useState([]);

  const [formData, setFormData] = useState({
    bank_name: '',
    acc_no: '',
    nice_name: '',
  });

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const res = await fetch(`${API_URL}/vendor/My-bank`);
        const data = await res.json();
        setBankList(data.data);
      } catch (err) {
        console.error('Failed to fetch bank data:', err);
      }
    };
  
    fetchBankData();
  }, []);

  const funBank = () => {
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/vendor/My-bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        //alert('Bank added successfully!');
        setShowModal(false);
        setFormData({ bank_name: '', acc_no: '', nice_name: '' });
        setBankList((prev) => [result.data,...prev]);

      } else {
        alert(result.message || 'Failed to add bank');
      }
    } catch (err) {
      alert('Something went wrong!');
      console.error(err);
    }
  };

  return (
    <div>
      <button className="btn btn-sm btn-primary" onClick={funBank}>+ Add My Bank</button>
      {bankList.length > 0 && (
  <table className="table mt-3">
    <thead>
      <tr>
        <th>Bank Name</th>
        <th>Account No</th>
        <th>Nice Name</th>
      </tr>
    </thead>
    <tbody>
      {bankList.map((bank, index) => (
        <tr key={index}>
          <td>{bank.bank_name}</td>
          <td>{bank.acc_no}</td>
          <td>{bank.nice_name}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Bank</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="acc_no"
                      value={formData.acc_no}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nice Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nice_name"
                      value={formData.nice_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Bank
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

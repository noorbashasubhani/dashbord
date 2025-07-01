import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';

const Tcs = ({ customerData, row_id, onUpdate }) => {
  const [tcsData, setTcsData] = useState([]);
  const [form, setForm] = useState({
    is_customer_paying_tcs: '',
    tcs_per: '',
    tcs_amount: '',
    invoice: '',
    adhar: ''
  });

  // Fetch existing TCS records
  const fetchTcsData = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/tcs/${row_id}`);
      const result = await response.json();
      setTcsData(result.data || []);
       if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error fetching TCS data:', err);
    }
  };

  // Auto-calculate TCS amount when tcs_per changes
  

  useEffect(() => {
    fetchTcsData();
  }, [row_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!row_id) return alert("Row ID is missing");

    try {
      const response = await fetch(`${API_URL}/vendor/tcs/${row_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, doc_id: row_id })
      });

      if (!response.ok) throw new Error("Failed to save TCS");

     
      fetchTcsData();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      alert("Error saving TCS data");
    }
  };

  return (
    <div className="row mt-5">
      <div className="col-lg-12" style={{ backgroundColor: '#e5550d' }}>
        <div className="card p-3">
          <h3 style={{ fontSize: '16px' }}>Add TCS Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3">
                <label>Is Customer Paying TCS?</label>
                <select
                  name="is_customer_paying_tcs"
                  className="form-control"
                  value={form.is_customer_paying_tcs}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
           {form.is_customer_paying_tcs === 'Yes' && (
            <>
              <div className="col-md-2">
                <label>Total TCS (%)</label>
                <input
                  type="number"
                  className="form-control"
                  name="tcs_per"
                  value={form.tcs_per}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-2">
                <label>Total TCS Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="tcs_amount"
                  value={form.tcs_amount}
                    onChange={handleChange}
                />
              </div>

              <div className="col-md-2">
                <label>Invoice Required?</label>
                <select
                  name="invoice"
                  className="form-control"
                  value={form.invoice}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="col-md-2">
                <label>Aadhar Linked to PAN?</label>
                <select
                  name="adhar"
                  className="form-control"
                  value={form.adhar}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              </>
           )}

              <div className="col-md-1 d-flex align-items-end">
                <button className="btn btn-success btn-sm" type="submit">Add</button>
              </div>
            </div>
          </form>
        </div>

        <table className="table table-striped table-bordered table-sm small mt-3">
          <thead>
            <tr>
              <th>Customer Paying TCS?</th>
              <th>TCS %</th>
              <th>TCS Amount</th>
              <th>Invoice?</th>
              <th>Aadhar Linked?</th>
            </tr>
          </thead>
          <tbody>
            {tcsData.map((tcs, idx) => (
              <tr key={idx}>
                <td>{tcs.is_customer_paying_tcs}</td>
                <td>{tcs.tcs_per}</td>
                <td>{tcs.tcs_amount}</td>
                <td>{tcs.invoice}</td>
                <td>{tcs.adhar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tcs;

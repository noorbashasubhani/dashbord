import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';

const InternationalSuppliers = ({ row_id }) => {
  const [form, setForm] = useState({
    destination: '',
    company_name: '',
    service: '',
    contact_number: '',
    sup_mail: '',
    sup_quote: '',
    sup_currecny: '',
    currency_rate: '',
    total_cost: '',
    total_cost_consider: '',
    cost_bifurication: ''
  });
const [editingId, setEditingId] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false); // <-- Toggle state

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Supplier/${row_id}`);
      const data = await response.json();
      setSuppliers(data.data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  useEffect(() => {
    if (row_id) {
      fetchSuppliers();
    }
  }, [row_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `${API_URL}/vendor/Supplier/${editingId}`
      : `${API_URL}/vendor/Supplier/${row_id}`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, doc_id: row_id })
    });

    if (!response.ok) throw new Error('Save failed');
    
    // Reset form
    setForm({
      destination: '',
      company_name: '',
      service: '',
      contact_number: '',
      sup_mail: '',
      sup_quote: '',
      sup_currecny: '',
      currency_rate: '',
      total_cost: '',
      total_cost_consider: '',
      cost_bifurication: ''
    });
    setShowForm(false);
    setEditingId(null);
    fetchSuppliers();
    
  } catch (err) {
    alert('Error saving supplier');
    console.error(err);
  }
};





const handleEdit = (supplier) => {
  setForm({
    destination: supplier.destination || '',
    company_name: supplier.company_name || '',
    service: supplier.service || '',
    contact_number: supplier.contact_number || '',
    sup_mail: supplier.sup_mail || '',
    sup_quote: supplier.sup_quote || '',
    sup_currecny: supplier.sup_currecny || '',
    currency_rate: supplier.currency_rate || '',
    total_cost: supplier.total_cost || '',
    total_cost_consider: supplier.total_cost_consider || '',
    cost_bifurication: supplier.cost_bifurication || ''
  });
  setEditingId(supplier._id);
  setShowForm(true); // optional: auto-open form on edit
};

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure to delete?')) return;
  try {
    const response = await fetch(`${API_URL}/vendor/Supplier/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Delete failed');
    fetchSuppliers();
  } catch (err) {
    alert('Error deleting supplier');
    console.error(err);
  }
};


  return (
    <div className="row mt-5">
      <div className="col-lg-12">
        <div className="card p-3 shadow">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Add International Supplier</h5>
            <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Close' : '+ Add'}
            </button>
             
          </div>

          {showForm && (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <label>Mail Draft</label>
                  <textarea
                    name="sup_mail"
                    className="form-control"
                    value={form.sup_mail}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12">
                  <label>Suppliers Quotes</label>
                  <textarea
                    name="sup_quote"
                    className="form-control"
                    value={form.sup_quote}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Services Type</label>
                  <input
                    type="text"
                    name="service"
                    className="form-control"
                    value={form.service}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Destination</label>
                  <input
                    type="text"
                    name="destination"
                    className="form-control"
                    value={form.destination}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    className="form-control"
                    value={form.company_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    className="form-control"
                    value={form.contact_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Currency Type</label>
                  <input
                    type="text"
                    name="sup_currecny"
                    className="form-control"
                    value={form.sup_currecny}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Currency Rate</label>
                  <input
                    type="number"
                    name="currency_rate"
                    className="form-control"
                    value={form.currency_rate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Total Cost</label>
                  <input
                    type="number"
                    name="total_cost"
                    className="form-control"
                    value={form.total_cost}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Total Cost Consider</label>
                  <input
                    type="number"
                    name="total_cost_consider"
                    className="form-control"
                    value={form.total_cost_consider}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12">
                  <label>Cost Bifurcation</label>
                  <textarea
                    name="cost_bifurication"
                    className="form-control"
                    value={form.cost_bifurication}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button className="btn btn-primary btn-sm" type="submit">
  {editingId ? 'Update' : 'Save'}
</button>
                  <button className="btn btn-dark btn-sm" type="submit">Cancel</button>
                </div>
              </div>
            </form>
          )}
        </div>

        <table className="table table-bordered table-striped table-sm mt-4">
  <thead>
    <tr>
      <th>Mail Draft</th>
      <th>Suppliers Quotes</th>
      <th>Services Type</th>
      <th>Destination</th>
      <th>Company Name</th>
      <th>Contact Number</th>
      <th>Currency Type</th>
      <th>Total Cost</th>
      <th>Total Cost Consider</th>
      <th>Cost Bifurcation</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {suppliers.map((sup, index) => (
      <tr key={index}>
        <td>{sup.sup_mail}</td>
        <td>{sup.sup_quote}</td>
        <td>{sup.service}</td>
        <td>{sup.destination}</td>
        <td>{sup.company_name}</td>
        <td>{sup.contact_number}</td>
        <td>{sup.sup_currecny}</td>
        <td>{sup.total_cost}</td>
        <td>{sup.total_cost_consider}</td>
        <td>{sup.cost_bifurication}</td>
        <td>
          <button
            className="btn btn-sm btn-warning me-1"
            onClick={() => handleEdit(sup)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(sup._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default InternationalSuppliers;

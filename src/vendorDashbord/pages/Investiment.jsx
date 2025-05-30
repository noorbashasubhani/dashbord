import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';

const Investiment = () => {
  // State for managing inflows and form data
  const [inflows, setInflows] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [showModal, setShowModal] = useState(false);

  // Handle form changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Fetch inflows when component mounts
  useEffect(() => {
    const fetchInflows = async () => {
      try {
        const res = await fetch(`${API_URL}/vendor/Invest`);
        const data = await res.json();
        setInflows(data.data); // Assuming the response is an array of inflows
      } catch (err) {
        console.error('Failed to fetch inflows:', err);
      }
    };
    fetchInflows();
  }, []);

  // Handle form submit (add inflow)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/vendor/Invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
       // alert('Inflow added successfully!');
        setInflows((prev) => [...prev, result.data]); // Add the new inflow to the list
        setFormData({ name: '' }); // Clear form data
        setShowModal(false); // Close modal
      } else {
        alert(result.message || 'Failed to add inflow');
      }
    } catch (err) {
      alert('Something went wrong!');
      console.error(err);
    }
  };

  return (
    <div>
      <button className="btn btn-sm btn-primary" onClick={() => setShowModal(true)}>
        + Add Investiment
      </button>

      {/* Modal to Add Inflow */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Investiment</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Investiment Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
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
                    Save Invest
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table to Display Inflows */}
      <div className="mt-4">
        <h3>Investiment List</h3>
        {inflows.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {inflows.map((inflow, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{inflow.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No inflows available</p>
        )}
      </div>
    </div>
  );
};

export default Investiment;

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Recovery = () => {
  const [emp, setEmp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newRecovery, setNewRecovery] = useState({
    recovery_name: '',
    service_type: '',
    total_amount: '',
    paid_amount: '',
    pending_amount: 0,
  });
  const [selectedRecovery, setSelectedRecovery] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch all recovery data
  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Recovery`);
        if (!response.ok) throw new Error('Failed to fetch recovery details');
        const data = await response.json();
        setEmp(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmp();
  }, []);

  const resetForm = () => {
    setNewRecovery({
      recovery_name: '',
      service_type: '',
      total_amount: '',
      paid_amount: '',
      pending_amount: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecovery((prev) => {
      const updated = { ...prev, [name]: value };
      updated.pending_amount =
        updated.total_amount && updated.paid_amount
          ? updated.total_amount - updated.paid_amount
          : 0;
      return updated;
    });
  };

  const handleAddRecovery = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Recovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecovery),
      });

      if (!response.ok) throw new Error('Failed to add recovery');

      const result = await response.json();
      setEmp((prev) => [...prev, result.data]);
      setAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Add error:', error.message);
    }
  };

  const handleEdit = (recovery) => {
    setSelectedRecovery(recovery);
    setEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecovery((prev) => {
      const updated = { ...prev, [name]: value };
      updated.pending_amount =
        updated.total_amount && updated.paid_amount
          ? updated.total_amount - updated.paid_amount
          : 0;
      return updated;
    });
  };

  const handleUpdateRecovery = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Recovery/${selectedRecovery._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedRecovery),
      });

      if (!response.ok) throw new Error('Failed to update recovery');

      const result = await response.json();
      setEmp((prev) =>
        prev.map((item) => (item._id === result.data._id ? result.data : item))
      );
      setEditModal(false);
      setSelectedRecovery(null);
    } catch (error) {
      console.error('Update error:', error.message);
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-person-fill mx-2" /> <b>Recovery Details</b></h4>
          <nav>
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item"><a href="/">Recovery</a></li>
              <li className="breadcrumb-item active">List</li>
              <li className="btn btn-sm btn-primary" onClick={() => setAddModal(true)}>+ Add</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Users Details</h6>
                  {loading && <p><center>Loading...</center></p>}
                  {error && <p className="text-danger">{error}</p>}

                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Date</th>
                          <th>Name</th>
                          <th>Service Type</th>
                          <th>Total</th>
                          <th>Paid</th>
                          <th>Pending</th>
                          <th>Status</th>
                          <th>Added By</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emp.map((e, i) => (
                          <tr key={e._id}>
                            <td>{i + 1}</td>
                            <td>{e.createdAt?.substring(0, 10)}</td>
                            <td>{e.recovery_name}</td>
                            <td>{e.service_type}</td>
                            <td>{e.total_amount}</td>
                            <td>{e.paid_amount}</td>
                            <td>{e.pending_amount}</td>
                            <td>{e.pending_amount == 0 ? 'Clear' : 'Pending'}</td>
                            <td>{e.added_by?.first_name}</td>
                            <td>
                              {e.pending_amount !== 0 && (
                                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(e)}>Edit</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add Modal */}
        {addModal && (
          <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Recovery</h5>
                  <button type="button" className="btn-close" onClick={() => setAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  {['recovery_name', 'total_amount', 'paid_amount'].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">{field.replace('_', ' ').toUpperCase()}</label>
                      <input
                        type={field.includes('amount') ? 'number' : 'text'}
                        className="form-control"
                        name={field}
                        value={newRecovery[field]}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                  <div className="mb-3">
                    <label className="form-label">Service Type</label>
                    <select className="form-select" name="service_type" value={newRecovery.service_type} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Repair">Repair</option>
                      <option value="Consultation">Consultation</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Pending Amount</label>
                    <input type="number" className="form-control" value={newRecovery.pending_amount} readOnly />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary btn-sm" onClick={() => setAddModal(false)}>Cancel</button>
                  <button className="btn btn-success btn-sm" onClick={handleAddRecovery}>Add</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal && selectedRecovery && (
          <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Recovery</h5>
                  <button type="button" className="btn-close" onClick={() => setEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  {['recovery_name', 'total_amount', 'paid_amount'].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">{field.replace('_', ' ').toUpperCase()}</label>
                      <input
                        type={field.includes('amount') ? 'number' : 'text'}
                        className="form-control"
                        name={field}
                        value={selectedRecovery[field]}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  ))}
                  <div className="mb-3">
                    <label className="form-label">Service Type</label>
                    <select className="form-select" name="service_type" value={selectedRecovery.service_type} onChange={handleEditInputChange}>
                      <option value="">Select</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Repair">Repair</option>
                      <option value="Consultation">Consultation</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Pending Amount</label>
                    <input type="number" className="form-control" value={selectedRecovery.pending_amount} readOnly />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditModal(false)}>Cancel</button>
                  <button className="btn btn-success btn-sm" onClick={handleUpdateRecovery}>Update</button>
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

export default Recovery;

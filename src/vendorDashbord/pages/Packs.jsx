import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


export const Packs = ({ row_id }) => {
  const navigate = useNavigate(); 
  const [form, setForm] = useState({
    cost_sheet: '',
    package_them: '',
    quation_validate: '',
    payment_terms: '',
    doc_id: row_id,
    itenary_status: ''
  });
  const [packData, setPackData] = useState(null);
  const [them, setThem] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchPack();
    getThems();
  }, [row_id]);

  const getThems = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Theams`);
      const data = await response.json();
      setThem(data.data || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchPack = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/FormPack/${row_id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data?.data) {
        setPackData(data.data);
        setForm({
          cost_sheet: data.data.cost_sheet || '',
          package_them: data.data.package_them?._id || data.data.package_them || '',
          quation_validate: data.data.quation_validate?.substring(0, 10) || '',
          payment_terms: data.data.payment_terms || '',
          doc_id: row_id,
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitConfirmed = async () => {
  try {
    const method = packData ? 'PUT' : 'POST';
    const url = packData
      ? `${API_URL}/vendor/FormPack/${packData._id}`
      : `${API_URL}/vendor/FormPack/${row_id}`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    if (!res.ok) {
      if (result.message && result.message.includes("Calculation must be fully approved")) {
        toast.warning("All three partners must approve the calculation (Super, Sales, Lead).");
      } else {
        toast.error(result.message || "Something went wrong");
      }
      return;
    }

    toast.success("Form Pack saved successfully!");
    fetchPack();
    navigate('/Pending-Itenary');

  } catch (err) {
    toast.error(`Error: ${err.message}`);
  } finally {
    setShowConfirmModal(false);
  }
};


  return (
    <div className="row mt-5">
      <div className="col-lg-12" style={{ backgroundColor: 'black' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>
              Package Details
            </h3>
            <hr />
            <h4>{packData ? 'Update' : 'Add'} Package Details</h4>

            <div className="row">
              <div className="col-md-3 mb-2">
                <label>Quotation Valid Till</label>
                <input
                  type="date"
                  name="quation_validate"
                  className="form-control"
                  value={form.quation_validate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3 mb-2">
                <label>Cost Sheet</label>
                <input
                  type="url"
                  name="cost_sheet"
                  className="form-control"
                  value={form.cost_sheet}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3 mb-2">
                <label>Select Theme</label>
                <select
                  name="package_them"
                  className="form-control"
                  value={form.package_them || ''}
                  onChange={handleChange}
                >
                  <option value="">-- Select Theme --</option>
                  {them.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.destination_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-2">
                <label>Image Preview</label>
                {form.package_them && (
                  <div className="mt-2">
                    {them
                      .filter((item) => item._id === form.package_them)
                      .map((item) => (
                        <img
                          key={item._id}
                          src={item.imges}
                          alt={item.destination_name}
                          style={{ width: '180px', height: '30px', borderRadius: '6px' }}
                        />
                      ))}
                  </div>
                )}
              </div>

              <div className="col-md-12 mb-3">
                <label>Payment Terms If Any</label>
                <textarea
                  name="payment_terms"
                  className="form-control"
                  value={form.payment_terms}
                  onChange={handleChange}
                  rows={4}
                ></textarea>
              </div>

              <div className="col-md-4 mt-3">
                <button className="btn btn-primary" onClick={() => setShowConfirmModal(true)}>
                  {packData ? 'Move To QC' : 'Move To QC'}
                </button>
              </div>
            </div>

            {/* Modal */}
            {showConfirmModal && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirmation</h5>
                      <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      <p>We are sending your details to QC. Do you want to continue?</p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleSubmitConfirmed}>
                        Yes, Send to QC
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

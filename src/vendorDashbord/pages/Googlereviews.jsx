import React, { useState, useEffect } from 'react';
import ItenaryTabs from './Itenarytabs';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Googlereviews = () => {
    const navigate = useNavigate(); // ✅

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    review_details: '',
    review_url: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/vendor/All-Reviews`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      const res = await response.json();
      setLeads(res.data);
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (leadId) => {
    setSelectedLeadId(leadId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setReviewForm({ review_details: '', review_url: '' });
  };

  const handleChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.userId;
      //alert(userId);

      const response = await fetch(`${API_URL}/vendor/Googel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewForm,
          added_by: userId,
          doc_id:selectedLeadId,
          status:'P'
        })
      });

      if (!response.ok) throw new Error('Failed to submit review');

      toast.success('Review added successfully');
      closeModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openView=async(row_id)=>{
   // alert();
    navigate(`/Google-View/${row_id}`);
  }
  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Google Review Details</h6>
                  <div className="table-responsive">
                    {loading ? (
                      <div className="text-center">Loading...</div>
                    ) : error ? (
                      <div className="text-center text-danger">Error: {error}</div>
                    ) : leads.length === 0 ? (
                      <div className="text-center">No leads available</div>
                    ) : (
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Confirmed Date</th>
                            <th>GHRN NO</th>
                            <th>Customer Name</th>
                            <th>Number</th>
                            <th>Travel Type</th>
                            <th>Destination</th>
                            <th>Operations Executive : Total : Accepted : Ignored</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((lead, index) => (
                            <tr key={lead._id}>
                              <td>{index + 1}</td>
                              <td>{new Date(lead.confirmed_date).toLocaleString()}</td>
                              <td>{lead.ghrn_no}</td>
                              <td>{lead.customer_name}</td>
                              <td>{lead.customer_number}</td>
                              <td>{lead.holiday_type}</td>
                              <td>{lead.holiday_destination?.destination_name}</td>
                              <td>{lead.operation_executive?.first_name} : {lead.review_total} : {lead.review_approved}  : {lead.review_rejected} </td>
                              <td>
                        <button className="btn btn-primary btn-sm" onClick={() => openModal(lead._id)}>Add</button>
                        <button className="btn btn-dark btn-sm" onClick={() => openView(lead._id)}>View</button>
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
          </div>
          {showModal && (
  <div
    className="custom-modal-overlay"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}
  >
    <div
      className="modal-content"
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        width: '500px',
        padding: '20px',
        boxShadow: '0 5px 15px rgba(0,0,0,.5)'
      }}
    >
      <div className="modal-header d-flex justify-content-between align-items-center">
        <h5 className="modal-title">Add Google Review</h5>
        <button type="button" className="btn-close" onClick={closeModal}>
          <span>&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="form-group mb-3">
          <label>Review Details</label>
          <textarea
            className="form-control"
            name="review_details"
            value={reviewForm.review_details}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className="form-group mb-3">
          <label>Review URL</label>
          <input
            type="text"
            className="form-control"
            name="review_url"
            value={reviewForm.review_url}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="modal-footer d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={closeModal}>Close</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Submit Review</button>
      </div>
    </div>
  </div>
)}

        </section>

        {/* Modal */}
        
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Googlereviews;

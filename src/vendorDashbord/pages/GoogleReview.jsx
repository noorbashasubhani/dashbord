import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const Googlereview = () => {
  const { id } = useParams();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'accept' or 'reject'
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vendor/Googel/${id}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const res = await response.json();
      setLeads(res.data);
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (reviewId, type) => {
    setSelectedReviewId(reviewId);
    setModalType(type); // 'accept' or 'reject'
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedReviewId(null);
  };

  const handleAction = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.userId;

      const response = await fetch(`${API_URL}/vendor/Googel/${selectedReviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: modalType === 'accept' ? 'A' : 'R',
          changed_by_status: userId,
        }),
      });

      if (!response.ok) throw new Error('Failed to update review status');

      toast.success(`Review ${modalType === 'accept' ? 'accepted' : 'rejected'} successfully`);
      closeModal();
      fetchLeads(); // Refresh list
    } catch (err) {
      toast.error(err.message);
    }
  };

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
                  <h6 className="card-title">Google Review Details</h6>
                  {loading ? (
                    <div className="text-center">Loading...</div>
                  ) : error ? (
                    <div className="text-danger text-center">{error}</div>
                  ) : leads.length === 0 ? (
                    <div className="text-center">No reviews found</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Customer Name</th>
                            <th>Review Details</th>
                            <th>Added By</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th>Changed By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((lead, index) => (
                            <tr key={lead._id}>
                              <td>{index + 1}</td>
                              <td>{lead.doc_id?.customer_name}</td>
                              <td>{lead.review_details}</td>
                              <td>{lead.added_by?.first_name}</td>
                              <td>
                                {lead.status === 'A' ? 'Accepted' :
                                 lead.status === 'R' ? 'Rejected' :
                                 'Pending'}
                              </td>
                              <td>
                                <button
                                  className="btn btn-success btn-sm me-2"
                                  onClick={() => openModal(lead._id, 'accept')}
                                  disabled={lead.status === 'A'}
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => openModal(lead._id, 'reject')}
                                  disabled={lead.status === 'R'}
                                >
                                  Reject
                                </button>
                              </td>
                              <td>{lead.changed_by_status?.first_name || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div
              className="custom-modal-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <div
                className="modal-content"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  width: '400px',
                  padding: '20px',
                  boxShadow: '0 5px 15px rgba(0,0,0,.5)',
                }}
              >
                <h5 className="modal-title mb-3">
                  {modalType === 'accept' ? 'Accept Review' : 'Reject Review'}
                </h5>
                <p>Are you sure you want to {modalType} this review?</p>
                <div className="d-flex justify-content-end">
                  <button className="btn btn-secondary me-2" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    className={`btn btn-${modalType === 'accept' ? 'success' : 'danger'}`}
                    onClick={handleAction}
                  >
                    Yes, {modalType === 'accept' ? 'Accept' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Googlereview;

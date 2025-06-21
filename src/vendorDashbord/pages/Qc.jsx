import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { jwtDecode } from 'jwt-decode';

const Qc = () => {


  const [qc, setQc] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [reject, setReject] = useState(false);
const [rejectId, setRejectid] = useState(null);

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const getQcList = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/QC-LIST`);
      if (!response.ok) {
        throw new Error('Data not coming');
      }
      const data = await response.json();
      setQc(data.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleApproveConfirm = async () => {
    if (!selectedLeadId) return;
    try {
      const response = await fetch(`${API_URL}/vendor/update-status/${selectedLeadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itenary_status: 'A',qc_done_by:userId }),
      });
      if (!response.ok) throw new Error('Status update failed');
      // Close the modal
      const modal = window.bootstrap.Modal.getInstance(document.getElementById('approveModal'));
      modal.hide();
      getQcList();
    } catch (err) {
      console.error('Error updating status:', err.message);
    }
  };


  const handleRejectConfirm = async () => {
  if (!rejectId) return;

  try {
    const res = await fetch(`${API_URL}/vendor/update-status/${rejectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itenary_status: 'R',qc_done_by:userId }),
    });

    if (!res.ok) throw new Error('Reject failed');

    const modal = window.bootstrap.Modal.getInstance(document.getElementById('rejectModal'));
    modal.hide();

    getQcList();
  } catch (err) {
    console.error('Error rejecting lead:', err.message);
  }
};

  

  useEffect(() => {
    getQcList();
  }, []);

const funrej = (row_id) => {
  setReject(true);
  setRejectid(row_id);
  const modal = new window.bootstrap.Modal(document.getElementById('rejectModal'));
  modal.show();
};

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4>
            <i className="bi bi-pin-fill mx-2"></i>
            <b>Quality Checking</b>
          </h4>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>
                    Departments & Designation Details
                  </h6>
                  <p style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>

                  <table className="table datatable table-striped">
                    <thead style={{ fontSize: '13px' }}>
                      <tr>
                        <th>S.No</th>
                        <th>QC Status</th>
                        <th>Customer Name</th>
                        <th>Reference No</th>
                        <th>Destination</th>
                        <th>Travel Type</th>
                        <th>Submitted Date</th>
                        <th>Cost Sheet</th>
                        <th>Itinerary</th>
                        <th>Build BY</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '13px' }}>
                      {qc.length > 0 ? (
                        qc.map((item, index) => (
                          <tr key={item._id || index}>
                            <td>{index + 1}</td>
                            <td className="text-danger">{item.itenary_status || 'Pending'}</td>
                            <td>{item.customer_name}</td>
                            <td>{item.reference_no}</td>
                            <td>{item.holiday_destination?.destination_name}</td>
                            <td>{item.holiday_type}</td>
                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td>
                              <a href={item.cost_sheet_url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </td>
                            <td>
                              <a href={item.itinerary_url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </td>
                            <td>{item.operation_executive?.first_name} {item.operation_executive?.last_name}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#approveModal"
                                onClick={() => setSelectedLeadId(item._id)}
                              >
                                Approve
                              </button>
                              <button
  className="btn btn-sm btn-danger"
  onClick={() => funrej(item._id)}
>
  Reject
</button>     </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center">
                            No QC Leads Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Approval Modal */}
      <div className="modal fade" id="approveModal" tabIndex="-1" aria-labelledby="approveModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="approveModalLabel">Confirm Approval</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">Are you sure you want to approve this lead?</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-success" onClick={handleApproveConfirm}>
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="rejectModal" tabIndex="-1" aria-labelledby="rejectModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="rejectModalLabel">Confirm Rejection</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Are you sure you want to reject this lead?
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleRejectConfirm}
        >
          Yes, Reject
        </button>
      </div>
    </div>
  </div>
</div>


      <Footer />
    </>
  );
};

export default Qc;

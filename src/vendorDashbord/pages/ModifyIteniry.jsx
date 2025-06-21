import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

const ModifyIteniry = () => {
  const { id } = useParams();
  const [datas, setDatas] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const getAllData = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Modified-Itenray/${id}`);
      if (!response.ok) throw new Error('Data not found');
      const dts = await response.json();
      setDatas(dts.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleDuplicate = async (doc_id) => {
    try {
      const res = await fetch(`${API_URL}/vendor/duplicate/${doc_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (res.ok) getAllData();
      else alert('Error: ' + result.message);
    } catch (err) {
      console.error('Duplication error:', err.message);
    }
  };

  const handleConfirm = async (doc_id) => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    const userId = user._id;

    try {
      const res = await fetch(`${API_URL}/vendor/update-status-confirm/${doc_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const result = await res.json();
      if (res.ok) getAllData();
      else alert('Error: ' + result.message);
    } catch (err) {
      console.error('Confirm error:', err.message);
    }
  };

  const anyConfirmed = datas.some(item => item.itenary_status === 'C');

  const confirmWithModal = (doc_id) => {
    setSelectedDocId(doc_id);
    setShowConfirmModal(true);
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Modify Itinary Details</b></h4>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Departments & Designation Details</h6>
                  <p style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>GHRN No</th>
                        <th>Destination</th>
                        <th>Download Cost Sheet</th>
                        <th>Download Cost Itinary</th>
                        <th>QC Done By</th>
                        <th>Status</th>
                        <th>Published By</th>
                        <th>Actions</th>
                        <th>Clone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datas.length > 0 ? (
                        datas.map((itms, index) => (
                          <tr key={itms._id}>
                            <td>{index + 1}</td>
                            <td>{itms.ghrn_no}</td>
                            <td>{itms.holiday_destination?.destination_name}</td>
                            <td></td>
                            <td></td>
                            <td>{itms.qc_done_by?.first_name}</td>
                            <td>
                              {
                                itms.itenary_status === 'P' ? 'Pending' :
                                itms.itenary_status === 'Q' ? 'Under QC checking' :
                                itms.itenary_status === 'L' ? 'Published' :
                                itms.itenary_status === 'A' ? 'Approved' :
                                itms.itenary_status === 'R' ? 'Rejected' :
                                itms.itenary_status === 'C' ? 'Confirmed' : ''
                              }
                            </td>
                            <td>{itms.operation_executive?.first_name}</td>
                            {anyConfirmed ? (
                              <>
                                <td></td>
                                <td></td>
                              </>
                            ) : (
                              <>
                                <td>
                                  <button className="btn btn-sm btn-success" onClick={() => confirmWithModal(itms._id)}>Confirm</button>
                                </td>
                                <td>
                                  <button className="btn btn-sm btn-warning" onClick={() => handleDuplicate(itms._id)}>Duplicate</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="10">Data Not Found..</td></tr>
                      )}
                    </tbody>
                  </table>

                  {/* Confirmation Modal */}
                  {showConfirmModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Confirm Action</h5>
                            <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                          </div>
                          <div className="modal-body">
                            <p>Are you sure you want to confirm this itinerary?</p>
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                handleConfirm(selectedDocId);
                                setShowConfirmModal(false);
                              }}
                            >
                              Yes, Confirm
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
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ModifyIteniry;

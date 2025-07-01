import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PartnerApproval = () => {
  const [packages, setPackages] = useState([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const fetchPackages = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/PendigPercentage`);
      const data = await res.json();
      if (res.ok) {
        setPackages(data.data || []);
      } else {
        toast.error(data.message || 'Failed to load data');
      }
    } catch (err) {
      toast.error('Error fetching data');
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openApprovalModal = (type, id) => {
    setSelectedType(type);
    setSelectedId(id);
    const modal = new window.bootstrap.Modal(document.getElementById('approveModal'));
    modal.show();
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.userId;

      const bodyData = {
        doc_id: selectedId,
        ...(selectedType === 'S' && { sup_status: 'A', sup_approved_by: userId }),
        ...(selectedType === 'P' && { sales_status: 'A', partner_approved_by: userId }),
        ...(selectedType === 'L' && { lead_status: 'A', lead_approved_by: userId })
      };

      const res = await fetch(`${API_URL}/vendor/calApproving`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Partner approved successfully');
        fetchPackages();
      } else {
        toast.error(result.message || 'Approval failed');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.doc_id?.customer_name?.toLowerCase().includes(sqlQuery.toLowerCase()) ||
    pkg.doc_id?.ghrn_no?.toLowerCase().includes(sqlQuery.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Partner Approvals Details</b></h4>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search..."
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
          />
        </div>

        <ToastContainer />

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Partner Approvals Details</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Customer Name</th>
                          <th>Destination</th>
                          <th>GHRN No</th>
                          <th>Super Partner</th>
                          <th>Sales Partner</th>
                          <th>Lead Generator</th>
                          <th>Sent By</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPackages.length > 0 ? (
                          filteredPackages.map((pkg, index) => (
                            <tr key={pkg._id}>
                              <td>{index + 1}</td>
                              <td>{pkg.doc_id?.customer_name || 'N/A'}</td>
                              <td>{pkg.doc_id?.holiday_destination?.destination_name || 'N/A'}</td>
                              <td>{pkg.doc_id?.ghrn_no || 'N/A'}</td>

                              {/* Super Partner */}
                              <td>
                                {pkg.supper_partner_id?.first_name} - {pkg.supper_partner_percentage}%
                                <span
                                  className={`ms-2 badge ${pkg.sup_status === 'S' ? 'bg-warning' : pkg.sup_status === 'P' ? 'bg-danger' : 'bg-success'}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openApprovalModal('S', pkg.doc_id?._id)}
                                >
                                  {pkg.sup_status === 'S' ? 'Sent for Approval' : pkg.sup_status === 'P' ? 'Not Approved' : 'Approved'}
                                </span>
                              </td>

                              {/* Sales Partner */}
                              <td>
                                {pkg.sales_partner_id?.first_name} - {pkg.sales_partner_percentage}%
                                <span
                                  className={`ms-2 badge ${pkg.sales_status === 'S' ? 'bg-warning' : pkg.sales_status === 'P' ? 'bg-danger' : 'bg-success'}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openApprovalModal('P', pkg.doc_id?._id)}
                                >
                                  {pkg.sales_status === 'S' ? 'Sent for Approval' : pkg.sales_status === 'P' ? 'Not Approved' : 'Approved'}
                                </span>
                              </td>

                              {/* Lead Generator */}
                              <td>
                                {pkg.lead_partner_id?.first_name} - {pkg.lead_partner_percentage}%
                                <span
                                  className={`ms-2 badge ${pkg.lead_status === 'S' ? 'bg-warning' : pkg.lead_status === 'P' ? 'bg-danger' : 'bg-success'}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openApprovalModal('L', pkg.doc_id?._id)}
                                >
                                  {pkg.lead_status === 'S' ? 'Sent for Approval' : pkg.lead_status === 'P' ? 'Not Approved' : 'Approved'}
                                </span>
                              </td>

                              <td>{pkg.doc_id?.operation_executive?.first_name || 'N/A'}</td>
                              <td>{new Date(pkg.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center">No data found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Approval Modal */}
      <div
        className="modal fade"
        id="approveModal"
        tabIndex="-1"
        aria-labelledby="approveModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="approveModalLabel">Confirm Approval</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              Are you sure you want to approve this partner?
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" onClick={handleApprove} data-bs-dismiss="modal">Yes, Approve</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PartnerApproval;

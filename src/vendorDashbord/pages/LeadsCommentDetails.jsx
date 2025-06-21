import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import Select from 'react-select';
import * as bootstrap from 'bootstrap';

const LeadsCommentDetails = () => {
  const [userid, setUserid] = useState(null);
  const [executiveOptions, setExecutiveOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [leadData, setLeadData] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
const [selectedLeadId, setSelectedLeadId] = useState(null);
const [commentText, setCommentText] = useState('');


  // 🔹 Get logged in user ID
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserid(decodedToken.userId);
    }
  }, []);

  // 🔹 Load year and executive list
  useEffect(() => {
    // Generate years
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2020; y--) {
      years.push({ label: y.toString(), value: y.toString() });
    }
    setYearOptions(years);

    // Fetch executives
    const fetchExecutiveList = async () => {
      try {
        const res = await fetch(`${API_URL}/vendor/Userlist`);
        const data = await res.json();
        const options = data.data.map(emp => ({
          label: `${emp.first_name} ${emp.last_name}`,
          value: emp._id,
        }));
        setExecutiveOptions(options);
      } catch (err) {
        toast.error("Failed to load executive list");
      }
    };

    fetchExecutiveList();
  }, []);

  // 🔍 Handle Search
  const handleSearch = async () => {
    if (!selectedYear || !selectedExecutive) {
      toast.warn("Please select both year and executive");
      return;
    }
    //alert(selectedExecutive.value);    
    try {
        
      const res = await fetch(
        `${API_URL}/vendor/comentleads-comments/${selectedYear.value}/${selectedExecutive.value}`
      );
      if(!res.ok){
        throw new Error('HIS IS CALLED THER error');
      }
      const data = await res.json();
      setLeadData(data.data);
    } catch (err) {
      toast.error("Failed to fetch filtered leads");
    }
  };

  const handleSubmitComment = async () => {
  if (!commentText.trim()) {
    toast.warn("Comment message cannot be empty");
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);

    const res = await fetch(`${API_URL}/vendor/Comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        lead_id: selectedLeadId,
        message: commentText
      })
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Comment added successfully");
      setShowCommentModal(false);
      handleSearch(); // re-fetch lead data
    } else {
      throw new Error(data.message || 'Failed to add comment');
    }
  } catch (err) {
    toast.error("Error adding comment");
  }
};
const openCommentModal = (leadId) => {
  setSelectedLeadId(leadId);
  setCommentText('');
  setShowCommentModal(true);
};

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4>
            <i className="bi bi-pin-fill mx-2"></i>
            <b>Comments Details</b>
          </h4>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />

        <section className="section">
          <div className="row mb-3">
            <div className="col-md-4">
              <label><b>Year</b></label>
              <Select
                options={yearOptions}
                value={selectedYear}
                onChange={setSelectedYear}
                placeholder="Select Year"
              />
            </div>
            <div className="col-md-4">
              <label><b>Executive</b></label>
              <Select
                options={executiveOptions}
                value={selectedExecutive}
                onChange={setSelectedExecutive}
                placeholder="Select Executive"
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Leads Details</h6>
                  <p style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore your team list and member assignments.
                  </p>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Created Date</th>
                          <th>Source</th>
                          <th>Partner Type</th>
                          <th>Destination</th>
                          <th>Customer Name</th>
                          <th>Contact Number</th>
                          <th>Email</th>
                          <th>Holiday Type</th>
                          <th>Team Leader</th>
                          <th>Itinerary Executive</th>
                          <th>Comments</th>
                          <th>Add Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadData.length > 0 ? (
                          leadData.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                              <td>{item.lead_source}</td>
                              <td>{item.partner_type}</td>
                              <td>{item.holiday_destination?.destination_name}</td>
                              <td>{item.customer_name}</td>
                              <td>{item.customer_number}</td>
                              <td>{item.customer_email}</td>
                              <td>{item.holiday_type}</td>
                              <td>{item.team_lead_name}</td>
                              <td>{item.operation_executive?.first_name}</td>
                              <td>
  {item.comments && item.comments.length > 0
    ? item.comments.map((c, i) => (
        <div key={c._id || i}>
          <span>{i+1}) . {c.message}<br></br></span>
        </div>
      ))
    : 'No comments'}
</td>
                              <td>
                                <button className="btn btn-sm btn-secondary" onClick={() => openCommentModal(item._id)}>
                                  Add
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="13" className="text-center">
                              No data found
                            </td>
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
{showCommentModal && (
  <>
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Comment</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowCommentModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control"
              rows="4"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCommentModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmitComment}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show"></div>
  </>
)}

      <Footer />
    </>
  );
};

export default LeadsCommentDetails;

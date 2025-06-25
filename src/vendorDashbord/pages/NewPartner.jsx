import React, { useState,useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import emailjs from '@emailjs/browser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../data/apiUrl';

const SERVICE_ID = 'service_0glsge7';
const TEMPLATE_ID = 'template_gdnphwq';
const PUBLIC_KEY = 'V1dqWKA_vYAN_SA4Q';

const NewPartner = () => {
  const [showModal, setShowModal] = useState(false);
  const [inviteList, setInviteList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    partner_type: '',
    name: '',
    email: '',
    location: ''
  });



useEffect(() => {
  getPartners();
}, []);

 const getPartners=async()=>{
   try{
      const responce=await fetch(`${API_URL}/vendor/Partnerlist`);
      const datss=await responce.json();
      setInviteList(datss.data);
   }catch(err){
    console.log('Dat anot not received');
   }
 }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const partnerCodeMap = {
  'Super Partner': 'S',
  'Sales Partner': 'P',
  'Lead Generator': 'L'
};

const partnerCode = partnerCodeMap[formData.partner_type] || '';
const currentURL = window.location.origin;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const templateParams = {
  partner_type: formData.partner_type,
  name: formData.name,
  email: formData.email,
  location: formData.location,
  register_link: `${currentURL}/Registration-Form/${partnerCode}`// Correct usage
};
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);


  


      console.log('SUCCESS!', response.status, response.text);
      toast.success(`Invite sent to ${formData.email}`);
      setShowModal(false);
      setFormData({ partner_type: '', name: '', email: '', location: '' });
    } catch (error) {
      console.error('FAILED...', error);
      toast.error('Failed to send invite. Please check console/logs.');
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4>
            <i className="bi bi-x-circle mx-2"></i>
            <b>New Partners</b>
          </h4>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            Invite New Partner
          </button>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
            <table className="table table-bordered table-sm table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Partner Type</th>
                  
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inviteList.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">No invites yet</td></tr>
                ) : (
                  inviteList.map((invite, index) => (
                    <tr key={index}>
                      <td>{invite.first_name}   {invite.last_name}</td>
                      <td>{invite.email}</td>
                      <td>{invite.partner_type==='S' ?'Super Admin' : 
                       invite.partner_type==='P' ?'Sales Partner' : 
                       invite.partner_type==='L' ?'Lead Generator' : ''}</td>
                      
                      <td>{new Date(invite.createdAt).toLocaleDateString()}</td>
                      <td>{invite.status==='P'?'Pending':invite.status==='I'?'Invitation Sent':''}</td>
                    </tr>
                  ))
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

      <Footer />
      <ToastContainer position="top-center" />

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Invite New Partner</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Partner Type</label>
                    <select
                      className="form-select"
                      name="partner_type"
                      value={formData.partner_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Super Partner">Super Partner</option>
                      <option value="Sales Partner">Sales Partner</option>
                      <option value="Lead Generator">Lead Generator</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
  {loading ? 'Sending...' : 'Send Invite'}
</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPartner;

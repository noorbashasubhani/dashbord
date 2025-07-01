import React, { useState, useEffect } from 'react';
import ItenaryTabs from './Itenarytabs';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';


const ConfirmedItenary = () => {
  const [leads, setLeads] = useState([]);
  const [team, setTeam] = useState([]);
  const [partners, setpartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
     
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/confirm`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      const res = await response.json();
      setLeads(res.data);
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }

    try {
      const responsep = await fetch(`${API_URL}/vendor/Partners`);
      if (!responsep.ok) throw new Error('Failed to fetch partners');
      const datasp = await responsep.json();
      setpartners(datasp.data);
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    }

    try {
      const responceTeam = await fetch(`${API_URL}/vendor/Teams`);
      if (!responceTeam.ok) throw new Error('Failed to fetch teams');
      const datasteam = await responceTeam.json();
      setTeam(datasteam.data);
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    }
  };

  const celFun = (doc_id) => {
  setSelectedId(doc_id);
  setShowModal(true);
};


const confirmCancel = async () => {
      const token = localStorage.getItem('token');
const user = jwtDecode(token);
const userId = user.userId;
///alert(userId);
  try {
    const response = await fetch(`${API_URL}/vendor/cancel-itinerary/${selectedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) throw new Error('Failed to cancel itinerary');

    toast.success('Itinerary cancelled successfully');
    setShowModal(false);
    fetchLeads();
  } catch (error) {
    toast.error(error.message);
    setShowModal(false);
  }
};

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <ItenaryTabs tabid={1} />
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>
                    Confirmed Itinerary Details
                  </h6>
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
                            <th>Operations Executive</th>
                            <th>Source</th>
                            <th>Partner Type</th>
                            <th>Package Amount</th>
                            <th>TCS Amount</th>
                            <th>Received  Amount</th>
                            <th>Pending  Amount</th>
                            <th>Trip Dates </th>
                            <th>Action</th>
                           
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((lead, index) => (
                            <tr key={lead._id}>
                              <td>{index + 1}</td>
                              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                              <td>{lead.ghrn_no}</td>
                              <td>{lead.customer_name}</td>
                              <td>{lead.customer_number}</td>
                              <td>{lead.holiday_type}</td>
                              <td>{lead.holiday_destination?.destination_name}</td>
                              <td>{lead.operation_executive?.first_name}</td>
                              <td>{lead.lead_source}</td>
                              <td>{lead.partner_type}</td>
                              <td>{lead.calculation_data?.total_package_cost_quoted}</td>
                              <td>{lead.calculation_data?.total_tcs_cost}</td>
                              <td>{lead.calculation_data?.total_tcs_cost}</td>
                              <td></td>
                              <td>{lead.start_date} To {lead.end_date}</td>
                              <td>
                                <button className="btn btn-sm btn-primary" onClick={()=>celFun(lead._id)}>Cancel</button>
                               <Link to={`/View-Form-Domestic/${lead._id}`}>
  <button className="btn btn-success btn-sm">View</button>
</Link>

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
        </section>
        {showModal && (
  <>
    {/* Modal Box */}
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Cancel</h5>
            <button type="button" className="close" onClick={() => setShowModal(false)}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to cancel?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            <button type="button" className="btn btn-danger" onClick={confirmCancel}>Yes, Cancel</button>
          </div>
        </div>
      </div>
    </div>

    {/* Background Shadow */}
    <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>
  </>
)}

      </main>
      

      <Footer />
      <ToastContainer />
    </>
  );
};

export default ConfirmedItenary;

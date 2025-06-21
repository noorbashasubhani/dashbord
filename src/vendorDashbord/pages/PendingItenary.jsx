import React, { useState, useEffect } from 'react';
import ItenaryTabs from './Itenarytabs'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Footer from '../components/forms/Footer'
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome, FaUser } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaRegCommentDots } from 'react-icons/fa'; // outlined comment icon
import { useNavigate } from 'react-router-dom';

const PendingItenary = () => {

     const [leads, setLeads] = useState([]);
      const [team, setTeam] = useState([]);
      const [activeTab, setActiveTab] = useState('active'); // Track the active tab (active or deleted)
      const [loading, setLoading] = useState(false); // Loading state for API fetch
      const [error, setError] = useState(''); // Error state
      const [modes, setModes] = useState(false); // State to control modal visibility
      const [partners, setpartners] = useState([]);
      const [show, setShow] = useState(false);
      const [reject, setReject] = useState(false);
const [rejectId, setRejectid] = useState(null);
    
      const [selectedSource, setSelectedSource] = useState('');
      const [isPartnerSelected, setIsPartnerSelected] = useState(false);
      
      // Form data state
      const [formData, setFormData] = useState({
        customer_name: '',
        customer_number: '',
        customer_email: '',
        lead_location: '',
        holiday_type: '',
        holiday_desc: '',
        lead_source: '',
        partner_id: '',
      });
    
      // Fetch lead and partner data when the component mounts
      useEffect(() => {
       
    
        fetchLeads();
      }, []);
     const fetchLeads = async () => {
    
          setLoading(true);
          setError('');
          try {
            const response = await fetch(`${API_URL}/vendor/Pending-Itenary`);
            if (!response.ok) {
              throw new Error('Failed to fetch leads');
            }
            const res = await response.json();
            setLeads(res.data);
          } catch (error) {
            toast.error(error.message);
            setError(error.message); // Set error message
          } finally {
            setLoading(false);
          }
    
          try {
            const responsep = await fetch(`${API_URL}/vendor/Partners`);
            if (!responsep.ok) {
              throw new Error('Failed to fetch partners');
            }
            const datasp = await responsep.json();
            setpartners(datasp.data);
          } catch (error) {
            toast.error(error.message);
            setError(error.message); // Set error message
          }
          
    
          try {
            const responceTeam = await fetch(`${API_URL}/vendor/Teams`);
            if (!responceTeam.ok) {
              throw new Error('Failed to fetch partners');
            }
            const datasteam = await responceTeam.json();
            setTeam(datasteam.data);
          } catch (error) {
           // toast.error(error.message);
            setError(error.message); // Set error message
          }
    
    
    
        };
      const handleInputChange = (e) => {
        const { name, value } = e.target;
      
        // Update form data
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      
        // Handle showing/hiding partner select if lead_source is changed
        if (name === 'lead_source') {
          setIsPartnerSelected(value === 'Partner');
        }
      };
      
    
    
    
      // Function to open modal
      const addFun = () => {
        setModes(true);
      };
    
      // Function to close modal
      const closeModal = () => {
        setModes(false);
        setFormData({
          customer_name: '',
          customer_number: '',
          customer_email: '',
          lead_location: '',
          holiday_type: '',
          holiday_desc: '',
          lead_source: '',
          partner_id: '',
        }); // Clear form data on modal close
      };
    
      // Handle form submission to add new lead
      const handleSubmit = async (e) => {
        e.preventDefault();
        
         
        try {
          const token = localStorage.getItem('token');
    
          const response = await fetch(`${API_URL}/vendor/lead`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
          });
    
          if (!response.ok) {
            throw new Error('Failed to add lead');
          }
    
          const results = await response.json();
          
          setLeads((prevLeads) => [results.data,...prevLeads]);
          toast.success('Lead added successfully!');
          closeModal(); // Close the modal after submission
        } catch (error) {
          toast.error(error.message);
        }
      };
    
      const [delid,setDelid]=useState(null);
      const [delmod,setDelmod]=useState(false);
    
      const delFun=(row_id)=>{
       // alert(row_id);
        setDelmod(true);
        setDelid(row_id);
      }
      
    
      const handleDelete = async () => {
        try {
          // Assuming you have an API endpoint to delete the lead
          //const response = await fetch(`API_URL/lead/${delid}`, { method: 'DELETE' });
          const response = await fetch(`${API_URL}/vendor/Delete-pending/${delid}`, {
            method: 'PUT', // Ensure the method is PUT for updating
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itenary_status: 'D',delete_from:'P' }), // Send the status in the request body
          });
          
          if (response.ok) {
            toast.success('Lead deleted successfully!');
            setLeads(leads.filter((lead) => lead._id !== delid)); // Remove the lead from the local state
            //closeModal(); // Close the modal after deletion
            setDelmod(false);
          } else {
            toast.error('Failed to delete lead');
          }
        } catch (error) {
          toast.error('Error occurred while deleting the lead');
        }
      };
    
    const [assmodel,setAssmodel]=useState(false);
    const [assid,setAssid]=useState(null);
    
    const assignFun=(row_id)=>{
      setAssmodel(true);
      setAssid(row_id);
    }
    
    const assignD=async()=>{
      const assigneeId = document.getElementById('operation_executive').value;
      const reason = document.getElementById('reason_assign').value;
      //alert(assid);
      try {
        const responses = await fetch(`${API_URL}/vendor/Assign/${assid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            operation_executive: assigneeId,
            reason: reason
          }),
        });
        const result = await responses.json();
            //console.log('API Response:', result.data); // Debug line
    
        if (responses.ok) {
          toast.success('Lead Assinment  successfully!');
          const updatedLead = result.data;
    
          setLeads((prevLeads) =>
            prevLeads.map((item) => 
              item._id === updatedLead._id ? updatedLead : item
            )
          );
          
          setAssmodel(false);
        } else {
          toast.error('Failed to delete lead');
        }
      } catch (error) {
        toast.error('Error occurred while deleting the lead');
      }
    }
    
    const [desModel, setDesmodel] = useState(false);
    const [desId, setDesid] = useState('');
    
    const desFunc=(description)=>{
      
      setDesmodel(true);
      setDesid(description);
    }
    
    
    
    
    
    /*        Comment functinality         */
    const [comid,setComid]=useState(null);
    const [commodel,setCommodel]=useState(false);
    
    const conFun=(row_id)=>{
      setCommodel(true);
      setComid(row_id);
    }
    
    const saveCom=async()=>{
      const messageInput=document.getElementById('message');
      const message = messageInput?.value?.trim();
      const lead_id=comid;
    
      try{
        const token = localStorage.getItem('token'); // or however you store it
    
        const responsess = await fetch(`${API_URL}/vendor/Comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <- properly formatted
          },
          body: JSON.stringify({ 
            lead_id: lead_id,
            message: message
          }),
        });
    
        const result = await responsess.json();
    
        if (responsess.ok) {
          toast.success('Comment added successfully!');
          messageInput.value = ''; // clear input after success
          // optionally update comment list here
          setCommodel(false);
        } else {
          toast.error(result.message || 'Failed to add comment');
        }
       
      }catch(error){
        toast.error('Error occurred while deleting the lead');
      }
    }
    
    
    /*        view button functionaltiy          */
    const navigate = useNavigate();
    
    const handleView = (row_id) => {
      navigate(`/lead-comments/${row_id}`);
    };
    
    
    /*  Ececutive Comments list  */
    const exeCom=(row_id)=>{
      
    }
    const openBuild = (row_id, type) => {
      //alert(type);
  if (type === 'Domestic') {
    navigate(`/Domestic-Form/${row_id}`);
  } else {
    navigate(`/Internationals-Form/${row_id}`);
  }
};

const openPulish=(row_id)=>{
  setReject(true);
  setRejectid(row_id);
  const modal = new window.bootstrap.Modal(document.getElementById('rejectModal'));
  modal.show();
}

const handleRejectConfirm = async () => {
  if (!rejectId) return;

  try {
    const res = await fetch(`${API_URL}/vendor/update-status-publish/${rejectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itenary_status: 'Rejected' }),
    });

    if (!res.ok) throw new Error('Reject failed');

    const modal = window.bootstrap.Modal.getInstance(document.getElementById('rejectModal'));
    modal.hide();

    getQcList();
  } catch (err) {
    console.error('Error rejecting lead:', err.message);
  }
};


  return (
    <>
    <main id="main" className="main">
    
         <NavBar />
         <SideBar />
         <ItenaryTabs  tabid={1}/>

    <section className="section">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title" style={{ fontSize: '14px' }}>Pending Itinary Details</h6>
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
                                <th>Lead Created On</th>
                                <th>GHRN NO</th>
                                <th>Customer Name</th>
                                <th>Number</th>
                                <th>Travel Type</th>
                                <th>Details</th>
                                <th>Operations Executive</th>
                                
                                <th>Source</th>
                                <th>Partner Type</th>
                                <th>Actions</th>
                                <th>Executive Changed By</th>
                                <th>Previous Executive</th>
                                <th>Raised By</th>
                                <th>Location</th>
                                <th>Qc Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {leads.map((itms, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{new Date(itms.createdAt).toLocaleString()}</td>
                                  <td>{itms.ghrn_no}</td>
                                  <td>{itms.customer_name}</td>
                                  <td>{itms.customer_number}</td>
                                  <td>{itms.holiday_type}</td>
                                  <td><FaEye onClick={()=>desFunc(itms.holiday_desc)}/></td>
                                  <td>{itms.operation_executive?.first_name}</td>
    
                                  
                                  <td>{itms.lead_source}</td>
                                  <td>{itms.partner_id?.first_name}</td>
                                  <td>
                                    
  <button className="btn btn-danger btn-sm" onClick={()=>(delFun(itms._id))}>Delete</button>
                                   

                                   {itms.itenary_status === 'R' ? (
  <button className="btn btn-sm btn-dark" onClick={() => openBuild(itms._id, itms.holiday_type)}>Build</button>
) : itms.itenary_status === 'A' ? (
  <button className="btn btn-sm btn-success" onClick={() => openPulish(itms._id)}>Publish</button>
) : (
  <button className="btn btn-sm btn-primary" onClick={() => openBuild(itms._id, itms.holiday_type)}>Build</button>
)}


                                    
                                  </td>
                                  <td></td>
                                  <td>{itms.my_operation_executive?.first_name}</td>
                                  <td>{itms.raised_by?.first_name || 'N/A'}</td>
                                  <td>{itms.lead_location}</td>
                                  <td>{itms.itenary_status === 'A' ? 'Approved' :
                                       itms.itenary_status === 'R' ? 'Rejected' :
                                       itms.itenary_status === 'P' ? '' : ''} 
                                      
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
            {delmod && (
              <div style={{
                position: 'fixed',
                top: '30%',
                left: '40%',
                background: 'white',
                border: '2px solid black',
                padding: '50px',
                zIndex: 1000
              }}>
                <p>Are you sure you want to delete?</p>
                
                <button className="btn btn-sm btn-dark" onClick={() => setDelmod(false)}>Close</button>
                
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(delid)}>Yes, Delete</button>
              </div>
            )}

            <div className="modal fade" id="rejectModal" tabIndex="-1" aria-labelledby="rejectModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="rejectModalLabel">Confirm Publish</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Are you sure you want to Publish this lead?
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
          Yes, Publish
        </button>
      </div>
    </div>
  </div>
</div>


    </main>
    <Footer />
   
    </>
  )
}

export default PendingItenary
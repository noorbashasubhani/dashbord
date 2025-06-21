import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome, FaUser } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaRegCommentDots } from 'react-icons/fa'; // outlined comment icon
import { useNavigate } from 'react-router-dom';
import LeadsTabs from './LeadsTabs';
import useIdleLogout from './useIdleLogout';





const Lead = () => {
  const [leads, setLeads] = useState([]);
  const [team, setTeam] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // Track the active tab (active or deleted)
  const [loading, setLoading] = useState(false); // Loading state for API fetch
  const [error, setError] = useState(''); // Error state
  const [modes, setModes] = useState(false); // State to control modal visibility
  const [partners, setpartners] = useState([]);
  const [show, setShow] = useState(false);

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
    const fetchLeads = async () => {

      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_URL}/vendor/lead`);
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

    fetchLeads();
  }, []);

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
    setDelmod(true);
    setDelid(row_id);
  }

  const handleDelete = async () => {
    try {
      // Assuming you have an API endpoint to delete the lead
      //const response = await fetch(`API_URL/lead/${delid}`, { method: 'DELETE' });
      const response = await fetch(`${API_URL}/vendor/lead/${delid}`, {
        method: 'PUT', // Ensure the method is PUT for updating
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'D' }), // Send the status in the request body
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
const [exc_ids,setExecutive]=useState(null);

const assignFun=(row_id,exc_id)=>{
  //alert(exc_id);
  setAssmodel(true);
  setAssid(row_id);
  setExecutive(exc_id);
}

const assignD=async()=>{
  const assigneeId = document.getElementById('operation_executive').value;
  const reason = document.getElementById('reason_assign').value;
  const token = localStorage.getItem('token');
  const executive=document.getElementById('executive').value;
 //alert(exc_ids);
  try {
    const responses = await fetch(`${API_URL}/vendor/Assign/${assid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        operation_executive: assigneeId,
        reason,
        executive
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
const [exccomm,setExccomm]=useState(false);
const [excid,setExcid]=useState(null);
const exeCom=(row_id)=>{
  setExccomm(true);
  setExcid(row_id);
}


const saveExcom=async()=>{
  const messageInput=document.getElementById('messages');
  const message = messageInput?.value?.trim();
  const lead_id=excid;
  //const executive=document.getElementById('executive');
  //alert(message);
  try{
    const token = localStorage.getItem('token'); // or however you store it
    const responsessd = await fetch(`${API_URL}/vendor/ExecutiveCommant/${lead_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // <- properly formatted
      },
      body: JSON.stringify({ 
        messages: message
      }),
    });
    const result = await responsessd.json();
    const updatedLead = result.data;
    if (responsessd.ok) {
      toast.success('Congratulations ! Lead Has been moved successfully');
      messageInput.value = ''; // clear input after success
      // optionally update comment list here
      //setLeads((prev) => prev.filter((item) => item._id === lead_id));



      

      setLeads((prevLeads) =>
        prevLeads.map((item) => 
          item._id === updatedLead._id ? updatedLead : item
        )
      );


      setExccomm(false);
    } else {
      toast.error(result.message || 'Failed to add comment');
    }
  }catch(error){
    toast.error('Error occurred while deleting the lead');
  }
}


const processFun=(lead_id)=>{
  navigate(`/Lead-process/${lead_id}`);
}
useIdleLogout();
  return (
    <>
      <NavBar />
      <SideBar />
    
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Lead Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Lead</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
          <button className="btn btn-sm btn-dark mb-3 ms-auto" onClick={addFun}>
            + Lead Position
          </button>
        </div>

        <ToastContainer />

        {/* Leads table */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Leads Details</h6>
                  <LeadsTabs  tabs={1}/>
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
                            <th>Customer Name</th>
                            <th>Number</th>
                            <th>Travel Type</th>
                            <th>Details</th>
                            <th>Operations Executive</th>
                            <th>Comments</th>
                            <th>Source</th>
                            <th>Partner Type</th>
                            <th>Actions</th>
                            <th>Executive Changed By</th>
                            <th>Previous Executive</th>
                            <th>Raised By</th>
                            <th>Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((itms, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{new Date(itms.createdAt).toLocaleString()}</td>
                              <td>{itms.customer_name}</td>
                              <td>{itms.customer_number}</td>
                              <td>{itms.holiday_type}</td>
                              <td><FaEye onClick={()=>desFunc(itms.holiday_desc)}/></td>
                              <td>{itms.operation_executive?.first_name} 
                               <FaHome size={20} color="black" onClick={()=>{assignFun(itms._id,itms.operation_executive._id)}}/> </td>

                              <td><FaRegCommentDots size={20} onClick={()=>{conFun(itms._id)}}/>
                                 <button className="btn btn-primary btn-sm" onClick={()=>handleView(itms._id)}>View</button>
                                 <span className="badge bg-primary" onClick={()=>exeCom(itms._id)}>Click Executive Comments</span></td>
                                 
                              <td>{itms.lead_source}</td>
                              <td>{itms.partner_id?.first_name}</td>
                              <td>
                                <button className="btn btn-danger btn-sm" onClick={()=>(delFun(itms._id))}>Delete</button>
                                <button className="btn btn-primary btn-sm" onClick={()=>processFun(itms._id)}>Processed</button>
                              </td>
                              <td>{itms.executive_changed_by?.first_name}</td>
                              <td>{itms.previous_operation_executive?.first_name}</td>
                              <td>{itms.raised_by?.first_name || 'N/A'}</td>
                              <td>{itms.lead_location}</td>
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

        {/* Modal for adding a new lead */}
        {modes && (
           <div className="modal fade show d-block" tabIndex="-1" id="addLeadModal" aria-hidden="true" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}> 
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Lead</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    {/* Form fields */}
                    <div className="row">
                     <div className="col-md-6 mb-3">
                      <label htmlFor="customerName" className="form-label">Customer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        id="customerName" required
                      />
                    </div>
                     <div className="col-md-6 mb-3">
                      <label htmlFor="customerNumber" className="form-label">Customer Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_number"
                        value={formData.customer_number}
                        onChange={handleInputChange}
                        id="customerNumber"
                        required
                      />
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="customer_email" className="form-label">Customer E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        name="customer_email"
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        id="customer_email"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lead_location" className="form-label">Lead Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lead_location"
                        value={formData.lead_location}
                        onChange={handleInputChange}
                        id="lead_location"
                        required
                      />
                    </div>
                    </div>
                    <div className="row">
                     <div className="col-md-6 mb-3">
                      <label htmlFor="holiday_type" className="form-label">Holiday Type</label>
                      <select
                        className="form-control"
                        name="holiday_type"
                        value={formData.holiday_type}
                        onChange={handleInputChange}
                        id="holiday_type"
                        required
                      >
                        <option value="">Select Holiday Type</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lead_source" className="form-label">Source</label>
                      <select
  className="form-control"
  name="lead_source"
  value={formData.lead_source}
  onChange={handleInputChange}
  id="lead_source"
  required
>
  <option value="">Select Source Type</option>
  <option value="Website">Website</option>
  <option value="Instagram">Instagram</option>
  <option value="Google">Google</option>
  <option value="Facebook">Facebook</option>
  <option value="Existing-Customer">Existing Customer</option>
  <option value="Customer-Reference">Customer Reference</option>
  <option value="Personal-Reference">Personal Reference</option>
  <option value="Telecalling">Telecalling</option>
  <option value="Telecalling-CS">Telecalling-CS</option>
  <option value="Telecalling-CRM">Telecalling-CRM</option>
  <option value="Direct-Call">Direct Call</option>
  <option value="Marketing">Marketing</option>
  <option value="MICE-Marketing">MICE-Marketing</option>
  <option value="Partner">Partner</option>
  <option value="Bulk-SMS-Activity">Bulk SMS Activity</option>
  <option value="QR-Code-Scan">QR Code Scan</option>
</select>

                    </div>
                    </div>
                    {isPartnerSelected && (
                      <div className="mb-3">
                        <label htmlFor="partner_id" className="form-label">Partner List</label>
                        <select
                          className="form-control"
                          name="partner_id"
                          value={formData.partner_id}
                          onChange={handleInputChange}
                          id="partner_id"
                        >
                          <option value="">Select Partner</option>
                          {partners.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.first_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="holiday_desc" className="form-label">Holiday Description</label>
                      <textarea
                        className="form-control"
                        name="holiday_desc"
                        value={formData.holiday_desc}
                        onChange={handleInputChange}
                        id="holiday_desc"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Lead</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {delmod && (
          <div className="modal fade show d-block"
           style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} id="deleteModal"
            tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button type="button" className="btn-close" onClick={()=>setDelmod(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this lead?</p>
                  {/* You can show lead details here if necessary */}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={()=>setDelmod(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {assmodel && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} 
          id="deleteModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Assignment</h5>
                  <button type="button" className="btn-close" onClick={()=>setAssmodel(false)} aria-label="Close"></button>
                </div>


                <div className="modal-body">
                  <p>Are you sure you want to Assign this lead?</p>
                  {/* You can show lead details here if necessary */}

                  <label> Assign To</label>
                  <select className="form-control" name="operation_executive" id="operation_executive">
                  <option value="">Select Assign</option>
                  {team.map((teamItem) =>
                    teamItem.team_employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.first_name}
                      </option>
                    ))
                  )}
                </select>
                <input type="hidden" name="executive" id="executive" value={exc_ids}/>

                  <label>Reason for Assign</label>
                  <textarea type="text" className="form-control" name="reason_assign" id="reason_assign"></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={()=>setAssmodel(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-success btn-sm" onClick={()=>assignD()}>
                    Assign
                  </button>
                 
                </div>
              </div>
            </div>
          </div>
        )}

        {desModel  && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} id="deleteModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Description Details</h5>
                  <button type="button" className="btn-close" onClick={()=>setDesmodel(false)} aria-label="Close"></button>
               
                    </div>


                <div className="modal-body">
                  
                  {desId}

                    </div>
                <div className="modal-footer">
                 
                </div>
              </div>
            </div>
          </div>
        )}


{commodel  && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} id="deleteModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Comment Adding Details</h5>
                  <button type="button" className="btn-close" onClick={()=>setCommodel(false)} aria-label="Close"></button>
               
                    </div>


                   <div className="modal-body">
                     <label>Write Your Comment </label>
                     
                     <textarea name="message" id="message" className="form-control"></textarea>
                    </div>
                <div className="modal-footer">
                 <button className="btn btn-sm btn-primary" onClick={()=>saveCom()}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}

        { exccomm && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} id="deleteModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Commets </h5>
                  <button type="button" className="btn-close" onClick={()=>setExccomm(false)} aria-label="Close"></button>
                </div>


                <div className="modal-body">
                  {/* You can show lead details here if necessary */}
                  <label>Moving Leads</label>
                  <select className="form-control" name="messages" id="messages">
                  
                  <option value="R">Move To R-N-R</option>
                  <option value="D">Move To Domestic</option>
                  <option value="I">Move To  International</option>
                  <option value="O">Move To Working on Off-line</option>
                  <option value="C">Move To Junk</option>
                  
                </select>
                 </div>
                <div className="modal-footer">
                 <button className="btn btn-sm btn-primary" onClick={saveExcom}>Yes Move</button>
                 
                </div>
              </div>
            </div>
          </div>)}
      </main>

      <Footer />
    </>
  );
};

export default Lead;

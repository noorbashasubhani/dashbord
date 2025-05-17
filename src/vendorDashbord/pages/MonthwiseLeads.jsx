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


const MonthwiseLeads = () => {
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
  const [leadCounts,setLeadCounts] = useState(0);
  const [preleadCounts,setPreleadCounts] = useState(0);
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
        const response = await fetch(`${API_URL}/vendor/Executives-summary`);
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



      try {
        const response = await fetch(`${API_URL}/vendor/DayleadCount`);
        const data = await response.json();
        const leadCountMap = {};
        data.data.forEach(item => {
          leadCountMap[item._id] = item.total_leads;
        });
        setLeadCounts(leadCountMap); // set this to a state
      } catch (error) {
        setError(error.message);
      }



      try {
        const response = await fetch(`${API_URL}/vendor/DaypreleadCount`);
        const data = await response.json();
        const leadCountMap = {};
        data.data.forEach(item => {
          leadCountMap[item._id] = item.total_leads;
        });
        setPreleadCounts(leadCountMap); // set this to a state
      } catch (error) {
        setError(error.message);
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

const assignFun=(row_id)=>{
  setAssmodel(true);
  setAssid(row_id);
}

const assignD=async()=>{
  const assigneeId = document.getElementById('operation_executive').value;
  const reason = document.getElementById('reason_assign').value;
  const token = localStorage.getItem('token');
  //alert(assid);
  try {
    const responses = await fetch(`${API_URL}/vendor/Assign/${assid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
    if (responsessd.ok) {
      toast.success('Congratulations ! Lead Has been moved successfully');
      messageInput.value = ''; // clear input after success
      // optionally update comment list here
      setLeads((prev) => prev.filter((item) => item._id !== lead_id));
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

const restores=async(row_id)=>{
 try {
      // Assuming you have an API endpoint to delete the lead
      //const response = await fetch(`API_URL/lead/${delid}`, { method: 'DELETE' });
      const response = await fetch(`${API_URL}/vendor/lead/${row_id}`, {
        method: 'PUT', // Ensure the method is PUT for updating
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'L' }), // Send the status in the request body
      });
      
      if (response.ok) {
        toast.success('Lead deleted successfully!');
        setLeads(leads.filter((lead) => lead._id !== row_id)); // Remove the lead from the local state
        //closeModal(); // Close the modal after deletion
       // setDelmod(false);
      } else {
        toast.error('Failed to delete lead');
      }
    } catch (error) {
      toast.error('Error occurred while deleting the lead');
    }
}

  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Deleted Lead Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Lead</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
         
        </div>

        <ToastContainer />

        {/* Leads table */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Leads Details</h6>
                  <LeadsTabs tabs={3}/>
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
                            <th>Executive Names</th>
                            <th>Total Monthly Assigned Lead	</th>
                            <th>Total Monthly Actuvally Lead	</th>
                            <th>Gain or Loss</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((itms, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                               <td>{itms.executive_name}</td>
                               <td>{leadCounts[itms.executive_id] || 0}</td> {/* Total leads for this executive */}
                               <td>{preleadCounts[itms.executive_id] || 0}</td> {/* Total leads for this executive */}
                              <td>{leadCounts[itms.executive_id]-preleadCounts[itms.executive_id]}</td>
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

       
      </main>

      <Footer />
    </>
  );
};

export default MonthwiseLeads;

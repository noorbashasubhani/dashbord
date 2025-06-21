//PublishedIterary.jsx

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

const PublishedIterary = () => {

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
      
     
      // Fetch lead and partner data when the component mounts
      useEffect(() => {
        const fetchLeads = async () => {
    
          setLoading(true);
          setError('');
          try {
            const response = await fetch(`${API_URL}/vendor/Published-Itenary/`);
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
    
          
    
        };
    
        fetchLeads();
      }, []);
    
      
    
      const [delid,setDelid]=useState(null);
      const [delmod,setDelmod]=useState(false);
      const [staa, setStatus] = useState('');

      const delFun=(id, status)=>{
        //alert(status);
        setDelmod(true);
        setDelid(id);
        setStatus(status);
        return;
      }
      
    
      const handleDelete = async (delid, staa) => {
       //alert(staa);
        try {
          // Assuming you have an API endpoint to delete the lead
          //const response = await fetch(`API_URL/lead/${delid}`, { method: 'DELETE' });
          const response = await fetch(`${API_URL}/vendor/Delete-pending/${delid}`, {
            method: 'PUT', // Ensure the method is PUT for updating
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itenary_status: staa,delete_from:''}), // Send the status in the request body
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
    
   
    
    /*        view button functionaltiy          */
    const navigate = useNavigate();
    
    const handleView = (row_id) => {
      navigate(`/lead-comments/${row_id}`);
    };
    
    
    /*  Ececutive Comments list  */
    const exeCom=(row_id)=>{
      
    }

     const handleModifyClick = (row_id) => {
     navigate(`/Modify-Itinary/${row_id}`);
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
                      <h6 className="card-title" style={{ fontSize: '14px' }}>Published Itinery Details</h6>
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
                                <th>GHRN No</th>
                                <th>Customer Name</th>
                                <th>Number</th>
                                <th>Travel Type</th>
                                <th>Destination</th>
                                <th>Executive Name</th>
                                
                                <th>Source</th>
                                <th>Partner Type</th>
                                <th>Travel Dates</th>
                                <th>Actions</th>
                                
                              </tr>
                            </thead>
                            <tbody>
                              {leads.map((itms, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{itms.ghrn_no}</td>
                                  <td>{itms.customer_name}</td>
                                  <td>{itms.customer_number}</td>
                                  <td>{itms.holiday_type}</td>
                                  <td>{itms.holiday_destination?.destination_name}</td>
                                  <td>{itms.operation_executive?.first_name} {itms.operation_executive?.last_name}</td>
    
                                  
                                  <td>{itms.lead_source}</td>
                                  <td>{itms.partner_id?.first_name}</td>
                                  <td>{itms.start_date} To {itms.end_date}</td>
                                  <td>
                                    <button className="btn btn-sm btn-primary"onClick={()=>handleModifyClick(itms.ghrn_no)} >Modify</button>
                                    <button className="btn btn-sm btn-dark">View</button>
                                    
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
                borderRadius: '5px',
                padding: '50px',
                zIndex: 1000
              }}>
                <p>Are you sure Want Restore Previous One ..!</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                <button className="btn btn-sm btn-dark" onClick={() => setDelmod(false)}>No Close</button>
                
                <button className="btn btn-sm btn-danger"  onClick={() => handleDelete(delid, staa)}>Yes, Delete This</button>
                </div>
              </div>
            )}

    </main>
    <Footer />
   
    </>
  )
}

export default PublishedIterary
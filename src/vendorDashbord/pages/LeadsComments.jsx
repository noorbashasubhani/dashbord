import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';

const LeadsComments = () => {
  
    const { lead_id } = useParams();

    const [lead, setLead] = useState([]);
    console.log("Fetched ID from URL:", lead_id);
    useEffect(() => {
        // fetch lead by ID
        const getsDat=async()=>{
           //const responce=  await(`${API_URL}/vendor/Comment/${id}`);
           const response = await fetch(`${API_URL}/vendor/Comment/${lead_id}`);

           if(!response.ok){
            throw new Error('Data not comming');
           }
           const result=await response.json();
           setLead(result.data);
        }
        getsDat();
      }, [lead_id]);

  return (
    <Layout>
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Comments Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item"><a href="index.html">Comments</a></li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
        </div>
        <div>
      <h3>Lead Details</h3>
      <hr></hr>
      {lead.map((itemss,index)=>(
        <div key={index}>
      <h6>Lead Comments : {index+1}</h6>
      <p><strong>Customer:</strong> {itemss.lead_id.customer_name}</p>
      <p><strong>Comment Summy:</strong> {itemss.message}</p>
      <p><strong>Commented  By:</strong> {itemss.added_by.first_name} {itemss.added_by.last_name}</p>
      <p><strong>Status:</strong> {itemss.lead_id.lead_status}</p>
      <hr></hr>
      </div>
      
      ))}
    
      {/* Add more fields as needed */}
    </div>
        <ToastContainer />

        
      </main>
    </Layout>
  );
};

export default LeadsComments;

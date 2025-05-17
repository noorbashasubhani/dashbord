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


const SourceWiseLeads = () => {
    const [souces,setSouces]=useState([]);
useEffect(()=>{
    const getSouces = async () => {
    try {
        const responsep = await fetch(`${API_URL}/vendor/Lead-Sources-list`);
        if (!responsep.ok) {
        throw new Error('Failed to fetch partners');
        }
        const datasp = await responsep.json();
        setSouces(datasp.data);
    } catch (error) {
        toast.error(error.message);
        setError(error.message); // Set error message
    }
    }
    getSouces();
},[]);
  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Source Wise Lead Details</b></h4>
            
          </div>
         
        </div>

        {/* Leads table */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Source Wise Leads Details</h6>
                 
                  <div className="table-responsive">
                    
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Source  Names</th>
                            <th>Domestic	</th>
                            <th>International</th>
                            <th>Total Leads</th>
                          </tr>
                        </thead>

                        <tbody>
                            {souces.map((itms,index)=>(
                                
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{itms.lead_source}</td>
                                <td>{itms.Domestic ? itms.Domestic:0}</td>
                                <td>{itms.International ? itms.International : 0}</td>
                                <td>{(itms.Domestic || 0) + (itms.International || 0)}</td>
                                
                            </tr>
                            ))}
                        </tbody>
                        <tfoot>
                        
  <tr>
    <td className="text-primary" colSpan={2}>Total</td>

    {/* Total Domestic Leads */}
    <td>
      {
        souces.reduce((sum, item) =>
          sum + (+item.Domestic || 0), 0)
      }
    </td>

    {/* Total International Leads */}
    <td>
      {
        souces.reduce((sum, item) =>
          sum + (+item.International || 0), 0)
      }
    </td>

    {/* Total Combined Leads */}
    <td>
      {
        souces.reduce((sum, item) =>
          sum + ((+item.International || 0) + (+item.Domestic || 0)), 0)
      }
    </td>
  </tr>


                        </tfoot>
                      </table>
                    
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

export default SourceWiseLeads;

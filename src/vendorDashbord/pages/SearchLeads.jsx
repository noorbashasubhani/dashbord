import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchLeads = () => {
  const [souces, setSouces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getSouces = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Lead-Search-list`);
        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }
        const data = await response.json();
        setSouces(data.data);
      } catch (error) {
        toast.error(error.message);
        setError(error.message);
      }
    };
    getSouces();
  }, []);

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Search Leads Details</b></h4>
          </div>
        </div>

        {/* Leads table */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Leads Details</h6>

                  {/* Search Input */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Customer Name or Mobile Number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Created Date</th>
                          <th>Customer Name</th>
                          <th>Mobile Number</th>
                          <th>Travel Type</th>
                          <th>Operations Executive</th>
                          <th>Source</th>
                          <th>Raised By</th>
                          <th>Details</th>
                          <th>Status (Where It Located ?)</th>
                        </tr>
                      </thead>

                      <tbody>
                        {souces
                          .filter(itms =>
                            itms.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            itms.holiday_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            itms.lead_source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            itms.customer_number?.includes(searchTerm)
                          )
                          .map((itms, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{new Date(itms.createdAt).toLocaleDateString()}</td>
                              <td>{itms.customer_name}</td>
                              <td>{itms.customer_number}</td>
                              <td>{itms.holiday_type}</td>
                              <td>{itms.operation_executive?.first_name || ''}</td>
                              <td>{itms.lead_source}</td>
                              <td>{itms.raised_by?.first_name || ''}</td>
                              <td>{itms.holiday_desc}</td>
                              <td>
                                {itms.lead_status === 'D'
                                  ? 'Move To Deleted Lead'
                                  : itms.lead_status === 'I'
                                  ? 'Move To Itinerary'
                                  : itms.lead_status === 'R'
                                  ? 'Move To R-N-R'
                                  : itms.lead_status === 'L'
                                  ? 'Active Lead'
                                  : itms.lead_status}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {souces.length === 0 && <p className="text-center">No leads available.</p>}
                    {error && <p className="text-danger text-center">{error}</p>}
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

export default SearchLeads;

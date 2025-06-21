import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import HolidaySummary from './HolidaySummary';
import BussDetails from './BussDetails';
import Trains from './Trains';
import { Suppliers } from './Suppliers';
import { Cruise } from './Curise';
import { Transport } from './Transport';
import { OnlineHotel } from './OnlineHotel';
import { Flight } from './Flight';
import { Day } from './Day';
import Caluculation from './Caluculation';
import { Packs } from './Packs';
import { FormIncExc } from './FromIncExc';
import DomesticHotels from './DomesticHotels';
import Visa from './Visa';
import Tcs from './Tcs';
import InternationalSuppliers from './InternationalSuppliers';
import InternationalCal from './InternationalCal';


const InternationalForm = () => {
  const [leads, setLeads] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_number: '',
    customer_email: '',
    lead_location: '',
    no_of_adults: '',
    no_of_children: '',
    no_of_infants: '',
    no_of_pax: ''
  });

  const [totals, setTotals] = useState({
    total_flight_cost: 0,
    total_cruise_cost: 0,
    total_train_cost: 0,
    total_bus_cost: 0,
    transport_cost: 0,
    online_hotel_cost: 0,
    domestic_hotel_cost: 0,
    supplementary_cost: 0,
    total_land: 0,
  });


  const { row_id } = useParams();
  //alert(row_id);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/singlelead/${row_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }
        const res = await response.json();
        setLeads(res.data);
      } catch (error) {
        toast.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
    fetchAllTotals();
  }, [row_id]);



  const fetchAllTotals = async () => {
    const resp = await fetch(`${API_URL}/vendor/Cal-INC/${row_id}`);
    const data = await resp.json();
    setTotals(data);
  };

  const updateInf = () => {
    setFormData({
      customer_name: leads.customer_name || '',
      customer_number: leads.customer_number || '',
      customer_email: leads.customer_email || '',
      lead_location: leads.lead_location || '',
      no_of_adults: leads.no_of_adults || '',
      no_of_children: leads.no_of_children || '',
      no_of_infants: leads.no_of_infants || '',
      no_of_pax: leads.no_of_pax || ''
    });
    setShowModal(true);
  };

  // Auto-update total pax when individual values change
  useEffect(() => {
    const { no_of_adults, no_of_children, no_of_infants } = formData;
    const total =
      (parseInt(no_of_adults) || 0) +
      (parseInt(no_of_children) || 0) +
      (parseInt(no_of_infants) || 0);
    setFormData((prev) => ({
      ...prev,
      no_of_pax: total
    }));
  }, [formData.no_of_adults, formData.no_of_children, formData.no_of_infants]);

  const submitUpdate = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Customer-inf/${row_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Customer info updated");
        setLeads({ ...leads, ...formData });
        setShowModal(false);
      } else {
        toast.error("Failed to update");
      }
    } catch (err) {
      toast.error("Error updating lead");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!leads) return <div>No data available for this lead.</div>;

  return (
    <>
      <main id="main" className="main">
        <NavBar />
        <SideBar />

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title" style={{ fontSize: '20px' }}>
                    Domestic Itinerary Builder
                  </h3>
                  <small>
                    Note: Before entering the details, thoroughly check that the information provided is accurate. Further, no changes are allowed once submitted to Quality Check.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title" style={{ fontSize: '16px' }}>
                    Customer Info
                  </h3>
                  <button className="btn btn-sm btn-primary my-2" onClick={updateInf}> Update Customer Details</button>
                  <div className="table-responsive">
                    <table className="table table-striped table-rounded">
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Customer Contact Number</th>
                          <th>Mail ID</th>
                          <th>Customer Location</th>
                          <th>No of Adults (+12 years)</th>
                          <th>No of Children (2-12 years)</th>
                          <th>No of Infants (0-2 years)</th>
                          <th>Total no of pax</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{leads.customer_name || 'N/A'}</td>
                          <td>{leads.customer_number || 'N/A'}</td>
                          <td>{leads.customer_email || 'N/A'}</td>
                          <td>{leads.lead_location || 'N/A'}</td>
                          <td>{leads.no_of_adults || 'N/A'}</td>
                          <td>{leads.no_of_children || 'N/A'}</td>
                          <td>{leads.no_of_infants || 'N/A'}</td>
                          <td>{leads.no_of_pax || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {showModal && (
          <div style={{
            position: 'fixed',
            top: '10%',
            left: '30%',
            width: '40%',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            zIndex: 1000
          }}>
            <h4>Update Customer Details</h4>
            <div className="form-group">
              <label>Name</label>
              <input className="form-control" value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-control" value={formData.customer_number} onChange={(e) => setFormData({ ...formData, customer_number: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" value={formData.customer_email} onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="form-control" value={formData.lead_location} onChange={(e) => setFormData({ ...formData, lead_location: e.target.value })} />
            </div>
            <div className="form-group">
              <label>No of Adults (+12 years)</label>
              <input type="number" className="form-control" value={formData.no_of_adults} onChange={(e) => setFormData({ ...formData, no_of_adults: e.target.value })} />
            </div>
            <div className="form-group">
              <label>No of Children (2-12 years)</label>
              <input type="number" className="form-control" value={formData.no_of_children} onChange={(e) => setFormData({ ...formData, no_of_children: e.target.value })} />
            </div>
            <div className="form-group">
              <label>No of Infants (0-2 years)</label>
              <input type="number" className="form-control" value={formData.no_of_infants} onChange={(e) => setFormData({ ...formData, no_of_infants: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Total no of pax</label>
              <input type="number" className="form-control" value={formData.no_of_pax} readOnly />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn btn-success" onClick={submitUpdate}>Update</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>

            <HolidaySummary customerData={leads} row_id={row_id} />
            

             <Flight customerData={leads} row_id={row_id} onUpdate={fetchAllTotals}/>
              <Trains customerData={leads} row_id={row_id} onUpdate={fetchAllTotals}/>
             <BussDetails customerData={leads} row_id={row_id} onUpdate={fetchAllTotals}/>
           


           <Visa customerData={leads} row_id={row_id} onUpdate={fetchAllTotals} />
           <Tcs customerData={leads} row_id={row_id} onUpdate={fetchAllTotals} />
           
            <OnlineHotel customerData={leads} row_id={row_id} onUpdate={fetchAllTotals}/>




             
            <Cruise customerData={leads} row_id={row_id} onUpdate={fetchAllTotals}/>

            <Suppliers customerData={leads} row_id={row_id} onUpdate={fetchAllTotals}/>
            <InternationalSuppliers row_id={row_id} onUpdate={fetchAllTotals}/>
            {/* <Transport customerData={leads} row_id={row_id} onUpdate={fetchAllTotals}/> */}
            {/* <DomesticHotels customerData={leads} row_id={row_id} onUpdate={fetchAllTotals}/> */}
            
            <Day customerData={leads} row_id={row_id}/>
            <FormIncExc customerData={leads} row_id={row_id}/>
            <InternationalCal customerData={leads} row_id={row_id} totals={totals}/>
            <Packs customerData={leads} row_id={row_id} />
            
            
            
            
        </section>

       
      </main>
      <Footer />
    </>
  );
};

export default InternationalForm;

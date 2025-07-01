import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const CIH = () => {
  const [leads, setLeads] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchLeads = async () => {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');

    try {
      const res = await fetch(`${API_URL}/vendor/Productivity/${year}/${month}`);
      const data = await res.json();
      setLeads(data.data || []);
    } catch (err) {
      console.error('Error fetching leads:', err.message);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedDate]);

  // -----------------------------
  // Summary Calculation Section
  // -----------------------------
  

  leads.forEach((lead) => {
    const calc = lead.calculation || {};
    const isDomestic = lead.holiday_type === 'Domestic';
    const isInternational = lead.holiday_type === 'International';

    const volume = isDomestic
      ? (calc.goods_tax_amount_after_land || 0)
      : (calc.total_cost_remittance || 0);

    const land = calc.goods_tax_amount_after_land || 0;
    const flight = calc.total_flight_cost || 0;
    const cruise = calc.cruise_amount_after_loading || 0;
    const visa = calc.visa_cost || 0;
    const supplement = calc.sup_charges || 0;

   
  });

  

  const formatCurrency = (num) =>
    `₹ ${Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  // -----------------------------

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="container mt-4">
          <h5>CIH by Month</h5>

          <div className="row mb-3">
            <div className="col-md-4">
              <label>Select Month</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="form-control"
              />
            </div>
          </div>

          

          {/* Leads Table */}
          <section className="section">
            <div className="card">
              <div className="card-body table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Month</th>
                      <th>Raised By</th>
                      <th>Source</th>
                      <th>Executive Name</th>
                      
                      <th>GHRN NO</th>
                      
                      <th>Customer Name</th>
                      <th>Trip Start Date</th>
                      <th>Trip End Date</th>
                      <th>Destination Name</th>
                      <th>Total Package Cost</th>
                      <th>Land Cost</th>
                      <th>Found Received</th>
                      <th>Total Paid to Vendor</th>
                      <th>Fund With Company</th>
                      <th>Gogaga Profit</th>
                      <th>Partner Land Commission</th>
                      <th>Partner Cruise Commission</th>
                      <th>GST</th>
                      <th>TCS</th>

                      <th>CIH EXC Profit</th>
                      <th>CIH less PC GST TCS</th>
                      <th>Total Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                   {leads.length > 0 ? leads.map((lead, idx) => {
  let calcul = 0;

  if (lead.holiday_type === 'Domestic') {
    calcul = lead.calculation?.goods_tax_amount_after_land || 0;
  }

  if (lead.holiday_type === 'International') {
    calcul = lead.calculation?.total_cost_remittance || 0;
  }

  const formatCurrency = (value) => `₹ ${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <tr key={lead._id}>
      <td>{idx + 1}</td>
      <td>{lead.confirmed_date?.split('T')[0]}</td>
      <td>{lead.raised_by?.first_name || '-'}</td>
      <td>{lead.lead_source || '-'}</td>
      <td>
        {lead.operation_executive?.first_name || ''} {lead.operation_executive?.last_name || ''}
      </td>
      <td>{lead.ghrn_no || '-'}</td>
      <td>{lead.customer_name || '-'}</td>
      <td>{lead.start_date?.split('T')[0]}</td>
      <td>{lead.end_date?.split('T')[0]}</td>
      <td>{lead.holiday_destination?.destination_name || '-'}</td>
      <td>{formatCurrency(lead.calculation?.total_package_cost_quoted)}</td>
      <td>{formatCurrency(calcul)}</td>
      <td></td>
      <td></td>
      <td></td>
      
      <td>{formatCurrency(lead.calculation?.loading_amount_on_land)}</td>
      <td>{formatCurrency(lead.calculation?.total_partners_percentage_amount)}</td>
      <td>{formatCurrency(lead.calculation?.total_agent_commission_amount)}</td>
      <td>{formatCurrency(lead.calculation?.goods_tax_amount)}</td>
      <td>{formatCurrency(lead.calculation?.total_tcs_cost)}</td>
      <td></td>
      <td> </td>
      </tr>
  );
}) : (
  <tr>
    <td colSpan="20" className="text-center">No leads found</td>
  </tr>
)}

                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default CIH;

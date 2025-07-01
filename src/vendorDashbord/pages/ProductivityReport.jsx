import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const ProductivityReport = () => {
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
  let domestic = {
    volume: 0,
    land: 0,
    flight: 0,
    cruise: 0,
    visa: 0,
    supplement: 0,
  };

  let international = {
    volume: 0,
    land: 0,
    flight: 0,
    cruise: 0,
    visa: 0,
    supplement: 0,
  };

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

    if (isDomestic) {
      domestic.volume += volume;
      domestic.land += land;
      domestic.flight += flight;
      domestic.cruise += cruise;
      domestic.visa += visa;
      domestic.supplement += supplement;
    }

    if (isInternational) {
      international.volume += volume;
      international.land += land;
      international.flight += flight;
      international.cruise += cruise;
      international.visa += visa;
      international.supplement += supplement;
    }
  });

  const total = {
    volume: domestic.volume + international.volume,
    land: domestic.land + international.land,
    flight: domestic.flight + international.flight,
    cruise: domestic.cruise + international.cruise,
    visa: domestic.visa + international.visa,
    supplement: domestic.supplement + international.supplement,
  };

  const formatCurrency = (num) =>
    `₹ ${Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  // -----------------------------

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="container mt-4">
          <h5>Productivity Select Month Wise</h5>

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

          {/* Summary Table */}
          <h5 className="mt-4 mb-3">Summary by Travel Type</h5>
          <table className="table table-striped table-bordered mb-4">
            <thead className="table-dark">
              <tr>
                <th>Travel Type</th>
                
                <th>Total Land Cost</th>
                <th>Total Flight Cost</th>
                <th>Total Cruise Cost</th>
                <th>Total Visa Cost</th>
                <th>Total Supplementary Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Domestic</td>
               
                <td>{formatCurrency(domestic.land)}</td>
                <td>{formatCurrency(domestic.flight)}</td>
                <td>{formatCurrency(domestic.cruise)}</td>
                <td>{formatCurrency(domestic.visa)}</td>
                <td>{formatCurrency(domestic.supplement)}</td>
              </tr>
              <tr>
                <td>International</td>
                
                <td>{formatCurrency(international.land)}</td>
                <td>{formatCurrency(international.flight)}</td>
                <td>{formatCurrency(international.cruise)}</td>
                <td>{formatCurrency(international.visa)}</td>
                <td>{formatCurrency(international.supplement)}</td>
              </tr>
              <tr className="fw-bold">
                <td>Total</td>
                
                <td>{formatCurrency(total.land)}</td>
                <td>{formatCurrency(total.flight)}</td>
                <td>{formatCurrency(total.cruise)}</td>
                <td>{formatCurrency(total.visa)}</td>
                <td>{formatCurrency(total.supplement)}</td>
              </tr>
            </tbody>
          </table>

          {/* Leads Table */}
          <section className="section">
            <div className="card">
              <div className="card-body table-responsive">
                <table className="table table-bordered table-hover table-striped text-sm">
  <thead className="table-dark text-center align-middle">
    <tr>
      <th>#</th>
      <th>GHRN NO</th>
      <th>Trip Start</th>
      <th>Super Partner</th>
      <th>Sales Partner</th>
      <th>Lead Generator</th>
      <th>Itinerary Executive</th>
      <th>Customer Name</th>
      <th>Contact Number</th>
      <th>Customer Location</th>
      <th>Holiday Location</th>
      <th>Holiday Type</th>
      <th>No of Pax</th>
      <th className="text-end">Land Cost</th>
      <th className="text-end">Flight Cost</th>
      <th className="text-end">Cruise Cost</th>
      <th className="text-end">Visa Cost</th>
      <th className="text-end">Supplementary Cost</th>
      <th className="text-end">Total Package Cost</th>
      <th>Created At</th>
    </tr>
  </thead>
  <tbody>
    {leads.length > 0 ? leads.map((lead, idx) => {
      let calcul = 0;
      if (lead.holiday_type === 'Domestic') {
        calcul = (lead.calculation?.goods_tax_amount_after_land || 0) - (lead.calculation?.goods_tax_amount || 0);
      }
      if (lead.holiday_type === 'International') {
        calcul = (lead.calculation?.total_cost_remittance || 0) - (lead.calculation?.goods_tax_amount || 0);
      }

      return (
        <tr key={lead._id}>
          <td>{idx + 1}</td>
          <td>{lead.ghrn_no}</td>
          <td>{lead.start_date?.split('T')[0]}</td>
          <td>{lead.super_partner || '-'}</td>
          <td>{lead.sales_partner || '-'}</td>
          <td>{lead.lead_generator || '-'}</td>
          <td>{lead.operation_executive?.first_name && lead.operation_executive?.last_name || '-'}</td>
          <td>{lead.customer_name}</td>
          <td>{lead.customer_number}</td>
          <td>{lead.lead_location}</td>
          <td>{lead.holiday_destination?.destination_name}</td>
          <td>{lead.holiday_type}</td>
          <td>{lead.no_of_pax}</td>
          <td className="text-end">{formatCurrency(calcul.toFixed(2))}</td>
          <td className="text-end">{formatCurrency(lead.calculation?.total_flight_cost || 0)}</td>
          <td className="text-end">{formatCurrency(lead.calculation?.cruise_amount_after_loading || 0)}</td>
          <td className="text-end">{formatCurrency(lead.calculation?.visa_cost || 0)}</td>
          <td className="text-end">{formatCurrency(lead.calculation?.sup_charges || 0)}</td>
          <td className="text-end">{formatCurrency(lead.calculation?.total_package_cost_quoted || 0)}</td>
          <td>{lead.createdAt?.split('T')[0]}</td>
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

export default ProductivityReport;

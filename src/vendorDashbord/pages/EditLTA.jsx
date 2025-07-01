import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const EditLTA = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leadDetails, setLeadDetails] = useState(null);
  const [isPaymentManuallyEdited, setIsPaymentManuallyEdited] = useState(false);

  const [form, setForm] = useState({
    gogaga_reference_no: '',
    invoice_no: '',
    date_of_issue: '',
    gst_amount: '',
    total_cab_cost_excl_gst: '',
    total_cab_cost_incl_gst: '',
    payment_received: '',
    pending_payment: ''
  });

  const [cabEntries, setCabEntries] = useState([]);

  useEffect(() => {
    const fetchLTA = async () => {
      try {
        const res = await fetch(`${API_URL}/vendor/lta/${id}`);
        const data = await res.json();
        if (res.ok) {
          const { cab_entries, ...mainData } = data.data;
          setForm(mainData);
          setCabEntries(cab_entries?.length ? cab_entries : [{ date: '', distance_kms: '', price_per_km: '', total_price: '', description: '' }]);
        }
      } catch (err) {
        console.error('Failed to load LTA:', err);
      }
    };

    fetchLTA();
  }, [id]);

  useEffect(() => {
    if (leadDetails && leadDetails.totalAmount && !isPaymentManuallyEdited) {
      setForm((prev) => ({
        ...prev,
        payment_received: leadDetails.totalAmount
      }));
    }
  }, [leadDetails, isPaymentManuallyEdited]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'payment_received') setIsPaymentManuallyEdited(true);
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'gogaga_reference_no' && value.length >= 4) {
      try {
        const res = await fetch(`${API_URL}/vendor/getLeadReceivedamount/${value}`);
        const data = await res.json();
        if (res.ok && data.data) {
          setLeadDetails(data.data);
          setIsPaymentManuallyEdited(false);
        } else {
          setLeadDetails(null);
          setForm((prev) => ({ ...prev, payment_received: '' }));
        }
      } catch (err) {
        console.error('Error fetching lead details:', err);
        setLeadDetails(null);
        setForm((prev) => ({ ...prev, payment_received: '' }));
      }
    }
  };

  const handleCabChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...cabEntries];
    updated[index][name] = value;

    if (name === 'distance_kms' || name === 'price_per_km') {
      const kms = parseFloat(updated[index].distance_kms) || 0;
      const rate = parseFloat(updated[index].price_per_km) || 0;
      updated[index].total_price = (kms * rate).toFixed(2);
    }

    setCabEntries(updated);
  };

  const addCabRow = () => {
    setCabEntries([...cabEntries, { date: '', distance_kms: '', price_per_km: '', total_price: '', description: '' }]);
  };

  const removeCabRow = (index) => {
    const updated = [...cabEntries];
    updated.splice(index, 1);
    setCabEntries(updated);
  };

  useEffect(() => {
    const totalExclGST = cabEntries.reduce((sum, entry) => {
      return sum + (parseFloat(entry.total_price) || 0);
    }, 0);

    const gstPercent = parseFloat(form.gst_amount) || 0;
    const gstAmount = (totalExclGST * gstPercent) / 100;
    const inclGST = totalExclGST + gstAmount;

    const received = parseFloat(form.payment_received) || 0;
    const pending = inclGST - received;

    setForm((prev) => ({
      ...prev,
      total_cab_cost_excl_gst: totalExclGST.toFixed(2),
      total_cab_cost_incl_gst: inclGST.toFixed(2),
      pending_payment: pending.toFixed(2),
    }));
  }, [cabEntries, form.gst_amount, form.payment_received]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, cab_entries: cabEntries };
      const res = await fetch(`${API_URL}/vendor/lta/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (res.ok) {
        alert('LTA updated successfully');
        navigate('/lta');
      } else {
        alert(result.message || 'Update failed');
      }
    } catch (err) {
      console.error('Error updating LTA:', err);
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <h5>Edit LTA</h5>

        {leadDetails && (
          <div className="col-12 mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Travel Start Date</th>
                  <th>Destination Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{leadDetails.leadDetails?.customer_name}</td>
                  <td>{leadDetails.leadDetails?.start_date?.split('T')[0]}</td>
                  <td>{leadDetails.leadDetails?.alldestination?.destination_name}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

       <form onSubmit={handleSubmit} className="row g-3">
  <div className="col-md-4">
    <label>Gogaga Reference No</label>
    <input
      type="text"
      className="form-control"
      name="gogaga_reference_no"
      value={form.gogaga_reference_no}
      onChange={handleChange}
      required
    />
  </div>

  <div className="col-md-4">
    <label>Invoice No</label>
    <input
      type="text"
      className="form-control"
      name="invoice_no"
      value={form.invoice_no}
      onChange={handleChange}
      required
    />
  </div>

  <div className="col-md-4">
    <label>Date of Issue</label>
    <input
      type="date"
      className="form-control"
      name="date_of_issue"
      value={form.date_of_issue}
      onChange={handleChange}
      required
    />
  </div>

  <div className="col-12 mt-3">
    <h6>Cab Entry Details</h6>
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Distance (Kms)</th>
          <th>Price per Km</th>
          <th>Total Price</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {cabEntries.map((entry, idx) => (
          <tr key={idx}>
            <td>
              <input
                type="date"
                className="form-control"
                name="date"
                value={entry.date}
                onChange={(e) => handleCabChange(idx, e)}
                required
              />
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                name="distance_kms"
                value={entry.distance_kms}
                onChange={(e) => handleCabChange(idx, e)}
                required
              />
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                name="price_per_km"
                value={entry.price_per_km}
                onChange={(e) => handleCabChange(idx, e)}
                required
              />
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                name="total_price"
                value={entry.total_price}
                readOnly
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                name="description"
                value={entry.description}
                onChange={(e) => handleCabChange(idx, e)}
              />
            </td>
            <td>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeCabRow(idx)}
                disabled={cabEntries.length === 1}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button type="button" className="btn btn-primary" onClick={addCabRow}>
      Add Row
    </button>
  </div>

  <div className="col-md-4 mt-4">
    <label>Total Cab Cost Excl. GST</label>
    <input
      type="number"
      className="form-control"
      name="total_cab_cost_excl_gst"
      value={form.total_cab_cost_excl_gst}
      readOnly
    />
  </div>

  <div className="col-md-4 mt-4">
    <label>GST Amount (%)</label>
    <input
      type="number"
      className="form-control"
      name="gst_amount"
      value={form.gst_amount}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4 mt-4">
    <label>Total Cab Cost Incl. GST</label>
    <input
      type="number"
      className="form-control"
      name="total_cab_cost_incl_gst"
      value={form.total_cab_cost_incl_gst}
      readOnly
    />
  </div>

  <div className="col-md-4">
    <label>Payment Received</label>
    <input
      type="number"
      className="form-control"
      name="payment_received"
      value={form.payment_received}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4">
    <label>Pending Payment</label>
    <input
      type="number"
      className="form-control"
      name="pending_payment"
      value={form.pending_payment}
      readOnly
    />
  </div>

  <div className="col-12">
    <button type="submit" className="btn btn-success">Update</button>
    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/lta')}>
      Cancel
    </button>
  </div>
</form>

      </main>
      <Footer />
    </>
  );
};

export default EditLTA;

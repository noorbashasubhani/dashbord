import React, { useState } from 'react';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const AddIvoice = () => {
  const [leadDetails, setLeadDetails] = useState(null);

  const [form, setForm] = useState({
    ghrn_no: '',
    date_of_issue: '',
    payment_type: '',
    rounded_off: 0,
    items: [
      {
        sac_code: '',
        qty: 1,
        rate: 0,
        taxable_value: 0,
        gst_percent: 0,
        amount: 0,
        total: 0
      }
    ]
  });

  const handleGhrnChange = async (e) => {
    const ghrn = e.target.value;
    setForm({ ...form, ghrn_no: ghrn });

    if (ghrn.length >= 4) {
      try {
        const res = await fetch(`${API_URL}/vendor/getLeadByGST/${ghrn}`);
        const result = await res.json();
        if (res.ok) {
          setLeadDetails(result.data);
        } else {
          setLeadDetails(null);
        }
      } catch (err) {
        console.error(err);
        setLeadDetails(null);
      }
    } else {
      setLeadDetails(null);
    }
  };

  const handleItemChange = (index, e) => {
  const { name, value } = e.target;
  const items = [...form.items];

  // Always set SAC Code to fixed value
  items[index].sac_code = 'Tour Package - 998552';

  // Update field value
  items[index][name] = value;

  // Extract values
  const qty = parseFloat(items[index].qty) || 1; // avoid divide by 0
  const taxable = parseFloat(items[index].taxable_value) || 0;
  const gst = parseFloat(items[index].gst_percent) || 0;

  // Calculate derived fields
  const rate = taxable / qty;
  const gstAmount = (taxable * gst) / 100;
  const total = taxable + gstAmount;

  // Assign values
  items[index].rate = rate.toFixed(2);
  items[index].amount = gstAmount.toFixed(2);
  items[index].total = total.toFixed(2);

  // Update form
  setForm({ ...form, items });
};


  const addItemRow = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          sac_code: '',
          qty: 1,
          rate: 0,
          taxable_value: 0,
          gst_percent: 0,
          amount: 0,
          total: 0
        }
      ]
    });
  };

  const removeItemRow = (index) => {
    const items = [...form.items];
    items.splice(index, 1);
    setForm({ ...form, items });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/vendor/gst-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const result = await res.json();
      if (res.ok) {
        alert('Invoice submitted');
        setForm({
          ghrn_no: '',
          date_of_issue: '',
          payment_type: '',
          rounded_off: 0,
          items: [{
            sac_code: '',
            qty: 1,
            rate: 0,
            taxable_value: 0,
            gst_percent: 0,
            amount: 0,
            total: 0
          }]
        });
        setLeadDetails(null);
      } else {
        alert(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Server error');
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <h5>Add GST Invoice</h5>

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-4">
              <label>GHRN No</label>
              <input
                type="text"
                className="form-control"
                name="ghrn_no"
                value={form.ghrn_no}
                onChange={handleGhrnChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label>Date of Issue</label>
              <input type="date" className="form-control" name="date_of_issue" value={form.date_of_issue} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label>Payment Type</label>
              <select className="form-control" name="payment_type" value={form.payment_type} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="UPI">UPI</option>
                <option value="NEFT">NEFT</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {leadDetails && (
            <div className="mb-4 border p-3 bg-light">
              <h6>Lead Details</h6>
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr><th>Customer Name</th><td>{leadDetails.customer_name}</td></tr>
                  <tr><th>Travel Destination</th><td>{leadDetails.destination_name}</td></tr>
                  <tr><th>Travel Start Date</th><td>{leadDetails.start_date?.split('T')[0]}</td></tr>
                  <tr><th>Land Package Cost</th><td>{leadDetails.land_package_cost}</td></tr>
                  <tr><th>Package Cost Less GST</th><td>{leadDetails.package_cost_less_gst}</td></tr>
                  <tr><th>GST %</th><td>{leadDetails.gst_percent}%</td></tr>
                  <tr><th>GST Amount</th><td>{leadDetails.gst_amount}</td></tr>
                  <tr><th>Total Package Cost Incl GST</th><td>{leadDetails.total_package_cost_incl_gst}</td></tr>
                  <tr><th>Payment Received</th><td>{leadDetails.payment_received}</td></tr>
                  <tr><th>TCS Received</th><td>{leadDetails.tcs_received}</td></tr>
                  <tr><th>Pending Payment</th><td>{leadDetails.pending_payment}</td></tr>
                  <tr><th>Difference Amount</th><td>{leadDetails.difference_amount}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          <h6>Items (SAC Details)</h6>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SAC Code</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Taxable Value</th>
                <th>GST %</th>
                <th>Amount</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, index) => (
                <tr key={index}>
                  <td><input type="text" name="sac_code" className="form-control" value="Tour Package - 998552" onChange={(e) => handleItemChange(index, e)} required /></td>
                  <td><input type="number" name="qty" className="form-control" value={item.qty} onChange={(e) => handleItemChange(index, e)} required /></td>
                  <td><input type="number" name="rate" className="form-control" value={item.rate} onChange={(e) => handleItemChange(index, e)} disabled /></td>
                  <td><input type="number" name="taxable_value" className="form-control" value={item.taxable_value}  onChange={(e) => handleItemChange(index, e)}/></td>
                  <td><input type="number" name="gst_percent" className="form-control" value={item.gst_percent} onChange={(e) => handleItemChange(index, e)} required /></td>
                  <td><input type="number" name="amount" className="form-control" value={item.amount} readOnly /></td>
                  <td><input type="number" name="total" className="form-control" value={item.total} readOnly /></td>
                  <td>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItemRow(index)} disabled={form.items.length === 1}>Remove</button>
                  </td>
                </tr>
              ))}
              <tr className="fw-bold bg-light">
  <td colSpan="3" className="text-end">Grand Total</td>
  <td>
    {form.items.reduce((sum, item) => sum + (parseFloat(item.taxable_value) || 0), 0).toFixed(2)}
  </td>
  <td></td>
  <td>
    {form.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)}
  </td>
  <td>
    {form.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}
  </td>
  <td></td>
</tr>

            </tbody>
          </table>
          <button type="button" className="btn btn-primary mb-3" onClick={addItemRow}>Add Row</button>

          <div className="mb-3 col-md-4">
  <label>Rounded Off</label>
  <input
    type="number"
    step="0.01"
    className="form-control"
    name="rounded_off"
    value={form.rounded_off}
    onChange={handleChange}
  />
</div>


          <button type="submit" className="btn btn-success">Submit Invoice</button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default AddIvoice;

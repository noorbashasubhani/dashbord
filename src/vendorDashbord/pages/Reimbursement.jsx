import React, { useState,useEffect } from 'react';
import Select from 'react-select';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
const travelPurposes = [
  { label: 'Business Meeting', value: 'Business Meeting' },
  { label: 'Partner Recruitment', value: 'Partner Recruitment' },
  { label: 'Sales Call', value: 'Sales Call' },
  { label: 'Marketing Activity', value: 'Marketing Activity' },
  { label: 'Other Reasons', value: 'Other Reasons' },
];

const managersList = [
  { label: 'Alice', value: 'alice' },
  { label: 'Bob', value: 'bob' },
  { label: 'Charlie', value: 'charlie' },
];

const Reimbursement = () => {
  const [travelPurpose, setTravelPurpose] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [managers, setManagers] = useState([]);
  const [reason, setReason] = useState('');
  const [rows, setRows] = useState([
    { date: '', category: '', particulars: '', distance: '', cost: '' },
  ]);
  const [advance, setAdvance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [managerOptions, setManagerOptions] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [reimbursements, setReimbursements] = useState([]);
const [viewModalItem, setViewModalItem] = useState(null); 


useEffect(() => {
  const fetchManagers = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Employelist`);
      const datas = await response.json();
      const data=await datas.data;
      const formatted = data.map(emp => ({
        label: emp.first_name,   // or emp.fullName, depending on your schema
        value: emp._id     // or emp.emp_id or any unique field
      }));

      setManagerOptions(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingManagers(false);
    }
  };

  fetchManagers();
    fetchReimbursements();

}, []);
  
 const fetchReimbursements = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/Reimbursements`);
      const result = await res.json();
      if (res.ok) {
        setReimbursements(result.data || []);  // assuming API returns { data: [...] }
      } else {
        console.error('Fetch error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching reimbursements:', error);
    }
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { date: '', category: '', particulars: '', distance: '', cost: '' }]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const getSubtotal = () => {
    return rows.reduce((sum, row) => sum + parseFloat(row.cost || 0), 0);
  };

  const subtotal = getSubtotal();
  const finalTotal = subtotal - advance;

  const handleSubmit = async () => {
  const payload = {
    travelPurpose,
    fromDate,
    toDate,
    managers: managers.map(m => m.value), // Only send IDs
    reason,
    travelDetails: rows,
    subtotal,
    advance,
    finalTotal
  };

  try {
    const response = await fetch(`${API_URL}/vendor/Reimbursements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Reimbursement submitted successfully!');
      setShowModal(false); // Close modal
      // Optionally reset form here
    } else {
      alert(`Error: ${result.message || 'Submission failed.'}`);
    }

  } catch (error) {
    console.error('Submission error:', error);
    alert('Something went wrong.');
  }
};


// after your other hooks:
const handleStatusChange = async (id, newStatus) => {
  try {
    const res = await fetch(`${API_URL}/vendor/Reimbursements/${id}`, {
      method: 'PUT',              // or PATCH
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update');

    fetchReimbursements();
  } catch (err) {
    console.error('Status update error:', err);
    alert('Could not update status.');
  }
};



  return (
    <>
     <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h4>
            <i className="bi bi-pin-fill mx-2"></i>
            <b>Rip Details</b>
          </h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Reimbursement Details</a>
              </li>
              <li className="breadcrumb-item active">Reimbursement</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto"  onClick={() => setShowModal(true)}>
              + Add Reimbursement 
            </button>
          </nav>
        </div>
    <div className="container mt-4">
  <h4 className="mb-3">Submitted Reimbursements</h4>
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Travel Purpose</th>
        <th>From</th>
        <th>To</th>
        <th>Managers</th>
        <th>Advance</th>
        <th>Total</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {reimbursements.map((item, idx) => (
        <tr key={idx}>
          <td>{item.travelPurpose}</td>
          <td>{item.fromDate}</td>
          <td>{item.toDate}</td>
          <td>
        {Array.isArray(item.managers) && item.managers.length > 0
          ? item.managers
              .map(m => `${m.first_name.trim()} ${m.last_name.trim()}`)
              .join(', ')
          : '—'}
      </td>
          <td>₹{item.advance}</td>
          <td>₹{item.finalTotal}</td>
          <td>{item.status ==='P' ? 'Pending':
              item.status ==='A' ? 'Accepted':
              item.status ==='R' ? 'Rejected':''} </td>
          <td>
            <button
    className="btn btn-sm btn-primary me-2"
    onClick={() => handleStatusChange(item._id, 'A')}
    disabled={item.status === 'A'}
  >
    Accept
  </button>
  <button
    className="btn btn-sm btn-danger"
    onClick={() => handleStatusChange(item._id, 'R')}
    disabled={item.status === 'R'}
  >
    Reject
  </button>
  <button className="btn btn-sm btn-warning" onClick={() => setViewModalItem(item)}>View</button>
            </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </main>
    {showModal && (
  <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content lg">
        <div className="modal-header">
          <h5 className="modal-title">Add Reimbursement Details</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="container mt-4">
      

      <div className="mb-3">
        <label>Travel Purpose</label>
        <Select options={travelPurposes} onChange={(e) => setTravelPurpose(e.value)} />
      </div>

      <div className="mb-3">
        <label>From Date</label>
        <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>To Date</label>
        <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Manager Names</label>
        <Select options={managerOptions} isMulti isLoading={loadingManagers} onChange={(e) => setManagers(e)} />
      </div>

      <div className="mb-3">
        <label>Any Reasons</label>
        <textarea className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>

      <h5>Travel Details</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Particulars</th>
            <th>Distance (km)</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td><input type="date" className="form-control" value={row.date} onChange={(e) => handleRowChange(idx, 'date', e.target.value)} /></td>
              <td><input type="text" className="form-control" value={row.category} onChange={(e) => handleRowChange(idx, 'category', e.target.value)} /></td>
              <td><input type="text" className="form-control" value={row.particulars} onChange={(e) => handleRowChange(idx, 'particulars', e.target.value)} /></td>
              <td><input type="number" className="form-control" value={row.distance} onChange={(e) => handleRowChange(idx, 'distance', e.target.value)} /></td>
              <td><input type="number" className="form-control" value={row.cost} onChange={(e) => handleRowChange(idx, 'cost', e.target.value)} /></td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRow(idx)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary mb-3" onClick={handleAddRow}>Add Row</button>

      <div className="mb-2">
        <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
      </div>

      <div className="mb-2">
        <label>Less Advance:</label>
        <input type="number" className="form-control" value={advance} onChange={(e) => setAdvance(parseFloat(e.target.value || 0))} />
      </div>

      <div className="mb-3">
        <strong>Final Total:</strong> ₹{finalTotal.toFixed(2)}
      </div>

<button className="btn btn-success" onClick={handleSubmit}>Submit</button>
    </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>

        </div>
      </div>
    </div>
  </div>
)}


{viewModalItem && (
  <div className="modal fade show d-block" tabIndex="-1"
       style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Reimbursement Details</h5>
          <button type="button" className="btn-close"
                  onClick={() => setViewModalItem(null)}></button>
        </div>
        <div className="modal-body">
          <p><strong>Purpose:</strong> {viewModalItem.travelPurpose || '—'}</p>
          <p>
            <strong>Dates:</strong>{' '}
            {viewModalItem.fromDate
              ? new Date(viewModalItem.fromDate).toLocaleDateString()
              : '—'}
            {' '}to{' '}
            {viewModalItem.toDate
              ? new Date(viewModalItem.toDate).toLocaleDateString()
              : '—'}
          </p>
          <p>
            <strong>Managers:</strong>{' '}
            {viewModalItem.managers
              .map(m => `${m.first_name.trim()} ${m.last_name.trim()}`)
              .join(', ')}
          </p>
          <p><strong>Reason:</strong> {viewModalItem.reason || '—'}</p>
          <hr />
          <h6>Travel Lines</h6>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th><th>Category</th><th>Particulars</th>
                <th>Distance</th><th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {viewModalItem.travelDetails.map((d, i) => (
                <tr key={i}>
                  <td>{new Date(d.date).toLocaleDateString()}</td>
                  <td>{d.category}</td>
                  <td>{d.particulars}</td>
                  <td>{d.distance}</td>
                  <td>₹{d.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><strong>Subtotal:</strong> ₹{viewModalItem.subtotal}</p>
          <p><strong>Advance:</strong> ₹{viewModalItem.advance}</p>
          <p><strong>Final Total:</strong> ₹{viewModalItem.finalTotal}</p>
          <p><strong>Status:</strong>{' '}
            {viewModalItem.status === 'P' ? 'Pending'
              : viewModalItem.status === 'A' ? 'Approved'
              : 'Rejected'}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary"
                  onClick={() => setViewModalItem(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

     <Footer />
     </>
  );
};

export default Reimbursement;

import React, { useState,useEffect } from 'react';
import { API_URL } from '../data/apiUrl';

const Proforma = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [rows, setRows] = useState([{ description: '', pax: 0, costPerPax: 0 }]);
  const [formData, setFormData] = useState({
    dateOfIssue: '',
    customerName: '',
    destination: '',
    startDate: '',
    gstNumber: '',
    address: '',
    gstPercent: 0
  });

  const addRow = () => {
    setRows([...rows, { description: '', pax: 0, costPerPax: 0 }]);
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = field === 'description' ? value : Number(value);
    setRows(updatedRows);
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const subtotal = rows.reduce((acc, row) => acc + (row.pax * row.costPerPax), 0);
  const gstAmount = (subtotal * formData.gstPercent) / 100;
  const totalPayable = subtotal + gstAmount;

  const handleSubmit = async () => {
  const proformaPayload = {
    ...formData,
    rows,
    subtotal,
    gstAmount,
    totalPayable,
    totalPackageCost: totalPayable
  };

  try {
    const response = await fetch(`${API_URL}/vendor/Proforma`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(proformaPayload)
    });

    if (!response.ok) throw new Error('Failed to save data');

   
   // fetchData();
    setShowModal(false);
  } catch (err) {
    console.error(err);
    alert('Error saving proforma');
  }
};


const fetchData = async () => {
  try {
    const res = await fetch(`${API_URL}/vendor/Proforma`);
    const json = await res.json();
    setData(json.data); // assuming your API returns { data: [...] }
  } catch (err) {
    console.error('Failed to fetch proformas', err);
  }
};

useEffect(() => {
  fetchData();
}, []);

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>All Proforma</h5>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create Proforma</button>
        </div>

        <table className="table table-striped table-bordered">
         <thead>
  <tr>
    <th>S.No</th>
    <th>Customer Name</th>
    <th>Travel Start Date</th>
    <th>Destination</th>
    <th>Travel Issue Date</th>
    <th>GST Number</th>
    <th>Towards</th>
    <th>Total Amount</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {data.map((item, index) => (
    <tr key={item._id}>
      <td>{index + 1}</td>
      <td>{item.customerName}</td>
      <td>{item.startDate?.split('T')[0]}</td>
      <td>{item.destination}</td>
      <td>{item.dateOfIssue?.split('T')[0]}</td>
      <td>{item.gstNumber || '-'}</td>
      <td>{item.rows.map(r => r.description).join(', ')}</td>
      <td>₹{item.totalPackageCost?.toFixed(2)}</td>
      <td>
        <button className="btn btn-sm btn-info">View</button>
        <button className="btn btn-sm btn-danger" onClick={() => {
  setSelectedId(item._id);
  setShowDeleteModal(true);
}}>
  Delete
</button>
      </td>
    </tr>
  ))}
</tbody>

        </table>

        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Proforma</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row mb-3">
                      <div className="col">
                        <label className="form-label">Date Of Issue</label>
                        <input type="date" className="form-control" onChange={e => handleFormChange('dateOfIssue', e.target.value)} />
                      </div>
                      <div className="col">
                        <label className="form-label">Customer Name</label>
                        <input className="form-control" placeholder="Customer Name" onChange={e => handleFormChange('customerName', e.target.value)} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col">
                        <label className="form-label">Travel Destination</label>
                        <input className="form-control" placeholder="Travel Destination" onChange={e => handleFormChange('destination', e.target.value)} />
                      </div>
                      <div className="col">
                        <label className="form-label">Travel Start Date</label>
                        <input type="date" className="form-control" onChange={e => handleFormChange('startDate', e.target.value)} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col">
                        <label className="form-label">GST Number</label>
                        <input className="form-control" placeholder="GST Number" onChange={e => handleFormChange('gstNumber', e.target.value)} />
                      </div>
                      <div className="col">
                        <label className="form-label">Address Details</label>
                        <input className="form-control" placeholder="Address Details" onChange={e => handleFormChange('address', e.target.value)} />
                      </div>
                    </div>

                    <h6 className="mt-3">Service Description</h6>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>No of Pax</th>
                          <th>Cost Per Pax</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, idx) => (
                          <tr key={idx}>
                            <td><input className="form-control" value={row.description} onChange={e => handleRowChange(idx, 'description', e.target.value)} /></td>
                            <td><input type="number" className="form-control" value={row.pax} onChange={e => handleRowChange(idx, 'pax', e.target.value)} /></td>
                            <td><input type="number" className="form-control" value={row.costPerPax} onChange={e => handleRowChange(idx, 'costPerPax', e.target.value)} /></td>
                            <td>{row.pax * row.costPerPax}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button type="button" className="btn btn-sm btn-outline-primary mb-3" onClick={addRow}>+ Add Row</button>

                    <div className="mb-3">
                      <label className="form-label">GST %</label>
                      <input type="number" className="form-control" onChange={e => handleFormChange('gstPercent', Number(e.target.value))} />
                    </div>
                    <div className="mb-2"><strong>Sub Total:</strong> ₹{subtotal.toFixed(2)}</div>
                    <div className="mb-2"><strong>GST Amount:</strong> ₹{gstAmount.toFixed(2)}</div>
                    <div className="mb-2"><strong>Total Payable:</strong> ₹{totalPayable.toFixed(2)}</div>
                    <div className="mb-2"><strong>Total Package Cost:</strong> ₹{totalPayable.toFixed(2)}</div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (
  <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Deletion</h5>
          <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this proforma?</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={async () => {
            try {
              const response = await fetch(`${API_URL}/vendor/Proforma/${selectedId}`, {
                method: 'DELETE',
              });
              if (!response.ok) throw new Error('Delete failed');
             // alert('Proforma deleted successfully');
              fetchData();
              setShowDeleteModal(false);
            } catch (err) {
              console.error(err);
              alert('Error deleting proforma');
            }
          }}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default Proforma;
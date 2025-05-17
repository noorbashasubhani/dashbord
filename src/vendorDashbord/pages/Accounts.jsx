import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';

const Accounts = () => {
  const [transactionType, setTransactionType] = useState('debit');
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('ICICI');
  const [remarks, setRemarks] = useState('');
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false); // ✅ Show/hide modal

  const [isEditing, setIsEditing] = useState(false);
const [editingEntryId, setEditingEntryId] = useState(null);


  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/GetAcc`);
      const data = await response.json();
      if (data?.data) {
        setEntries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const entryData = {
    transactionType,
    amount,
    bankName,
    remarks,
  };

  const url = isEditing
    ? `${API_URL}/vendor/update-acc/${editingEntryId}`
    : `${API_URL}/vendor/Add-acc`;

  const method = isEditing ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });

    const result = await response.json();

    if (response.ok) {
      // Clear form and reset state
      setTransactionType('debit');
      setAmount('');
      setBankName('ICICI');
      setRemarks('');
      setShowModal(false);
      setIsEditing(false);
      setEditingEntryId(null);
      fetchEntries();
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};


const handleEdit = (entry) => {
  setTransactionType(entry.transactionType.toLowerCase());
  setAmount(entry.amount);
  setBankName(entry.bankName);
  setRemarks(entry.remarks);
  setEditingEntryId(entry._id);
  setIsEditing(true);
  setShowModal(true);
};

  // Calculate the final balance after all transactions
  const calculateFinalBalance = () => {
    return entries.reduce((acc, entry) => {
      return entry.transactionType === "Debit"
        ? acc - parseFloat(entry.amount)
        : acc + parseFloat(entry.amount);
    }, 0);
  };

  const finalBalance = calculateFinalBalance(); // Get the final balance

  return (
    <div style={{ padding: '20px' }}>
      <h2>Accounts</h2>

      {/* ✅ Add Button */}
      <button onClick={() => setShowModal(true)} className="btn btn-primary">+ Add Transaction</button>

      {/* ✅ Modal Popup */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%',
          height: '100%', backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', padding: '20px', borderRadius: '5px',
            minWidth: '400px', position: 'relative'
          }}>
            <h3>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h3>

            <form
  onSubmit={handleSubmit}
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  }}
>
  {/* Transaction Type */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Transaction Type:</label>
    <select
      value={transactionType}
      onChange={(e) => setTransactionType(e.target.value)}
      style={{
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
      }}
      required
    ><option value="">Please Select Transaction Type</option>
      <option value="Debit">Debit</option>
      <option value="Credit">Credit</option>
    </select>
  </div>

  {/* Amount */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Amount:</label>
    <input
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      required
      placeholder="Enter amount"
      style={{
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
      }}
    />
  </div>

  {/* Bank Name */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Bank Name:</label>
    <select
      value={bankName}
      onChange={(e) => setBankName(e.target.value)}
      style={{
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
      }}
      required
    >
      <option value="">Please Select Bank</option>
      <option value="ICICI">ICICI Bank</option>
      <option value="INDUS">INDUS Bank</option>
      <option value="HDFC">HDFC Bank</option>
    </select>
  </div>

  {/* Remarks */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Remarks:</label>
    <textarea
      value={remarks}
      onChange={(e) => setRemarks(e.target.value)}
      placeholder="Enter remarks"
      style={{
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        minHeight: '80px',
      }}
      required
    />
  </div>

  {/* Buttons */}
  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
    
    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
      Cancel
    </button>
    <button type="submit" className="btn btn-success" style={{ padding: '8px 16px' }}>
      Save
    </button>
  </div>
</form>

          </div>
        </div>
      )}

      {/* ✅ Table */}
      {entries.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h6 className="text-right">Remaining Balance In Bank : {finalBalance.toFixed(2)}</h6>
          
          <table border="1" className="table table-stripped table-bordered" cellPadding="10" 
          style={{
    width: '100%',
    maxWidth: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Entry Date</th>
                <th>Remarks</th>
                <th>Bank Name</th>
                <th>Transaction Type</th>
               
                
                 <th>Amount</th>
                 <th>Action</th>
                 
              </tr>
            </thead><tbody>
          {entries.map((entry, index) => (
            <tr key={entry._id || index}>
              <td>{index + 1}</td>
              <td>{entry.createdAt}</td>
              <td>{entry.remarks}</td>
              <td>{entry.bankName}</td>
              <td>{entry.transactionType}</td>
              <td>{entry.amount}</td>
              <td>
  <button onClick={() => handleEdit(entry)} className="btn btn-sm btn-warning">Edit</button>
</td>
            </tr>
          ))}
        </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Accounts;

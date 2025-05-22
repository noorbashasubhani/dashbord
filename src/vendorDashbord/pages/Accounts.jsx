import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import DataTable from 'react-data-table-component';  // Import DataTable

const Accounts = () => {
  const [transactionType, setTransactionType] = useState('debit');
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('ICICI');
  const [remarks, setRemarks] = useState('');
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);

  const [selectedYearMonth, setSelectedYearMonth] = useState('');

  // Fetch entries
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

  // Submit handler for add/edit
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

  // Filter entries by selected year and month
  const filteredEntries = entries.filter(entry => {
    if (!selectedYearMonth) return true;

    const entryDate = new Date(entry.createdAt);
    const entryYearMonth = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;

    return entryYearMonth === selectedYearMonth;
  });

  // Calculate balance based on filtered entries
  const calculateFinalBalance = () => {
    return filteredEntries.reduce((acc, entry) => {
      return entry.transactionType.toLowerCase() === "debit"
        ? acc - parseFloat(entry.amount)
        : acc + parseFloat(entry.amount);
    }, 0);
  };

  const finalBalance = calculateFinalBalance();

  // Define columns for DataTable
  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: 'Entry Date',
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.remarks,
      sortable: true,
    },
    {
      name: 'Bank Name',
      selector: (row) => row.bankName,
      sortable: true,
    },
    {
      name: 'Transaction Type',
      selector: (row) => row.transactionType,
      sortable: true,
      cell: (row) => (
        <span style={{ color: row.transactionType.toLowerCase() === 'debit' ? 'red' : 'green', fontWeight: 'bold' }}>
          {row.transactionType}
        </span>
      ),
    },
    {
      name: 'Amount',
      selector: (row) => row.amount,
      sortable: true,
      right: true,
    },
    {
      name: 'Action',
      selector: (row) => (
        <button onClick={() => handleEdit(row)} className="btn btn-sm btn-warning">Edit</button>
      ),
      button: true,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Accounts</h2>

      {/* Add Transaction Button */}
      <button onClick={() => setShowModal(true)} className="btn btn-primary">+ Add Transaction</button>

      {/* Month-Year Filter */}
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="monthPicker" style={{ fontWeight: 'bold', marginRight: '10px' }}>Filter by Month & Year:</label>
        <input
          type="month"
          id="monthPicker"
          value={selectedYearMonth}
          onChange={(e) => setSelectedYearMonth(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Modal Form */}
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
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="">Please Select Transaction Type</option>
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
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              {/* Bank Name */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Bank Name:</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
                />
              </div>

              {/* Form Buttons */}
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

      {/* Transactions Table using DataTable */}
      {entries.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h6 className="text-right">Remaining Balance In Bank : {finalBalance.toFixed(2)}</h6>

          <DataTable
            columns={columns}
            data={filteredEntries}
            pagination
            striped
            highlightOnHover
            noDataComponent="No entries found"
          />
        </div>
      )}
    </div>
  );
};

export default Accounts;

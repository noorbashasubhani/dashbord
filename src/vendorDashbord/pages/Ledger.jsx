import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { jwtDecode } from 'jwt-decode';

const Ledger = () => {
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [banks, setBanks] = useState([]);
  const [outflow, setOutflow] = useState([]);
  const [inflow, setInflow] = useState([]);
  const [outflowExpenses, setOutflowExpenses] = useState([]);
  const [delId, setDelid] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleOpenModal = () => setShowAddModal(true);
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditId(null);
  };

  const transactionTypeOptions = ['Debit', 'Credit'];
  const transactionTowardsOptions = ['Packages', 'Flights', 'Hotel', 'Cruise', 'Cabs', 'Trains', 'Visa', 'Others', 'Reversal', 'Insurance'];
  const outflowTypeOptions = ['Operational Expencess', 'Office Expencess', 'Other Expencess', 'Investiments', 'Online Wallet', 'Taxes And Duties'];

  const [formData, setFormData] = useState({
    transaction_type: 'Debit',
    bank_transaction_date: '',
    transaction_towards: '',
    ghrn_no: '',
    out_flow_id: '',
    out_flow_type: '',
    out_flow_expencess: '',
    inflow_id: '',
    transaction_perticular: '',
    bank_id: '',
    amount: '',
    note: ''
  });

  const handleSave = async () => {
    try {
      const cleanFormData = { ...formData };

      if (!cleanFormData.out_flow_id) delete cleanFormData.out_flow_id;
      if (!cleanFormData.inflow_id) delete cleanFormData.inflow_id;
      cleanFormData.added_by = userId;

      const url = editId ? `${API_URL}/vendor/ledger/${editId}` : `${API_URL}/vendor/ledger`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanFormData)
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(editId ? 'Ledger entry updated successfully' : 'Ledger entry saved successfully');
        handleCloseModal();
        setFormData({
          transaction_type: 'Debit',
          bank_transaction_date: '',
          transaction_towards: '',
          ghrn_no: '',
          out_flow_id: '',
          out_flow_type: '',
          out_flow_expencess: '',
          inflow_id: '',
          transaction_perticular: '',
          bank_id: '',
          amount: '',
          note: ''
        });
        fetchLedgers();
      } else {
        toast.error(result.message || 'Failed to save entry');
      }
    } catch (error) {
      toast.error('Error saving entry');
    }
  };

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'out_flow_id') {
      try {
        let endpoint = '';
        switch (value) {
          case 'Operational Expencess':
            endpoint = '/vendor/Outflow';
            break;
          case 'Office Expencess':
            endpoint = '/vendor/Office-expences';
            break;
          case 'Other Expencess':
            endpoint = '/vendor/Other-expences';
            break;
          case 'Investiments':
            endpoint = '/vendor/Invest';
            break;
          case 'Online Wallet':
            setOutflowExpenses([]);
            return;
          case 'Taxes And Duties':
            endpoint = '/vendor/Taxe';
            break;
          default:
            setOutflowExpenses([]);
            return;
        }
        const res = await fetch(`${API_URL}${endpoint}`);
        const data = await res.json();
        setOutflowExpenses(data.data || []);
      } catch (err) {
        setOutflowExpenses([]);
        toast.error('Failed to fetch related expenses');
      }
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      transaction_type: item.transaction_type,
      bank_transaction_date: item.bank_transaction_date?.slice(0, 10) || '',
      transaction_towards: item.transaction_towards,
      ghrn_no: item.ghrn_no || '',
      out_flow_id: item.out_flow_id || '',
      out_flow_type: item.out_flow_type || '',
      out_flow_expencess: item.out_flow_expencess || '',
      inflow_id: item.inflow_id || '',
      transaction_perticular: item.transaction_perticular,
      bank_id: item.bank_id?._id || item.bank_id || '',
      amount: item.amount, // keep but disable in UI
      note: item.note || ''
    });
    setShowAddModal(true);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken);
      setUserId(decoded._id);
    }
    fetchLedgers();
    fetchBanks();
    fetchInflow();
  }, []);

  const fetchLedgers = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/ledger`, {
        method: 'GET'
      });
      const data = await res.json();
      setFilteredLedgers(data.data || []);
    } catch (err) {
      toast.error('Failed to fetch ledger entries');
    }
  };

  const fetchBanks = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/Bank-List`);
      const data = await res.json();
      setBanks(data.data || []);
    } catch (err) {
      toast.error('Failed to fetch Bank entries');
    }
  };

  const fetchInflow = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/Inflow`);
      const data = await res.json();
      setInflow(data.data || []);
    } catch (err) {
      toast.error('Failed to fetch Inflow entries');
    }
  };

  const delFun = (row_id) => {
    setDelid(row_id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/ledger/${delId}`, {
        method: 'DELETE'
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Deleted successfully");
        fetchLedgers();
        setShowDeleteModal(false);
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };


  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4>
            <i className="bi bi-pin-fill mx-2"></i>
            <b>Ledger Details</b>
          </h4>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
        <button className="btn btn-success mb-3" onClick={handleOpenModal}>
          + Add Transaction
        </button>
         {/* Ledger Table */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Bank</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Transaction Towards</th>
                <th>Particular</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedgers.map((item, index) => (
                <tr key={index}>
                  <td>{item.bank_transaction_date?.slice(0, 10)}</td>
                  <td>{item.transaction_type}</td>
                  <td>{item.bank_id?.bank_name || 'N/A'}</td>
                  <td>{item.amount}</td>
                  <td>{item.balance}</td>
                  <td>{item.transaction_towards}</td>
                  <td>{item.transaction_perticular}</td>
                  <td>{item.note}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={()=>delFun(item._id)}>Delete</button>
                  <button onClick={()=>handleEdit(item)} className="btn btn-sm btn-warning">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        {showAddModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Ledger Entry</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label>Transaction Type</label>
                      <select className="form-control" name="transaction_type" value={formData.transaction_type} onChange={handleFormChange} required>
                        {transactionTypeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6 mb-2">
                      <label>Bank Transaction Date</label>
                      <input type="date" name="bank_transaction_date" className="form-control" value={formData.bank_transaction_date} onChange={handleFormChange} required/>
                    </div>
                    <div className="col-md-6 mb-2">
                      <label>Transaction Towards</label>
                      <select className="form-control" name="transaction_towards" value={formData.transaction_towards} onChange={handleFormChange} required>
                        <option value="">Select</option>
                        {transactionTowardsOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                      </select>
                    </div>
                    {(formData.transaction_towards === 'Packages') && (
                      <div className="col-md-6 mb-2">
                        <label>GH/RN No</label>
                        <input type="text" className="form-control" name="ghrn_no" value={formData.ghrn_no} onChange={handleFormChange} />
                      </div>
                    )}
                    {(formData.transaction_type === 'Debit' && formData.transaction_towards === 'Others') && (
                      <>
                        <div className="col-md-6 mb-2">
                          <label>Outflow Type</label>
                          <select className="form-control" name="out_flow_id" value={formData.out_flow_id} onChange={handleFormChange}>
                            <option value="">Select</option>
                            {outflowTypeOptions.map((type, i) => (
                              <option key={i} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 mb-2">
                          <label>Outflow Expenses</label>
                          <select className="form-control" name="out_flow_expencess" value={formData.out_flow_expencess} onChange={handleFormChange}>
                            <option value="">Select</option>
                            {outflowExpenses.map((exp, i) => <option key={i} value={exp._id}>{exp.name}</option>)}
                          </select>
                        </div>
                      </>
                    )}
                    {(formData.transaction_type === 'Credit' && formData.transaction_towards === 'Others') && (
                      <div className="col-md-6 mb-2">
                        <label>Inflow ID</label>
                        <select className="form-control" name="inflow_id" value={formData.inflow_id} onChange={handleFormChange}>
                          <option value="">Select</option>
                          {inflow.map((opt, i) => <option key={i} value={opt._id}>{opt.name}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="col-md-6 mb-2">
                      <label>Transaction Particular</label>
                      <input type="text" name="transaction_perticular" className="form-control" 
                      value={formData.transaction_perticular} onChange={handleFormChange} />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label>Bank</label>
                      <select className="form-control" name="bank_id" value={formData.bank_id}
                       onChange={handleFormChange} required>
                        <option value="">Select Bank</option>
                        {banks.map((bank) => (
                          <option key={bank._id} value={bank._id}>{bank.bank_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-2">
                      <label>Amount</label>
                      <input type="number" name="amount" className="form-control" value={formData.amount}
                       onChange={handleFormChange} required/>
                    </div>
                    <div className="col-md-12 mb-2">
                      <label>Note</label>
                      <textarea name="note" className="form-control" value={formData.note} onChange={handleFormChange}></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSave}>Save</button>

                </div>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (
  <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Deletion</h5>
          <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
        </div>
        <div className="modal-body">
          Are you sure you want to delete this entry?
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
        </div>
      </div>
    </div>
  </div>
)}

      </main>
      <Footer />
    </>
  );
};

export default Ledger;
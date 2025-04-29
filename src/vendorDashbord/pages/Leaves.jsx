import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';

const Leaves = () => {
  const [showModal, setShowModal] = useState(false);

  const [leaveData, setLeaveData] = useState({
    from_date: '',
    to_date: '',
    no_of_days: '',
    leave_type: '',
    reason: '',
    to_manager: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData(prev => {
      const updated = { ...prev, [name]: value };
  
      // Auto-calculate number of days if from/to date are valid
      if (name === 'from_date' || name === 'to_date') {
        const from = new Date(updated.from_date);
        const to = new Date(updated.to_date);
        if (!isNaN(from) && !isNaN(to) && to >= from) {
          const diffTime = to - from;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
          updated.no_of_days = diffDays;
        } else {
          updated.no_of_days = '';
        }
      }
  
      return updated;
    });
  };


  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setLeaveData(prev => ({ ...prev, to_manager: selected }));
  };

  const [mang,setMang]=useState([]);
  const [ldetails,Setldetails]=useState([]);

  useEffect(()=>{
    const GetMangers=async()=>{
         const responce=await fetch(`${API_URL}/vendor/Userlist`);
         if(!responce.ok){
            throw new Error('This link not working');
         }
        const result=await responce.json();
        setMang(result);
    }

    const GetLeaves=async()=>{
        const responce=await fetch(`${API_URL}/vendor/Leaves`);
        if(!responce.ok){
           throw new Error('This link not working');
        }
       const result=await responce.json();
       Setldetails(result.data);
   }
    GetLeaves();
    GetMangers();
  },[]);


 // const managers = ['Manager A', 'Manager B', 'Manager C']; // Replace with real manager names or fetch from API

 const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        const token = localStorage.getItem('token'); // Fetch token from localStorage
  
      const response = await fetch(`${API_URL}/vendor/Leaves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authorization header
        },
        body: JSON.stringify(leaveData),
      });
  
      
      toast.success("Leave submitted successfully");
      setShowModal(false); // Close the modal
      setLeaveData({
        from_date: '',
        to_date: '',
        no_of_days: '',
        leave_type: '',
        reason: '',
        to_manager: []
      });
  
    } catch (err) {
      // Display the error in the console and show a toast
      console.error('Error:', err.message);
      ///toast.error(`Error: ${err.message}`);
    }
  };
  

  return (
    <Layout>
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Leave Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item"><a href="index.html">Leaves</a></li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
        </div>

        <ToastContainer />

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Add Leave</h6>
                  <p style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore our flyer list to check all the details and expiration dates.
                  </p>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                    + Add Leave
                  </button>
                </div>
                <table className="table datatable table-striped">
                      <thead style={{ fontSize: '13px' }}>
                        <tr>
                          <th>S.No</th>
                          <th>Employee ID</th>
                          <th>Employee Name</th>
                          <th>Leave Type</th>
                          <th>From-To Date</th>
                          <th>No of Days</th>
                          <th>Applied Dates</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {ldetails.map((itms,index)=>(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{itms.added_by?.first_name}</td>
                                <td>{itms.added_by?.first_name}</td>
                                <td>{itms.leave_type}</td>
                                <td>{itms.from_date} To {itms.to_date}</td>
                                <td>{itms.no_of_days}</td>
                                <td>{itms.createdAt}</td>
                                <td>{itms.status}</td>
                                <td><button className="btn btn-sm btn-primary">View</button></td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
              </div>
            </div>
          </div>
        </section>

        {showModal && (
  <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Leave</h5>
          <button type="button" className="close" onClick={() => setShowModal(false)}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-2">
              <label>From Date</label>
              <input type="date" name="from_date" className="form-control" value={leaveData.from_date} onChange={handleChange} required />
            </div>

            <div className="form-group mb-2">
              <label>To Date</label>
              <input type="date" name="to_date" className="form-control" value={leaveData.to_date} onChange={handleChange} required />
            </div>

            <div className="form-group mb-2">
              <label>No. of Days</label>
              <input type="number" name="no_of_days" className="form-control" value={leaveData.no_of_days} readOnly />
            </div>

            <div className="form-group mb-2">
              <label>Leave Type</label>
              <select name="leave_type" className="form-control" value={leaveData.leave_type} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="C">Casual</option>
                <option value="E">Extra</option>
              </select>
            </div>

            <div className="form-group mb-2">
              <label>Reason</label>
              <textarea name="reason" className="form-control" rows="3" value={leaveData.reason} onChange={handleChange} required />
            </div>

            <div className="form-group mb-3">
              <label>To Manager(s)</label>
              <select multiple name="to_manager" className="form-control" value={leaveData.to_manager} onChange={handleMultiSelect}>
                {mang.map((m, idx) => (
                  <option key={idx} value={m._id}>{m.first_name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Save Leave</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowModal(false)}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  </div>
)}

      </main>
    </Layout>
  );
};

export default Leaves;

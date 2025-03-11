import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { escalationMappings } from '../constains/mapping';


const Escalation = () => {

  const [esc, setEsc] = useState([]); // To store the list of escalations
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [emp, setEmp] = useState([]); // Initialize as an array

  const [escalations, setEscalations] = useState([]);
  const [selectedEscalation, setSelectedEscalation] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEscalation, setCurrentEscalation] = useState(null);
  const [managerNames, setManagerNames] = useState({}); 
  const [newEsc, setNewEsc] = useState({
    annonymus: false,
    manager_id: '',
    escalation_reg: '',
    concern_specific:'',
    regarding_any_empp: '',
    regarding_any_req: '',
    other_reason: '',
    elaborate: '',
  });

  const [ferror, setFerror] = useState({
    annonymus: '',
    manager_id: '',
    escalation_reg: '',
    concern_specific:'',
    regarding_any_empp: '',
    regarding_any_req: '',
    other_reason: '',
    elaborate: '',
  });


    const token = localStorage.getItem('token');
    const decodedToken=jwtDecode(token);
    const userId = decodedToken.userId; 
  // Fetch data from the "Employee" list
  const formValidation = () => {
    const ferror = {};
    let isValid = true;

    if (!newEsc.manager_id) {
      ferror.manager_id = 'Please Select Manager Name';
      isValid = false;
    }
    if (!newEsc.escalation_reg) {
      ferror.escalation_reg = 'Please Select Escalation Regarding';
      isValid = false;
    }
    if (!newEsc.elaborate) {
      ferror.elaborate = 'Please Enter Your Concern';
      isValid = false;
    }

    setFerror(ferror);
    return isValid;
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEsc((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      try {
        let response;
        const body = JSON.stringify(newEsc);

        if (selectedEscalation) {
          // Update existing escalation
          response = await fetch(`${API_URL}/vendor/complaints/${selectedEscalation._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          });
          if (!response.ok) throw new Error('Failed to update escalation');
          const data = await response.json();
          const datas = data.data;
          // Update the escalation list in UI
          setEsc(esc.map((item) => (item._id === datas._id ? datas : item)));
          toast.success('Escalation updated successfully');
        } else {
          // Add new escalation
          response = await fetch(`${API_URL}/vendor/complaints/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          });
          if (!response.ok) throw new Error('Failed to add escalation');
          const data = await response.json();
          setEsc((prev) => [...prev, data.data]);
          toast.success('Escalation added successfully');
        }

        setShowModal(false); // Close modal after successful submission
        setSelectedEscalation(null); // Reset selected escalation
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  useEffect(() => {
    const fetchEsch = async () => {
      try {
        const empRes = await fetch(`${API_URL}/vendor/complaints`);
        if (!empRes.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const empDataf = await empRes.json();
        setEsc(empDataf.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchEsch();
  }, []);

  useEffect(() => {
    const fetchEmpDetails = async () => {
      try {
        const empRes = await fetch(`${API_URL}/vendor/Employelist`);
        if (!empRes.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const empData = await empRes.json();
        setEmp(empData.data);
        const managerMapping = {};
        empData.data.forEach(employee => {
          if (employee._id && !managerMapping[employee._id]) {
            managerMapping[employee._id] = employee.first_name + " " + employee.last_name;
                }
        });
        setManagerNames(managerMapping); 
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchEmpDetails();
  }, []);

  // Delete functionality

  const handilDeletbtn = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
    
  };

  const handleReasonClick = (escL) => {
    setCurrentEscalation(escL);
    setIsModalOpen(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEscalation(null);
  };

  const handleStatusUpdate = async () => {
    try {
      // Construct the body with the updated values from currentEscalation
      const body = JSON.stringify({
        status: currentEscalation.status,
        reason_for_close: currentEscalation.reason_for_close,
      });
  
      // Make the API call to update the escalation
      const response = await fetch(`${API_URL}/vendor/complaints/${currentEscalation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
  
      // Check if the response is okay
      if (!response.ok) throw new Error('Failed to update escalation');
  
      // Parse the response data
      const data = await response.json();
      const updatedEscalation = data.data;
  
      // Update the escalation list in UI
      setEsc((prevEscalations) =>
        prevEscalations.map((item) => (item._id === updatedEscalation._id ? updatedEscalation : item))
      );
  
      // Show success message
      toast.success('Escalation updated successfully');
      
      // Close the modal and clear the current escalation
      setIsModalOpen(false);
      setCurrentEscalation(null);
    } catch (error) {
      // Handle any errors (e.g., API call failure)
      toast.error(`Error: ${error.message}`);
    }
  };
  

  const deleteEscalation = async () => {
    setLoadingDelete(true);
    try {
      const response = await fetch(`${API_URL}/vendor/complaints/${deleteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete escalation');
      }
      setEsc(esc.filter((item) => item._id !== deleteId));
      toast.success('Escalation deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete escalation!');
    } finally {
      setShowDeleteConfirm(false);
      setLoadingDelete(false);
    }
  };

   const handleInputChangeCheck=(e)=>{
    //alert(e.target.value);
    if(e.target.value=='E'){

    }
   }
  //console.log(esc);

  const handleEditClick = (escalation) => {
    setSelectedEscalation(escalation);  // Set the selected escalation data
    setNewEsc({
      annonymus: escalation.annonymus,
      manager_id: escalation.manager_id,
      concern_specific:escalation.concern_specific,
      escalation_reg: escalation.escalation_reg,
      regarding_any_empp: escalation.regarding_any_empp,
      regarding_any_req: escalation.regarding_any_req,
      other_reason: escalation.other_reason,
      elaborate: escalation.elaborate,
    });  // Pre-fill the form fields with selected escalation data
    setShowModal(true);  // Show the modal for editing
   
  };
  

  const handleSaveEscalation = async (escalation, isEditMode) => {
    try {
      if (isEditMode) {
        // Update the escalation on the backend
        const response = await fetch(`API_URL/${escalation._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(escalation),
        });
        if (response.ok) {
          // Update the list of escalations in the UI
          setEscalations((prev) =>
            prev.map((e) => (e._id === escalation._id ? escalation : e))
          );
        }
      } else {
        // Add a new escalation to the backend
        const response = await fetch('API_URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(escalation),
        });
        if (response.ok) {
          const newEscalation = await response.json();
          setEscalations((prev) => [...prev, newEscalation]);
        }
      }
      // Reset the selected escalation after save
      setSelectedEscalation(null);
    } catch (error) {
      console.log('Error saving escalation:', error);
    }
  };


  const [isModalOpenview, setIsModalOpenview] = useState(false);
  const [selectedEscalationview, setSelectedEscalationview] = useState(null);


  const handleViewClick = (escL) => {
   
    setSelectedEscalationview(escL);
    setIsModalOpenview(true);  // Open the modal
  };
  const closeModalview = () => {
    setIsModalOpenview(false);
    setSelectedEscalationview(null);  // Reset the selected escalation
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Escalation Details</b></h4>
          <nav className="d-flex align-items-center">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Escalation</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
            <button
              className="btn btn-sm btn-dark mb-3 ms-auto"
              onClick={() => setShowModal(true)}
            >
              + Add Escalation
            </button>
          </nav>
        </div>
        <ToastContainer />
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Cabs Details Table</h6>
                  <p className="" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  <div className="table-responsive">
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Anonymous</th>
          <th>Escalation  Sending To</th>
          
          <th>Concern  Specific</th>
          <th>Escalation   Regarding</th>
          <th>Received   Date</th>
          <th>Status</th>
          <th>Reason For Close</th>
          <th style={{width:"350px"}}>Actions</th>
          <th>Escalation  Created By</th>
        </tr>
      </thead>
      <tbody>
  {esc.map((escL,index) => {
    //const formattedDate = formatDate(escL.created_date);
    return (
      <tr key={escL._id}> {/* Use escL._id instead of empItem._id */}
        <td>{index+1}</td>
        <td>{escL.annonymus=='false' ? 'No' : 'Yes'}</td> {/* Assuming `annonymus` is a boolean */}
        <td>{managerNames[escL.manager_id]}</td> {/* Replace with actual field for the person who created the escalation */}
        
        <td>{escL.concern_specific}</td> {/* Example field */}
        <td>{escalationMappings[escL.escalation_reg]}</td> {/* Escalation type (e.g., "Employee", "Timing", etc.) */}
        <td>{escL.created_date}</td> {/* Assuming `received_date` exists */}
        <td>{escL.status}</td> {/* Assuming `status` exists */}
        <td>{escL.reason_for_close} {escL.status ==='Pending' ? (<button onClick={() => handleReasonClick(escL)} className="btn btn-sm btn-dark">Reason</button>):''}</td> 
        <td>
          {escL.status !='Pending' ? '':(
          <button className="btn btn-sm btn-warning" onClick={() => handleEditClick(escL)}>Edit</button>
        )}
        {escL.status !='Pending' ? '':(
          <button className="btn btn-sm btn-danger" onClick={()=>handilDeletbtn(escL._id)}>Delete</button>
        )}
         <button className="btn btn-sm btn-dark" onClick={() => handleViewClick(escL)}>View</button>  
          </td>
          <td>{managerNames[escL.added_by]}</td> 
      </tr>
    );
  })}
</tbody>

    </table>
  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal for Adding New Escalation */}
        {showModal && (
          <div className="modal show" style={{ display: 'block' }} onClick={() => setShowModal(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content container-fluid">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Escalation</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input type="checkbox" id="annonymus" name="annonymus"  className="form-check-input" checked={newEsc.annonymus}  onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="annonymus">
                        Check this if anonymous
                      </label>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="manager_id">Send To Manager</label>
                      <select id="manager_id" name="manager_id" value={newEsc.manager_id} onChange={handleInputChange} className="form-control"
                      >
                        <option value="">------Select Employee--------</option>
                        {emp.map((employee) => (
                          <option key={employee._id} value={employee._id}>
                            {employee.first_name} {employee.last_name}
                          </option>
                        ))}
                      </select>
                      {ferror.manager_id && <span className="text-danger">{ferror.manager_id}</span>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="escalation_reg">Escalation Regarding</label>
                      <select id="escalation_reg" name="escalation_reg"  value={newEsc.escalation_reg} onChange={handleInputChange} onInput={handleInputChangeCheck}  className="form-control"
                      >
                        <option value="">--- Select ---</option>
                        <option value="E">Employee</option>
                        <option value="I">Timing</option>
                        <option value="W">Work Culture</option>
                        <option value="T">Training</option>
                        <option value="O">Others</option>
                      </select>
                      {ferror.escalation_reg && <span className="text-danger">{ferror.escalation_reg}</span>}
                    </div>
                    {(newEsc.escalation_reg === 'E' && 
                    <div className="mb-3">
                      <label htmlFor="concern_specific">Concern Specific</label>
                      <select id="concern_specific" name="concern_specific"  value={newEsc.concern_specific} 
                      onChange={handleInputChange}  className="form-control"
                      >
                        <option value="">--- Select ---</option>
                        <option value="Delay in Itinerary">Delay in Itinerary</option>
                        <option value="Prices are High">Prices are High</option>
                        <option value="Itinerary Turnover Time">Itinerary Turnover Time</option>
                        <option value="Employee Behaviour">Employee Behaviour</option>
                        <option value="Delay in Recruitment">Delay in Recruitment</option>
                        <option value="Operational Support">Operational Support</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Delay in Promotions">Delay in Promotions</option>
                      </select>
                      {ferror.escalation_reg && <span className="text-danger">{ferror.escalation_reg}</span>}
                    </div>

                    )}
                    {/* Conditionally render the "Regarding Any Employee" input field */}
                    {newEsc.escalation_reg === 'E' && (
                    <div className="mb-3">
                      <label htmlFor="regarding_any_empp" className="form-label">Regarding Any Employee</label>
                      <input  type="text" id="regarding_any_empp" name="regarding_any_empp" value={newEsc.regarding_any_empp} onChange={handleInputChange} className="form-control"
                      />
                    </div>
                    )}

{(newEsc.escalation_reg === 'I' || newEsc.escalation_reg === 'T' || newEsc.escalation_reg === 'W') && (

                    <div className="mb-3">
                      <label htmlFor="regarding_any_req" className="form-label">Regarding Any Request</label>
                      <input type="text" id="regarding_any_req" name="regarding_any_req" value={newEsc.regarding_any_req} onChange={handleInputChange} className="form-control"  />
                    </div>

                      )}

                    <div className="mb-3">
                      <label htmlFor="other_reason" className="form-label">Any Other Reason</label>
                      <textarea  id="other_reason" name="other_reason" value={newEsc.other_reason}  onChange={handleInputChange} className="form-control"  ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="elaborate" className="form-label">Elaborate Your Concern</label>
                <textarea id="elaborate" name="elaborate" value={newEsc.elaborate} onChange={handleInputChange} className="form-control" ></textarea>
                      {ferror.elaborate && <span className="text-danger">{ferror.elaborate}</span>}
                    </div>

                    <button type="submit" className="btn btn-sm btn-dark">Save Now</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

         {/* Confirmation Modal for Deletion */}
         {showDeleteConfirm && (
          <div className="modal show" style={{ display: 'block' }} onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Escalation</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this escalation?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-sm btn-dark" onClick={deleteEscalation} disabled={loadingDelete}>
                    {loadingDelete ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        

{isModalOpen && currentEscalation && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Reason and Status</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <label>Reason For Close:</label>
                  <textarea
                    value={currentEscalation.reason_for_close || ''}
                    onChange={(e) => setCurrentEscalation({
                      ...currentEscalation,
                      reason_for_close: e.target.value,
                    })}
                    rows="4"
                    className="form-control"
                  />
                </div>
                <div>
                  <label>Status:</label>
                  <select
                    value={currentEscalation.status || 'Pending'}
                    onChange={(e) => setCurrentEscalation({
                      ...currentEscalation,
                      status: e.target.value,
                    })}
                    className="form-control"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Approved">Approved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStatusUpdate}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
{isModalOpen && selectedEscalation && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Escalation Details</h5>
             s
            </div>
           
           
          </div>
        </div>
      )}
      
{isModalOpenview && (
  <div className="modal show" tabIndex="-1" style={{ display: "block" }} aria-labelledby="modalLabel" aria-hidden="false">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="modalLabel">Escalation Details</h5>
          <button type="button" className="btn-close" onClick={closeModalview} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          {/* Display the selected escalation details */}
          {selectedEscalationview ? (
            <div>
              <p><strong>Escalation Type:</strong> {selectedEscalationview.annonymus}</p>
              <p><strong>Escalation From:</strong> {managerNames[selectedEscalationview.manager_id]}</p>
              <p><strong>Concern Specific:</strong> {selectedEscalationview.concern_specific}</p>
              <p><strong>Escalation Regarding:</strong> {escalationMappings[selectedEscalationview.escalation_reg]}</p>
              <p><strong>Escalation Regarding:</strong> {selectedEscalationview.regarding_any_empp}</p>
              
              <p><strong>Other Reasons:</strong> {selectedEscalationview.other_reason}</p>
              <p><strong>Escalation Regarding:</strong> {selectedEscalationview.other_reason}</p>

              <p><strong>Elaborate:</strong> {selectedEscalationview.elaborate}</p>
              <p><strong>Added By:</strong> {managerNames[selectedEscalationview.added_by]}</p>

              <p><strong>Received Date:</strong> {selectedEscalationview.created_date}</p>
              <p><strong>Status:</strong> {selectedEscalationview.status}</p>
              <p><strong>Reason For Close:</strong> {selectedEscalationview.reason_for_close}</p>
            </div>
          ) : (
            <p>No escalation data available.</p>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeModalview}>Close</button>
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

export default Escalation;

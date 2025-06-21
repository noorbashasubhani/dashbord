import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import Select from 'react-select';

import * as bootstrap from 'bootstrap';

const Team = () => {
  const [pack, setPack] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userid, setUserid] = useState(null);

  const [packdata, setPackdata] = useState({
    team_name: '',
    travel_type: '',
    dept_name: '',
    dept_head: '',
    dept_lead: '',
    team_employees: [],
    for_the_month: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackdata({
      ...packdata,
      [name]: value
    });
  };

  const handleAddPackage = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Teams/${userid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packdata),
      });

      const result = await response.json();
      if (response.ok) {
      await fetchTeams();
        setTimeout(() => {
  toast.success("Team added successfully!", {
    autoClose: 3000,
    toastId: 'team-added-toast'
  });
}, 300); // delay to avoid double-render conflicts
        const modalElement = document.getElementById('addPackageModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();

        setPackdata({
          team_name: '',
          travel_type: '',
          dept_name: '',
          dept_head: '',
          dept_lead: '',
          team_employees: [],
          for_the_month: ''
        });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      toast.error("Failed to add team: " + err.message);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Teams`);
      const data = await response.json();
      setPack(data.data);
    } catch (err) {
      toast.error("Error fetching teams: " + err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserid(decodedToken.userId);
    }

    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_URL}/vendor/Employelist`);
        const data = await res.json();
        setEmployees(data.data);
      } catch (error) {
        toast.error("Failed to load employees.");
      }
    };

    fetchTeams();
    fetchEmployees();
  }, []);

  const handleDeletePackage = async (packageId) => {
  if (window.confirm('Are you sure you want to delete this package?')) {
    try {
      const response = await fetch(`${API_URL}/vendor/Teams/${packageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (response.ok) {
        setPack(prev => prev.filter(pkg => pkg._id !== packageId));

        console.log("✅ Deletion success toast should show only once");

       

         setTimeout(() => {
  toast.success("Team deleted successfully!", {
    autoClose: 3000,
    toastId: 'team-added-toast'
  });
}, 300);
      } else {
        throw new Error(result.message || 'Failed to delete team');
      }
    } catch (err) {
      toast.error("Error deleting team: " + err.message, {
        toastId: 'team-delete-error'
      });
    }
  }
};


  const handleViewPackage = (packageId) => {
    const packageToView = pack.find(pkg => pkg._id === packageId);
    setSelectedPackage(packageToView);
    const viewModal = new bootstrap.Modal(document.getElementById('viewPackageModal'));
    viewModal.show();
  };

  const openAddModal = () => {
    const modal = new bootstrap.Modal(document.getElementById('addPackageModal'));
    modal.show();
  };

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Team Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item"><a href="index.html">Team</a></li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>

          <button className="btn btn-sm btn-dark mb-3 ms-auto" onClick={openAddModal}>
            + Add Team
          </button>
        </div>

        <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>



        {/* Add Team Modal */}
        <div className="modal fade" id="addPackageModal" tabIndex="-1" aria-labelledby="addPackageModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addPackageModalLabel">Add New Team</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-sm-6 mb-3">
                      <label className="form-label">Team Name</label>
                      <input type="text" className="form-control" name="team_name" value={packdata.team_name} onChange={handleInputChange} />
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label">Travel Type</label>
                      <select className="form-control" name="travel_type" value={packdata.travel_type} onChange={handleInputChange}>
                        <option value="">Select Travel Type</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                      </select>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label">Department</label>
                      <select className="form-select" name="dept_name" value={packdata.dept_name} onChange={handleInputChange}>
                        <option value="">Select Department</option>
                        <option value="Sales">Sales</option>
                        <option value="Operation">Operation</option>
                        <option value="Reservation">Reservation</option>
                      </select>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label">Department Head</label>
                      <select className="form-select" name="dept_head" value={packdata.dept_head} onChange={handleInputChange}>
                        <option value="">-- Select Head --</option>
                        {employees.map(emp => (
                          <option key={emp._id} value={emp._id}>{emp.first_name} {emp.last_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label">Department Lead</label>
                      <select className="form-select" name="dept_lead" value={packdata.dept_lead} onChange={handleInputChange}>
                        <option value="">-- Select Lead --</option>
                        {employees.map(emp => (
                          <option key={emp._id} value={emp._id}>{emp.first_name} {emp.last_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label">For The Month</label>
                      <input type="date" className="form-control" name="for_the_month" value={packdata.for_the_month} onChange={handleInputChange} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Team Employees</label>
                      <Select
                        isMulti
                        name="team_employees"
                        options={employees.map(emp => ({
                          value: emp._id,
                          label: `${emp.first_name} ${emp.last_name}`
                        }))}
                        value={packdata.team_employees.map(id => {
                          const emp = employees.find(e => e._id === id);
                          return emp ? { value: emp._id, label: `${emp.first_name} ${emp.last_name}` } : null;
                        }).filter(Boolean)}
                        onChange={selectedOptions =>
                          setPackdata({
                            ...packdata,
                            team_employees: selectedOptions.map(option => option.value)
                          })
                        }
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={handleAddPackage}>Add Team</button>
              </div>
            </div>
          </div>
        </div>

        {/* View Modal */}
        <div className="modal fade" id="viewPackageModal" tabIndex="-1" aria-labelledby="viewPackageModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="viewPackageModalLabel">Team Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {selectedPackage ? (
                  <div>
                    <p><strong>Team Name:</strong> {selectedPackage.team_name}</p>
                    <p><strong>Travel Type:</strong> {selectedPackage.travel_type}</p>
                    <p><strong>Department Name:</strong> {selectedPackage.dept_name}</p>
                    <p><strong>Department Head:</strong> {selectedPackage.dept_head?.first_name} {selectedPackage.dept_head?.last_name}</p>
                    <p><strong>Department Lead:</strong> {selectedPackage.dept_lead?.first_name} {selectedPackage.dept_lead?.last_name}</p>
                    <p><strong>Team Members:</strong> {selectedPackage.team_employees?.map(emp => `${emp.first_name} ${emp.last_name}`).join(', ')}</p>
                    <p><strong>Added By:</strong> {selectedPackage.added_by?.first_name || "Unknown"}</p>
                    <p><strong>Created Date:</strong> {new Date(selectedPackage.createdAt).toLocaleDateString()}</p>
                  </div>
                ) : <p>Loading...</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Team Details</h6>
                  <p style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore your team list and member assignments.
                  </p>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Team Name</th>
                          <th>Team Type</th>
                          <th>Department</th>
                          <th>Head</th>
                          <th>Lead</th>
                          <th>Employees</th>
                          <th>Added By</th>
                          <th>Team-Month</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pack.length > 0 ? pack.map((team, index) => (
                          <tr key={team._id}>
                            <td>{index + 1}</td>
                            <td>{team.team_name}</td>
                            <td>{team.travel_type}</td>
                            <td>{team.dept_name}</td>
                            <td>{team.dept_head?.first_name}</td>
                            <td>{team.dept_lead?.first_name}</td>
                            <td>{team.team_employees?.map(emp => emp.first_name).join(', ')}</td>
                            <td>{team.added_by?.first_name || 'N/A'}</td>
                            <td>{team.for_the_month}</td>
                            <td>{team.status}</td>
                            <td>{new Date(team.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDeletePackage(team._id)}>Delete</button>
                              <button className="btn btn-sm btn-info ms-2" onClick={() => handleViewPackage(team._id)}>View</button>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan="12" className="text-center">No teams found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Team;

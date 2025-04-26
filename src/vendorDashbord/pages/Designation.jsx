import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Designation = () => {
  const [departments, setDepartments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newDesignation, setNewDesignation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [depar,setDepar]=useState([]);
  // Fetching designations
  const fetchDesignations = async () => {
   //setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vendor/Desg`);
      if (!response.ok) throw new Error('Failed to fetch designations');
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeparts=async()=>{
    try{
      const response = await fetch(`${API_URL}/vendor/Dept`);
      if (!response.ok) throw new Error('Failed to fetch designations');
      const data = await response.json();
      setDepar(data);
    }catch(err){
       console.log(err.message);
    }
  }

  useEffect(() => {
    fetchDesignations();
    fetchDeparts();
  }, []);

  // Group designations by department
  const groupedDepartments = {};
  if (departments.designations && Array.isArray(departments.designations)) {
    departments.designations.forEach((item) => {
      if (!item.name || !item.department?.name || !item.department?._id) return;
      const deptId = item.department._id;
      const deptName = item.department.name;

      if (!groupedDepartments[deptId]) {
      groupedDepartments[deptId] = {
        id: deptId,
        name: deptName,
        designations: []
      };
    }
    groupedDepartments[deptId].designations.push(item.name);

    });
  }

  // Get unique departments for dropdown
  const uniqueDepartments = Array.from(groupedDepartments, ([id, name]) => ({ id, name }));


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/vendor/Add-Designations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: selectedDepartment,
          name: newDesignation
        })
      });

      if (!res.ok) throw new Error('Failed to add designation');

      // Refresh list after add
      await fetchDesignations();
      setShowModal(false);
      setNewDesignation('');
      setSelectedDepartment('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Departments & Designation Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="#">Departments</a>
              </li>
              <li className="breadcrumb-item active">Designation</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
              + Add Designation
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Departments & Designation Details</h6>
                  <p style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>

                  {loading && <p>Loading...</p>}
                  {error && <p className="text-danger">{error}</p>}

                  <table className="table datatable table-stripped">
                    <thead style={{ fontSize: "13px" }}>
                      <tr>
                        <th>S.No</th>
                        <th>Department</th>
                        <th>Designations</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "13px" }}>
  {Object.values(groupedDepartments).map((dept, index) => (
    <tr key={dept.id}>
      <td>{index + 1}</td>
      <td>{dept.name}</td>
      <td>{dept.designations.join(', ')}</td>
    </tr>
  ))}
</tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Add Designation Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Designation</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Department</label>
                    <select
                      className="form-select"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      required
                    >
                      <option value="">Select Department</option>
                      {depar.map((dept, index) => (
                        <option key={index} value={dept._id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Designation Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newDesignation}
                      onChange={(e) => setNewDesignation(e.target.value)}
                      placeholder="Enter Designation Name"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Add Designation</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Designation;

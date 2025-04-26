import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const Position = () => {
  const [pack, setPack] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null); // State to hold the selected package data
  const [departments, setDepartments] = useState([]);
  const [desgdetail, setDesgdetail] = useState([]);





  const [packdata, setPackdata] = useState({
    department_name: '',
    role: '',
    designation_name: '',
    candidate_type: '',
    no_of_candidates: '',
    job_desc: '',
    role_and_responces: '',
    skillss: '',
    experience: '',
    relevant_exp: '',
    employee_type: '',
    education: '',
    job_location: '',
    language: '',
    salaryrange_from: '',
    salaryrange_to: '',
    gender: '',
    application_dead_line: ''
  });
  
  const [editingPackage, setEditingPackage] = useState(null);  // State for editing a package
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackdata({
      ...packdata,
      [name]: value
    });
  };
  const handleEditPackage = async () => {
    const { package_code, package_name, duration, city, destination, cost } = packdata;

    // Check if all fields are filled
    if (!package_code || !package_name || !duration || !city || !destination || !cost) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      // Send the PUT request to update the package
      const response = await fetch(`${API_URL}/vendor/Positions/${editingPackage._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_code,
          package_name,
          duration,
          city,
          destination,
          cost,
          added_by: userId, // Pass the userId or other user-related data if needed
        })
      });

      const responseText = await response.text();
      const result = JSON.parse(responseText);

      if (response.ok) {
        // Update the package list with the edited package
        const updatedPackages = pack.map(pkg => 
          pkg._id === editingPackage._id ? { ...pkg, ...result.data } : pkg
        );
        setPack(updatedPackages);
        
        const modal = new window.bootstrap.Modal(document.getElementById('editPackageModal'));
        modal.hide();
        
        toast.success("Package updated successfully!");
        setPackdata({ package_code: '', package_name: '', duration: '', city: '', destination: '', cost: '' }); // Reset the form
      } else {
        throw new Error(result.message || 'Failed to update package');
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating package: " + err.message);
    }
  };


  useEffect(() => {
  const GetFun = async () => {
    try {
      // Fetch Positions
      const positionRes = await fetch(`${API_URL}/vendor/Positions`, {
        method: 'GET'
      });
      if (!positionRes.ok) {
        throw new Error('Failed to fetch positions');
      }
      const positionData = await positionRes.json();
      setPack(positionData.data);
     


      const deptRes = await fetch(`${API_URL}/vendor/Dept`, {
        method: 'GET'
      });
      if (!deptRes.ok) {
        throw new Error('Failed to fetch departments avove links');
      }
      const deptData = await deptRes.json();
      setDepartments(deptData); // you'll define departments in state below
     

      const desgRes = await fetch(`${API_URL}/vendor/Desg`, {
        method: 'GET'
      });
      if (!desgRes.ok) {
        throw new Error('Failed to fetch departments avove links');
      }
      const desgData = await desgRes.json();
      setDesgdetail(desgData.designations); // you'll define departments in state below
       //console.log(desgData.designations);

    } catch (err) {
      console.error(err.message);
      toast.error("Error: " + err.message);
    }
  };

  GetFun();
}, []);


  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`${API_URL}/vendor/PositionsDelete/${packageId}`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseText = await response.text();
        const result = JSON.parse(responseText);

        if (response.ok) {
          // Remove the deleted package from the state
          
          toast.success("Package deleted successfully!");
        } else {
          throw new Error(result.message || 'Failed to delete package');
        }
      } catch (err) {
        console.error(err);
        toast.error("Error deleting package: " + err.message);
      }
    }
  };
  const handleAddPackage = async () => {
    try {
      // Send the request to add the package
      const response = await fetch(`${API_URL}/vendor/Positions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(packdata)
      });
  
      const responseText = await response.text(); // Get raw response as text
      const result = JSON.parse(responseText); // Manually parse JSON
  
      if (response.ok) {
        setPack([...pack, result.data]); // Update the package list with the new package
        const modal = new window.bootstrap.Modal(document.getElementById('addPackageModal'));
        modal.hide();
        
        toast.success("Package added successfully!");
        setPackdata({ package_code: '', package_name: '', duration: '', city: '', destination: '', cost: '' }); // Reset the form
        GetFun();  // Fetch the updated packages list
      } else {
        throw new Error(result.message || 'Failed to add package');
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding package: " + err.message);
    }
  };

  const handleClosePosition = async (rowId) => {
    if (window.confirm('Are you sure you want to close this position?')) {
      try {
        const response = await fetch(`${API_URL}/vendor/PositionsClose/${rowId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const result = await response.json();
  
        if (response.ok) {
          toast.success('Position closed successfully!');
          setPack(pack.filter(pkg => pkg._id !== rowId));
          // Optionally update state here (e.g. refresh positions)
        } else {
          toast.error(result.message || 'Failed to close position');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while closing the position.');
      }
    }
  };
  

  return (
    <>
       <NavBar />
       <SideBar />
       <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Position  Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Position</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
          
          <button className="btn btn-sm btn-dark mb-3 ms-auto" data-bs-toggle="modal" data-bs-target="#addPackageModal">
            + Add Position
          </button>
        </div>
        
        <ToastContainer />
        
        

       

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Packages Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }} >
                    Explore our flyer list to check all the details and expiration dates.
                  </p>

                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Dept Name</th>
                          <th>Role  Name</th>
                          <th>Designation</th>
                          <th>No Of Candidates </th>
                          <th>Candidate Type</th>
                          <th>Salary Range</th>
                          <th>Dead Line</th>
                          <th>Created Date</th>
                         
                          <th>Added By</th>
                          
                          <th style={{ width: "420px" }}>Actions</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
  {Array.isArray(pack) && pack.length > 0 ? (
    pack.map((item, index) => (
      <tr key={item._id}>
        <td>{index + 1}</td>
        <td>{item.department_name?.name || 'N/A'}</td>
        <td>{item.role}</td>
        <td>{item.designation_name?.name || 'N/A'}</td>
        <td>{item.no_of_candidates}</td>
        <td>{item.candidate_type}</td>
        <td>{item.salaryrange_from} - {item.salaryrange_to}</td>
        <td>{item.application_dead_line?.slice(0, 10)}</td>
        <td>{item.createdAt?.slice(0, 10)}</td>
        <td>{item.created_by?.first_name || 'N/A'}</td>
        <td>
          <button className="btn btn-sm btn-success"   onClick={() => handleClosePosition(item._id)}
          >Close</button>
          <button
  className="btn btn-sm btn-danger ms-2"
  onClick={() => handleDeletePackage(item._id)}
>
  Delete
</button>
          
        </td>
        <td>{item.status}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="12" className="text-center">No packages found</td>
    </tr>
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
      <div className="modal fade" id="viewPackageModal" tabIndex="-1" aria-labelledby="viewPackageModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="viewPackageModalLabel">Package Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {selectedPackage ? (
                  <div>
                    <p><strong>Department Name:</strong> {selectedPackage.department_name}</p>
                    <p><strong>Roll Name:</strong> {selectedPackage.role}</p>
                    <p><strong>Designation Name:</strong> {selectedPackage.designation_name}</p>
                    <p><strong>Candidate Type:</strong> {selectedPackage.candidate_type}</p>
                    <p><strong>No of Candidates:</strong> {selectedPackage.no_of_candidates}</p>
                    <p><strong>Job Description:</strong> ${selectedPackage.job_desc}</p>
                    <p><strong>Roll & Responsibility:</strong> {selectedPackage.role_and_responces}</p>


                    <p><strong>Experience:</strong> {selectedPackage.experience}</p>
                    <p><strong>Relavent Experience:</strong> {selectedPackage.relevant_exp}</p>
                    <p><strong>Employee Type:</strong> {selectedPackage.employee_type}</p>
                    <p><strong>Education:</strong> {selectedPackage.education}</p>
                    <p><strong>job Location:</strong> {selectedPackage.job_location}</p>
                    <p><strong>Salary Range :</strong> {selectedPackage.salaryrange_from} -  {selectedPackage.salaryrange_to}</p>

                    <p><strong>Gender Preffered  :</strong> {selectedPackage.gender}</p>
                    <p><strong>Application Dead Line  :</strong> {selectedPackage.application_dead_line}</p>
                    <p><strong>Created By  :</strong> {selectedPackage.created_by}</p>
                    <p><strong>Created Date  :</strong> {selectedPackage.created_date}</p>

                    
                    
                    
                    
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="addPackageModal" tabIndex="-1" aria-labelledby="addPackageModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addPackageModalLabel">Add New Job Position</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
<form>
<div className="mb-3">
<label htmlFor="package_code" className="form-label">Department </label>
<select
className="form-select"
name="department_name"
value={packdata.department_name}
onChange={handleInputChange}
>
<option value="">Select</option>
{departments.map((dept) => (
<option key={dept._id} value={dept._id}>
{dept.name}
</option>
))}
</select>

</div>
<div>
<label>Select Roll</label>
<select className="form-select" name="role" onChange={handleInputChange}>
<option value="">Select Roll</option>

<option  value="Executive">Executive </option>
<option  value="JuniorExecutive">Junior Executive </option>
<option  value="SeniorExecutive">Senior Executive </option>
<option  value="Manager">Manager </option>
<option  value="SeniorManager">Senior Manager </option>
<option  value="AssistManager">Assist Manager </option>

</select>
</div>
<div className="mb-3">
<label htmlFor="package_code" className="form-label" >Designations </label>
<select className="form-select" name="designation_name" onChange={handleInputChange}>
<option value="">Select</option>
{

desgdetail.map((desg) => (
<option key={desg._id} value={desg._id}>
{desg.name}
</option>
))}
</select>
</div>

<div>
<label>Candidate Type</label>
<select className="form-select" name="candidate_type" onChange={handleInputChange}>
<option value="">Select</option>
<option  value="Fresh">Fresh </option>
<option  value="Experienced">Experienced </option>
</select>
</div>

<div className="mb-3">
<label htmlFor="package_name" className="form-label">No of Candidates</label>
<input type="text" className="form-control" id="no_of_candidated" 
name="no_of_candidates" value={packdata.no_of_candidates} onChange={handleInputChange} />
</div>
<div className="mb-3">
<label htmlFor="job_desc" className="form-label">Job Description</label>
<textarea
className="form-control"
id="job_desc"
name="job_desc"
rows="4"
value={packdata.job_desc}
onChange={handleInputChange}
/>
</div>
<div className="mb-3">
<label htmlFor="job_desc" className="form-label">Roll && Responsibility</label>
<textarea
className="form-control"
id="role_and_responces"
name="role_and_responces"
rows="4"
value={packdata.role_and_responces}
onChange={handleInputChange}
/>
</div>

<div className="mb-3">
<label htmlFor="job_desc" className="form-label">Skills</label>
<textarea
className="form-control"
id="skills"
name="skills"
rows="4"
value={packdata.skills}
onChange={handleInputChange}
/>
</div>


<div className="mb-3">
<label htmlFor="city" className="form-label">Experience in Years</label>
<input type="numbers" className="form-control" id="experience" name="experience" value={packdata.city} onChange={handleInputChange} />
</div>
<div className="mb-3">
  <label htmlFor="relevant_exp" className="form-label">Relevant Experience</label>
  <select
    className="form-select"
    id="relevant_exp"
    name="relevant_exp"
    value={packdata.relevant_exp}
    onChange={handleInputChange}
    required
  >
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div>
<label>Employee Type</label>
<select className="form-select" name="employee_type" onChange={handleInputChange}>
<option value="">Select</option>
<option  value="Interm">Interm </option>
<option  value="Part Time">Part Time </option>
<option  value="Full Time">Full Time </option>
<option  value="Work From Home">Work From Home </option>
</select>
</div>
<div className="mb-3">
<label htmlFor="destination" className="form-label" >Education Type</label>
<select className="form-select" name="education" onChange={handleInputChange}>
<option value="">Select</option>
<option  value="Any">Any </option>
<option  value="Relavent Education">Relavent Education </option>
<option  value="SCC">SCC </option>
<option  value="Inter">Inter </option>
<option  value="Inter">Graduate </option>
<option  value="Inter">Post Graduate </option>
<option  value="Inter">BBA </option>
<option  value="Inter">Diploma </option>
<option  value="Inter">MCA </option>
</select>
</div>
<div className="mb-3">
<label htmlFor="cost" className="form-label">Job Location</label>

<input type="text" className="form-control" id="job_location"  name="job_location" value={packdata.job_location} onChange={handleInputChange} />

</div>
<div className="mb-3">
<label htmlFor="job_desc" className="form-label">Language</label>
<textarea
className="form-control" id="language" name="language" rows="4" value={packdata.language} onChange={handleInputChange}
/>
</div>

<div className="mb-3">
<label htmlFor="city" className="form-label">Salary From</label>
<input type="numbers" className="form-control" id="salaryrange_from" 
onChange={handleInputChange} name="salaryrange_from" value={packdata.salaryrange_from} />
</div>


<div className="mb-3">
<label htmlFor="city" className="form-label">Salary To</label>
<input type="numbers" className="form-control" id="salaryrange_to" 
onChange={handleInputChange} name="salaryrange_to" value={packdata.salaryrange_to}  />
</div>


<div>
<label>Gender Type</label>
<select className="form-select" name="gender" onChange={handleInputChange}  >
<option value="">Select</option>
<option  value="Male">Male </option>
<option  value="Female">Female </option>
<option  value="Any">Any</option>

</select>
</div>


<div className="mb-3">
<label htmlFor="city" className="form-label" >Dead Line</label>
<input type="date" className="form-control" onChange={handleInputChange}
id="application_dead_line" name="application_dead_line"
value={packdata.application_dead_line}  />
</div>
<div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={handleAddPackage}>Add Package</button>
              </div>
</form>
              </div>
              
            </div>
          </div>
        </div>
    </>
  )
}

export default Position
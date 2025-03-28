import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const Lead = () => {
  const [pack, setPack] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packdata, setPackdata] = useState({
    package_code: '',
    package_name: '',
    duration: '',
    city: '',
    destination: '',
    cost: ''
  });

  const [editingPackage, setEditingPackage] = useState(null);
  const [activeTab, setActiveTab] = useState("active"); // Track active tab
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  // Fetch packages when component mounts
  useEffect(() => {
    const GetFun = async () => {
      try {
        const arryQuery = await fetch(`${API_URL}/vendor/Positions`, {
          method: 'GET'
        });

        if (!arryQuery.ok) {
          throw new Error('Data not received');
        }

        const arrayData = await arryQuery.json();
        setPack(arrayData.data);
      } catch (err) {
        console.log(err.message);
        toast.error("Error fetching packages: " + err.message);
      }
    };

    GetFun();
  }, []);

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Lead Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Lead</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
          <button className="btn btn-sm btn-dark mb-3 ms-auto" data-bs-toggle="modal" data-bs-target="#addPackageModal">
            + Lead Position
          </button>
        </div>

        <ToastContainer />

        {/* Tabs */}
        <div className="d-flex justify-content-between mb-3">
          <button
            className={`btn btn-sm ${activeTab === "active" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("active")}
          >
            Active Leads
          </button>
          <button
            className={`btn btn-sm ${activeTab === "deleted" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("deleted")}
          >
            Deleted Leads
          </button>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Packages Details</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Dept Name</th>
                          <th>Role Name</th>
                          <th>Designation</th>
                          <th>No Of Candidates</th>
                          <th>Candidate Type</th>
                          <th>Salary Range</th>
                          <th>Dead Line</th>
                          <th>Created Date</th>
                          <th>Added By</th>
                          <th>Actions</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(pack) && pack.length > 0 ? (
                          pack
                            .filter((items) => (activeTab === "active" ? items.status !== "Deleted" : items.status === "Deleted"))
                            .map((items, index) => (
                              <tr key={items._id}>
                                <td>{index + 1}</td>
                                <td>{items.department_name}</td>
                                <td>{items.role}</td>
                                <td>{items.designation_name}</td>
                                <td>{items.no_of_candidates}</td>
                                <td>{items.candidate_type}</td>
                                <td>{items.salaryrange_from}-{items.salaryrange_to}</td>
                                <td>{items.application_dead_line}</td>
                                <td>{items.created_date}</td>
                                <td>{items.created_by}</td>
                                <td>
                                  {activeTab === "active" && (
                                    <>
                                      <button className="btn btn-sm btn-primary" onClick={() => handleOpenEditModal(items)}>
                                        Edit
                                      </button>
                                      <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDeletePackage(items._id)}>
                                        Delete
                                      </button>
                                      <button className="btn btn-sm btn-warning ms-2" onClick={() => handleClosePackage(items._id)}>
                                        Close
                                      </button>
                                    </>
                                  )}
                                  {activeTab === "deleted" && (
                                    <button className="btn btn-sm btn-success" onClick={() => handleRestorePackage(items._id)}>
                                      Restore
                                    </button>
                                  )}
                                  <button className="btn btn-sm btn-primary ms-2" onClick={() => handleViewPackage(items._id)} data-bs-toggle="modal" data-bs-target="#viewPackageModal">
                                    View
                                  </button>
                                </td>
                                <td>{items.status}</td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">No packages found</td>
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

      <Footer />
    </>
  );
};

export default Lead;

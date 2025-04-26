import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2';





const AdvanceSalary = () => {
  const [pack, setPack] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null); // State to hold the selected package data

  const [packdata, setPackdata] = useState({
    amount: '',
    managers_names: ''
  });
  
  const [editingPackage, setEditingPackage] = useState(null);  // State for editing a package
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackdata({
      ...packdata,
      [name]: value
    });
  };

 


  const handleAddPackage = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Advancesalary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...packdata
        })
      });
  
      const responseText = await response.text();
      const result = JSON.parse(responseText);
  
      if (response.ok) {
        setPack([...pack, result.data]);
  
        const modal = new window.bootstrap.Modal(document.getElementById('addPackageModal'));
        modal.hide();
  
        toast.success("Advance Salary added successfully!");
        setPackdata({ amount: '', managers_names: '' }); // Reset form
      } else {
        throw new Error(result.message || 'Failed to add advance salary');
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding salary: " + err.message);
    }
  };
  

  // Handle Edit Package
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

  // Fetch packages when component mounts
  useEffect(() => {
    const GetFun = async () => {
      try {
        const arryQuery = await fetch(`${API_URL}/vendor/Advancesalary`, {
          method: 'GET'
        });

        if (!arryQuery.ok) {
          throw new Error('Data not received');
        }

        const arrayData = await arryQuery.json();
        setPack(arrayData.data);
        //toast.success("Packages loaded successfully!");
      } catch (err) {
        console.log(err.message);
        toast.error("Error fetching packages: " + err.message);
      }
    };

    GetFun();
  }, []); // Runs once when the component mounts

  // Function to open the edit modal and populate data
  const handleOpenEditModal = (packageDetails) => {
    setEditingPackage(packageDetails);  // Set the package to be edited
    setPackdata({
      package_code: packageDetails.package_code,
      package_name: packageDetails.package_name,
      duration: packageDetails.duration,
      city: packageDetails.city,
      destination: packageDetails.destination,
      cost: packageDetails.cost,
    });
    const modal = new window.bootstrap.Modal(document.getElementById('editPackageModal'));
    modal.show();  // Show the edit modal
  };


  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`${API_URL}/vendor/PositionsDelete/${packageId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseText = await response.text();
        const result = JSON.parse(responseText);

        if (response.ok) {
          // Remove the deleted package from the state
          setPack(pack.filter(pkg => pkg._id !== packageId));
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
  const handleClosePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to Close this package?')) {
      try {
        const response = await fetch(`${API_URL}/vendor/PositionsClose/${packageId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseText = await response.text();
        const result = JSON.parse(responseText);

        if (response.ok) {
          // Remove the deleted package from the state
          setPack(pack.filter(pkg => pkg._id !== packageId));
          toast.success("Package Closed successfully!");
        } else {
          throw new Error(result.message || 'Failed to delete package');
        }
      } catch (err) {
        console.error(err);
        toast.error("Error deleting package: " + err.message);
      }
    }
  };
  const handleViewPackage = (packageId) => {
    const packageToView = pack.find(pkg => pkg._id === packageId);
    setSelectedPackage(packageToView); // Set selected package to the state
  };

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Advance Salary  Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Advance Salary</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
          
          <button className="btn btn-sm btn-dark mb-3 ms-auto" data-bs-toggle="modal" data-bs-target="#addPackageModal">
            + Add Advance Salary
          </button>
        </div>
        
        <ToastContainer />
        
        {/* Add Package Modal */}
        <div className="modal fade" id="addPackageModal" tabIndex="-1" aria-labelledby="addPackageModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addPackageModalLabel">Add Advance Salary</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="package_code" className="form-label">Amount</label>
                    <input type="text" className="form-control" id="amount" name="amount" value={packdata.amount} onChange={handleInputChange} />
                  </div>
                  
                  
                  <div className="mb-3">
                    <label htmlFor="package_name" className="form-label">Manager List</label>
                    <input type="text" className="form-control" id="managers_names" name="managers_names" value={packdata.managers_names} onChange={handleInputChange} />
                  </div>
                 
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={handleAddPackage}>Add </button>
              </div>
            </div>
          </div>
        </div>

     

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Advance Salary Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }} >
                    Explore our flyer list to check all the details and expiration dates.
                  </p>

                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Amount Name</th>
                          <th>Requested Person</th>
                          <th>Requested Send TO</th>
                          
                          <th>Created Date</th>
                          <th style={{ width: "200px" }}>Actions</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(pack) && pack.length > 0 ? (
                          pack.map((items, index) => (
                            <tr key={items._id}>
                              <td>{index + 1}</td>
                              <td>{items.amount}</td>
                              <td><td>{items.added_by ? items.added_by.first_name : 'N/A'}</td>
                              </td>
                              <td>
  {items.managers_names && items.managers_names.length > 0
    ? items.managers_names.map((manager, idx) => (
        <span key={manager._id}>
          {manager.first_name}{idx !== items.managers_names.length - 1 ? ', ' : ''}
        </span>
      ))
    : 'N/A'}
</td>
                              <td>{items.createdAt}</td>
                              
                              <td>
                                <button className="btn btn-sm btn-primary" onClick={() => handleOpenEditModal(items)}>
                                  Approve
                                </button>
                                <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDeletePackage(items._id)}>
                                  Reject
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
 {/* View Package Modal */}

      <Footer />
    </>
  );
};

export default AdvanceSalary;

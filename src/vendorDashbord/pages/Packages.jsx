import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const Packages = () => {
  const [pack, setPack] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null); // State to hold the selected package data

  const [packdata, setPackdata] = useState({
    package_code: '',
    package_name: '',
    duration: '',
    city: '',
    destination: '',
    cost: ''
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

  // Handle Add Package
  const handleAddPackage = async () => {
    const { package_code, package_name, duration, city, destination, cost } = packdata;
  
    // Check if all fields are filled
    if (!package_code || !package_name || !duration || !city || !destination || !cost) {
      toast.error("Please fill all fields.");
      return;
    }
  
    try {
      // Send the request to add the package
      const response = await fetch(`${API_URL}/vendor/Package/${userId}`, {
        method: 'POST',
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
      const response = await fetch(`${API_URL}/vendor/Package/${editingPackage._id}`, {
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
        const arryQuery = await fetch(`${API_URL}/vendor/Package`, {
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
        const response = await fetch(`${API_URL}/vendor/Package/${packageId}`, {
          method: 'DELETE',
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
  const handleViewPackage = (packageId) => {
    const packageToView = pack.find(pkg => pkg._id === packageId);
    setSelectedPackage(packageToView); // Set selected package to the state
  };

  const [sqlQuery,setSqlQuery]=useState();

  const queryData = pack.filter((itms) => {
    const packageCode = itms.package_code || ''; 
    const packageName = itms.package_name || ''; // Default to empty string if package_code is undefined
    const query = sqlQuery || '';  // Default to empty string if sqlQuery is undefined
    return packageCode.toLowerCase().includes(query.toLowerCase()) || 
           packageName.toLowerCase().includes(query.toLowerCase());
  });
  
  
  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Packages Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Packages</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
          <div className="mr-5">
            <input type="text" className="form-control" name="Search" placeholder="Search..." 
            value={sqlQuery}  onChange={(e)=>{setSqlQuery(e.target.value)}}/>
            </div>
          <button className="btn btn-sm btn-dark mb-3 ms-auto" data-bs-toggle="modal" data-bs-target="#addPackageModal">
            + Add Packages
          </button>
        </div>
        
        <ToastContainer />
        
        {/* Add Package Modal */}
        <div className="modal fade" id="addPackageModal" tabIndex="-1" aria-labelledby="addPackageModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addPackageModalLabel">Add New Package</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="package_code" className="form-label">Package Code</label>
                    <input type="text" className="form-control" id="package_code" name="package_code" value={packdata.package_code} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="package_name" className="form-label">Package Name</label>
                    <input type="text" className="form-control" id="package_name" name="package_name" value={packdata.package_name} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration</label>
                    <input type="text" className="form-control" id="duration" name="duration" value={packdata.duration} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" name="city" value={packdata.city} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="destination" className="form-label">Destination</label>
                    <input type="text" className="form-control" id="destination" name="destination" value={packdata.destination} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cost" className="form-label">Cost</label>
                    <input type="number" className="form-control" id="cost" name="cost" value={packdata.cost} onChange={handleInputChange} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={handleAddPackage}>Add Package</button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Package Modal */}
        <div className="modal fade" id="editPackageModal" tabIndex="-1" aria-labelledby="editPackageModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editPackageModalLabel">Edit Package</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="package_code" className="form-label">Package Code</label>
                    <input type="text" className="form-control" id="package_code" name="package_code" value={packdata.package_code} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="package_name" className="form-label">Package Name</label>
                    <input type="text" className="form-control" id="package_name" name="package_name" value={packdata.package_name} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration</label>
                    <input type="text" className="form-control" id="duration" name="duration" value={packdata.duration} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" name="city" value={packdata.city} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="destination" className="form-label">Destination</label>
                    <input type="text" className="form-control" id="destination" name="destination" value={packdata.destination} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cost" className="form-label">Cost</label>
                    <input type="number" className="form-control" id="cost" name="cost" value={packdata.cost} onChange={handleInputChange} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={handleEditPackage}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>

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
                          <th>Package Code</th>
                          <th>Package Name</th>
                          <th>Duration</th>
                          <th>City Name</th>
                          <th>Destination</th>
                          <th>Cost</th>
                          <th>Added By</th>
                          <th>Created Date</th>
                          <th style={{ width: "420px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(pack) && pack.length > 0 ? (
                          queryData.map((items, index) => (
                            <tr key={items._id}>
                              <td>{index + 1}</td>
                              <td>{items.package_code}</td>
                              <td>{items.package_name}</td>
                              <td>{items.duration}</td>
                              <td>{items.city}</td>
                              <td>{items.destination}</td>
                              <td>{items.cost}</td>
                              <td>{items.added_by?.name || "Unknown"}</td>
                              <td>{items.created_dt}</td>
                              <td>
                                <button className="btn btn-sm btn-primary" onClick={() => handleOpenEditModal(items)}>
                                  Edit
                                </button>
                                <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDeletePackage(items._id)}>
                                  Delete
                                </button>
                                <button className="btn btn-sm btn-primary" onClick={() => handleViewPackage(items._id)} data-bs-toggle="modal" data-bs-target="#viewPackageModal">View</button>

                                  </td>
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
                    <p><strong>Package Code:</strong> {selectedPackage.package_code}</p>
                    <p><strong>Package Name:</strong> {selectedPackage.package_name}</p>
                    <p><strong>Duration:</strong> {selectedPackage.duration}</p>
                    <p><strong>City:</strong> {selectedPackage.city}</p>
                    <p><strong>Destination:</strong> {selectedPackage.destination}</p>
                    <p><strong>Cost:</strong> ${selectedPackage.cost}</p>
                    <p><strong>Added By:</strong> {selectedPackage.added_by?.name || "Unknown"}</p>
                    <p><strong>Created Date:</strong> {new Date(selectedPackage.created_at).toLocaleDateString()}</p>
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
      <Footer />
    </>
  );
};

export default Packages;

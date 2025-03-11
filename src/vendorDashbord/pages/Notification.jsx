import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const Notification= () => {
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

  // Fetch packages when component mounts
  useEffect(() => {
    const GetFun = async () => {
      try {
        const arryQuery = await fetch(`${API_URL}/vendor/Notifications`, {
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

  


  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`${API_URL}/vendor/Notifications/${packageId}`, {
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



  const handleViewPackage = async (packageId) => {
    const packageToView = pack.find(pkg => pkg._id === packageId);
    setSelectedPackage(packageToView); // Set selected package to the state
    
    try {
      // Make API request to update the status to 'Read'
      const response = await fetch(`${API_URL}/vendor/Notifications/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update message read status');
      }
  
      const updatedPackage = await response.json();
  
      // Update the selected package to reflect the "Read" status
      setSelectedPackage((prevState) => ({
        ...prevState,
        message_read: 'Read',  // or true, depending on the backend response
      }));
  
      // Optionally, update the entire list of packages
      setPack(prevPack => prevPack.map(pkg => 
        pkg._id === packageId ? updatedPackage.data : pkg
      ));
  
      toast.success('Thanks for reading this notifications');
    } catch (err) {
      console.error(err);
      toast.error('Error marking notification as read: ' + err.message);
    }
  };
  


  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Notification Details</b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Notification</a>
                </li>
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
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Notification Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }} >
                    Explore our flyer list to check all the details and expiration dates.
                  </p>

                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Message From</th>
                          <th>Message To</th>
                          <th>Message Heading</th>
                          <th>Message Reading status</th>
                          <th>Created Date</th>
                          <th style={{ width: "420px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(pack) && pack.length > 0 ? (
                          pack.map((items, index) => (
                            
                            <tr key={items._id}>
                              <td>{index + 1}</td>
                              <td>{items.from_id}</td>
                              <td>{items.to_id}</td>
                              <td>{items.message_heading}</td>
                              <td>{items.message_read === 'Y' ? <p className="text-danger">Read</p> : <p className="text-success">Unread</p>}</td>
                              
                              <td>{items.created_date}</td>
                              <td>
                               
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
                <h5 className="modal-title" id="viewPackageModalLabel">Notification Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {selectedPackage ? (
                  <div>
                    <p><strong>Notification From:</strong> {selectedPackage.from_id}</p>
                    <p><strong>Notification To:</strong> {selectedPackage.to_id}</p>
                    <p><strong>Heading:</strong> {selectedPackage.message_heading}</p>
                    <p><strong>Message:</strong> {selectedPackage.message_body}</p>
                    <p><strong>Read Status: Read</strong> </p>
                  
                    <p><strong>Created Date:</strong> {selectedPackage.created_date}</p>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>closeFun(selectedPackage._id)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      <Footer />
    </>
  );
};

export default Notification;

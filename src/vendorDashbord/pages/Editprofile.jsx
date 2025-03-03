import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { useNavigate } from 'react-router-dom';

const Editprofile = () => {
  const [user, setUser] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    bankBranch: '',
    bankAccount: '',
    ifscCode: ''
  });

  const navigation = useNavigate();

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('token'); // Retrieve token from localStorage

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Set the user data into state
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setBankDetails({
      ...bankDetails,
      [id]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Here you would typically send the form data to the backend or API
    console.log('Updated Bank Details:', bankDetails);
  
    // Replace this URL with your actual API endpoint
    const apiUrl = '${API_URL}/vendor/Update-Bank'; 
  
    // Example payload, assuming you need to send these values in the request body
    const payload = {
      bankName: bankDetails.bankName,
      bankBranch: bankDetails.bankBranch,
      bankAccount: bankDetails.bankAccount,
      ifscCode: bankDetails.ifscCode,
    };
  
    // Sending POST request to update bank details
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming the API requires an auth token
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        console.log('Success:', data); // Handle successful response
        // Navigate to profile page or show success message
        navigation('/Profile'); // Example: Redirecting to profile page after successful submission
      })
      .catch((error) => {
        console.error('Error:', error); // Handle error if the API call fails
        // Optionally show an error message to the user
      });
  };
  
  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-person-circle mx-2"></i><b>Edit Profile</b></h4>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Profile Information</h6>
                  {/* Profile Information */}
                  {user && (
                    <div className="d-flex align-items-center">
                      <img alt="Profile" className="rounded-circle" src="assets/img/profile-img.jpg" />
                      <div>
                        <h5>{user.first_name} {user.last_name}</h5>
                        <p>{user.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bank Details Section */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Bank Details</h4>

                  {/* Bank details form */}
                  <form onSubmit={handleSubmit} className="d-flex flex-wrap justify-content-around">
                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="bankName">Bank Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="bankName"
                        placeholder="Enter bank name"
                        value={bankDetails.bankName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="bankBranch">Bank Branch</label>
                      <input
                        type="text"
                        className="form-control"
                        id="bankBranch"
                        placeholder="Enter bank branch"
                        value={bankDetails.bankBranch}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="bankAccount">Bank Account Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="bankAccount"
                        placeholder="Enter bank account number"
                        value={bankDetails.bankAccount}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="ifscCode">Bank IFSC Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ifscCode"
                        placeholder="Enter bank IFSC code"
                        value={bankDetails.ifscCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group mr-3 mb-3">
                    <button type="submit" className="btn btn-sm btn-primary mt-5">Submit</button>
                    </div>
                  </form>
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

export default Editprofile;

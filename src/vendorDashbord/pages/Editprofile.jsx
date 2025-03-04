import React, { useState, useEffect, useContext } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { useNavigate } from 'react-router-dom';
import { EmpContext } from '../../../EmpContext';
import { API_URL } from '../data/apiUrl';

const Editprofile = () => {
  const { emp } = useContext(EmpContext); // emp comes from EmpContext
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });  // Initial state for user profile
  const navigate = useNavigate();  // For navigation after form submission

  // Fetch user data (Simulating fetching from an API)
  useEffect(() => {
    // Replace with your actual API call to fetch the user data
    const fetchUserData = async () => {
      const response = await fetch('/api/userProfile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUser(data);  // Assuming the response contains user data
    };
    fetchUserData();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [id]: value,  // Dynamically update the field in the state
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update the user profile (replace with your API URL)
    const apiUrl = `${API_URL}/vendor/update-user/${emp._id}`;  // Corrected template literal

    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log('Profile updated successfully:', data);
        // Navigate to the profile page or show a success message
        navigate('/Profile');
        window.location.reload();

      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle errors (maybe show an error message to the user)
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
                  {/* Display current user info */}
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

        {/* Edit Profile Form */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Profile Details</h4>

                  {/* Profile details form */}
                  <form onSubmit={handleSubmit} className="d-flex flex-wrap justify-content-around">
                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        placeholder="Enter First Name"
                        value={user.first_name} // Use user state instead of emp
                        onChange={handleChange} // Handle form field changes
                      />
                    </div>

                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        placeholder="Enter Last Name"
                        value={user.last_name} // Use user state instead of emp
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group mr-3 mb-3">
                      <label htmlFor="email">E-Mail</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email Id"
                        value={user.email} // Use user state instead of emp
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

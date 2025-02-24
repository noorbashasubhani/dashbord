import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState(''); // Track old password
  const [newPassword, setNewPassword] = useState(''); // Track new password
  const [confirmPassword, setConfirmPassword] = useState(''); // Track confirm password
  const [error, setError] = useState(''); // Track error messages
  const [successMessage, setSuccessMessage] = useState(''); // Success message after password change

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setError(''); // Reset error
    try {
      // Assuming you have a way to get the user ID (e.g., from localStorage or context)
      const userData = localStorage.getItem('token'); 
      const parsedUserData = JSON.parse(userData);

      //const userDatas = JSON.parse(localStorage.getItem('token'));
      //alert(parsedUserData._id);
      // Call the backend API to change the password
      const response = await fetch(`${API_URL}/vendor/Change-Password/${parsedUserData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
      } else {
        setError(data.message); // Show the error from the backend
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-x-circle mx-2"></i><b>Password Update | Reset The Password</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="/">Setting</a>
              </li>
              <li className="breadcrumb-item active">Password</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Change Password</h6>
                  <p className="" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Please enter your new password below.
                  </p>

                  <form onSubmit={handleSubmit}>
                    {/* Old Password Field */}
                    <div className="form-group">
                      <label htmlFor="oldpassword">Old Password:</label>
                      <input
                        type="password"
                        id="oldpassword"
                        className="form-control"
                        placeholder="Enter your old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </div>

                    {/* New Password Field */}
                    <div className="form-group">
                      <label htmlFor="newpassword">New Password:</label>
                      <input
                        type="password"
                        id="newpassword"
                        className="form-control"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password:</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    {/* Password Mismatch Error */}
                    {error && <p className="text-danger">{error}</p>}
                    {successMessage && <p className="text-success">{successMessage}</p>}

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-sm btn-primary mt-3">
                      Change Password
                    </button>
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

export default ChangePassword;

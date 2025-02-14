import React, { useState } from 'react';
import { API_URL } from '../../data/apiUrl';

const VendorRegistration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !email) {
      setError('All fields are required');
      return;
    }

    try {
      // Make a POST request to the backend
      const response = await fetch(`${API_URL}/vendor/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      

      const data = await response.json();

      if (response.ok) {
        // Successful registration
        setSuccessMessage('Vendor registered successfully!');
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
      } else {
        // Error response from server
        setError(data.message || 'Error registering vendor. Please try again later.');
      }
    } catch (err) {
      // Handle network or other errors
      setError('User Already Exits');
      console.error(err);
    }
  };

  return (
    <div className="vendor-registration">
      <h2>Vendor Registration</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default VendorRegistration;

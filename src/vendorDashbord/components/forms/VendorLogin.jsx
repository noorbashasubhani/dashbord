import React, { useState } from 'react';

const VendorLogin = () => {
  const [vendorId, setVendorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendorId || !password) {
      setError('Both Vendor ID and Password are required');
    } else {
      // Handle vendor login logic here, e.g., API call
      console.log('Logging in with:', { vendorId, password });
      setError('');
      // You can add navigation logic to the vendor dashboard here
    }
  };

  return (
    <div className="vendor-login">
      <h2>Vendor Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="vendorId">Vendor ID</label>
          <input
            type="text"
            id="vendorId"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            placeholder="Enter your Vendor ID"
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default VendorLogin;

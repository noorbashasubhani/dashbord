import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from './src/vendorDashbord/data/apiUrl';

// Create a context for employee data
const EmpContext = createContext();

const EmpProvider = ({ children }) => {
  const [emp, setEmp] = useState(null); // Store employee data
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state

  useEffect(() => {
    const fetchEmp = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      if (!token) {
        setError('No token found. Please log in again.');
        setLoading(false);
        return; // Stop execution if no token is found
      }

      try {
        const decodedToken = jwtDecode(token); // Decode the JWT token
        const userId = decodedToken.userId; // Extract userId from the decoded token

        // Fetch employee details using the userId
        const response = await fetch(`${API_URL}/vendor/Single-user/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }

        const data = await response.json(); // Parse response to JSON
        setEmp(data); // Store the fetched employee data
      } catch (error) {
        setError(error.message); // Set error if something goes wrong
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchEmp(); // Call the async function to fetch data
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  // If still loading, show loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, show error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Provide employee data and update function to the context
  return (
    <EmpContext.Provider value={{ emp, setEmp }}>
      {children}
    </EmpContext.Provider>
  );
};

export { EmpProvider, EmpContext };

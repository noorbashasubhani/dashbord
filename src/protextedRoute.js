import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if there's a token in localStorage

  useEffect(() => {
    if (!token) {
      // If no token, navigate to the login page
      navigate('/');
    }
  }, [token, navigate]);

  // If authenticated, render the passed element (e.g., Dashboard)
  if (token) {
    return element; // Render the protected element (Dashboard)
  }

  return null; // If no token, the component will not render anything
};

export default ProtectedRoute;

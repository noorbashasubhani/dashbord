import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get the token from localStorage

  useEffect(() => {
    if (!token) {
      // If no token, redirect to login page
      navigate('/');
    }
  }, [token, navigate]);

  // If the token exists, render the protected element (component)
  return token ? element : null;
};

export default ProtectedRoute;

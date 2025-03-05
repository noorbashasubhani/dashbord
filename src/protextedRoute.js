import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token'); // Get the token from localStorage

  useEffect(() => {
    // Redirect the user based on the presence of the token
    if (!token) {
      navigate('/'); // Redirect to login if no token
    } 
    setIsLoading(false); // Stop the loading state once the navigation logic is done
  }, [token, navigate]);

  // If the token is still loading, don't render anything
  if (isLoading) {
    return null;
  }

  // If the token exists, render the protected component
  return token ? element : null;
};

export default ProtectedRoute;

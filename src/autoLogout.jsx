import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = () => {
  const [idleTime, setIdleTime] = useState(0);
  const navigate = useNavigate();

  const resetIdleTimer = () => {
    setIdleTime(0); // Reset the idle time whenever there's any user activity
  };

  useEffect(() => {
    // Listen for any user activity
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);

    // Set an interval to track idle time every second
    const idleTimeout = setInterval(() => {
      setIdleTime(prevIdleTime => prevIdleTime + 1); // Increment idle time every second
    }, 1000); // Every second

    // If idle time reaches 5 seconds, log out the user
    if (idleTime >= 5) {
      localStorage.removeItem('token'); // Remove token
      navigate('/login'); // Redirect to login page
    }

    // Cleanup: remove event listeners and interval when the component unmounts
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      clearInterval(idleTimeout);
    };
  }, [idleTime, navigate]); // Dependency array to re-run effect when idleTime changes

  return (
    <div>
      <h2>You will be logged out after 5 seconds of inactivity...</h2>
    </div>
  );
};

export default AutoLogout;

// hooks/useIdleLogout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useIdleLogout = (timeout = 30 * 60 * 1000) => {
  const navigate = useNavigate();

  useEffect(() => {
    //alert();
    
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, timeout);
    };

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      //alert("Logged out due to inactivity.");
      navigate("/");
      window.location.reload();
    };

    const events = ["mousemove", "mousedown", "keypress", "touchstart"];

    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Initialize timer

    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, timeout]);
};

export default useIdleLogout;

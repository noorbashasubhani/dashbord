import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect ,useContext } from 'react';
import { API_URL } from '../data/apiUrl';
import { jwtDecode } from 'jwt-decode';
import useIdleLogout from '../pages/useIdleLogout';
//import { EmpContext } from '../../../EmpContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { FaSignOutAlt } from "react-icons/fa";

const NavBar = () => {

  useIdleLogout();
const navigate = useNavigate();
const [em,setEm]=useState();
const [erro,setError]=useState();

const token = localStorage.getItem('token');
const decodedToken = jwtDecode(token);  // Decode the token
const userId = decodedToken.userId;  // Assuming the user ID is stored in the userId field
//console.log('User ID:', userId);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Single-user/${userId}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setEm(data);  // Set the user data to state
      //console.log(data);   // Log the data (optional)
    } catch (err) {
      setError(err.message);  // Handle any errors
      //console.error('Fetch error:', err);
    }
  };

  fetchUser();  // Call the fetchUser function inside useEffect
}, [userId]);  // Dependency array: re-run the effect if userId changes

  
 

  const password = () =>{
    navigate('/Password');
   }
   const myprofile = () => {
    navigate('/Profile', { emp :{em}});
   }
  // Function to handle logout
  const logout = () => {
    // Remove token from localStorage
      const token = localStorage.removeItem("token");
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
        toast.success("You have been logged out successfully!");

       setTimeout(() => {
    navigate('/');
  }, 1500);
  };
 
  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
    <div className="d-flex align-items-center justify-content-between">
      <a href="index.html" className="logo d-flex align-items-center">
        <img src="https://gogagacrm.com/gogaga/assets/images/logo_gogaga.png" alt="" />
        
      </a>
      <i className="bi bi-list toggle-sidebar-btn" />
    </div>
    {/* End Logo */}
    <ToastContainer />
    {/* End Search Bar */}
    <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center">
        <li className="nav-item d-block d-lg-none">
          <a className="nav-link nav-icon search-bar-toggle " href="#">
            <i className="bi bi-search" />
          </a>
        </li>
        {/* End Search Icon*/}
        <li className="nav-item dropdown">
          <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i className="bi bi-bell" />
            <span className="badge bg-primary badge-number">4</span>
          </a>
          {/* End Notification Icon */}
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            <li className="dropdown-header">
              You have 4 new notifications
              <a href="#">
                <span className="badge rounded-pill bg-primary p-2 ms-2">
                  View all
                </span>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="notification-item">
              <i className="bi bi-exclamation-circle text-warning" />
              <div>
                <h4>Lorem Ipsum</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>30 min. ago</p>
              </div>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="notification-item">
              <i className="bi bi-x-circle text-danger" />
              <div>
                <h4>Atque rerum nesciunt</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>1 hr. ago</p>
              </div>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="notification-item">
              <i className="bi bi-check-circle text-success" />
              <div>
                <h4>Sit rerum fuga</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>2 hrs. ago</p>
              </div>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="notification-item">
              <i className="bi bi-info-circle text-primary" />
              <div>
                <h4>Dicta reprehenderit</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>4 hrs. ago</p>
              </div>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="dropdown-footer">
              <a href="#">Show all notifications</a>
            </li>
          </ul>
          {/* End Notification Dropdown Items */}
        </li>
        {/* End Notification Nav */}
        <li className="nav-item dropdown">
          <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i className="bi bi-chat-left-text" />
            <span className="badge bg-success badge-number">3</span>
          </a>
          {/* End Messages Icon */}
          
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
            <li className="dropdown-header">
              You have 3 new messages
              <a href="#">
                <span className="badge rounded-pill bg-primary p-2 ms-2">
                  View all
                </span>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="message-item">
              <a href="#">
                <img
                  src="assets/img/messages-1.jpg"
                  alt=""
                  className="rounded-circle"
                />
                <div>
                  <h4>Maria Hudson</h4>
                  <p>
                    Velit asperiores et ducimus soluta repudiandae labore officia
                    est ut...
                  </p>
                  <p>4 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="message-item">
              <a href="#">
                <img
                  src="assets/img/messages-2.jpg"
                  alt=""
                  className="rounded-circle"
                />
                <div>
                  <h4>Anna Nelson</h4>
                  <p>
                    Velit asperiores et ducimus soluta repudiandae labore officia
                    est ut...
                  </p>
                  <p>6 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="message-item">
              <a href="#">
                <img
                  src="assets/img/messages-3.jpg"
                  alt=""
                  className="rounded-circle"
                />
                <div>
                  <h4>David Muldon</h4>
                  <p>
                    Velit asperiores et ducimus soluta repudiandae labore officia
                    est ut...
                  </p>
                  <p>8 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="dropdown-footer">
              <a href="#">Show all messages</a>
            </li>
          </ul>
          {/* End Messages Dropdown Items */}
        </li>
       <li class="nav-item dropdown me-3">
  <a
    class="nav-link dropdown-toggle"
    href="#"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    <img
      src="assets/img/profile-img.jpg"
      class="rounded-circle"
      alt=""
      width="30"
      height="30"
    />
    
  </a>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" onClick={myprofile}>Profile</a></li>
    <li><a class="dropdown-item" onClick={password}>Change Password</a></li>
    <li><hr class="dropdown-divider" /></li>
    <li>
      <a class="dropdown-item text-danger" onClick={logout}>
        <i class="bi bi-box-arrow-right"></i> Logout
      </a>
    </li>
  </ul>
</li>
        {/* End Messages Nav */}
       
        {/* End Profile Nav */}
      </ul>
    </nav>
    {/* End Icons Navigation */}
  </header>
  
  )
}

export default NavBar
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect ,useContext } from 'react';
import { API_URL } from '../data/apiUrl';
import { jwtDecode } from 'jwt-decode';
import { EmpContext } from '../../../EmpContext';


const NavBar = () => {
const navigate = useNavigate();
const [em,setEm]=useState();


const { emp } = useContext(EmpContext);

  //const {}=
  
  const password = () =>{
    navigate('/Password');
   }
   const myprofile = () => {
    navigate('/Profile');
   }
  // Function to handle logout
  const logout = () => {
    // Remove token from localStorage
      const token = localStorage.removeItem("token");
      navigate('/');
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
        {/* End Messages Nav */}
        <li className="nav-item dropdown pe-3">
          <a
            className="nav-link nav-profile d-flex align-items-center pe-0"
            href="#"
            data-bs-toggle="dropdown"
          >
            <img
                src="assets/img/profile-img.jpg"
                alt="Profile"
                className="rounded-circle"
              />
              {/* Show the user's name from the state */}
              <span className="d-none d-md-block dropdown-toggle ps-2">
                
              </span>
          </a>
          {/* End Profile Iamge Icon */}
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
          <li className="dropdown-header">
          <h6>Welcome,</h6>
          <h6>You Logined As a : {emp ? `${emp.first_name} ${emp.last_name}` : "Loading..."}</h6>
          <span>{emp ? emp.email : "Loading..."}</span>
              </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item d-flex align-items-center" onClick={myprofile}>
                <i className="bi bi-person" />
                <span>My Profile</span>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item d-flex align-items-center" onClick={password}>
                <i className="bi bi-key-fill" />
                <span>Change Password</span>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item d-flex align-items-center"
                href="pages-faq.html"
              >
                <i className="bi bi-question-circle" />
                <span>Need Help?</span>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item d-flex align-items-center" onClick={logout}>
                <i className="bi bi-box-arrow-right" />
                <span>Sign Out</span >
              </a>
            </li>
          </ul>
          {/* End Profile Dropdown Items */}
        </li>
        {/* End Profile Nav */}
      </ul>
    </nav>
    {/* End Icons Navigation */}
  </header>
  
  )
}

export default NavBar
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('token'); // Retrieve token from localStorage

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Set the user data into state
    }
  }, []);

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-person-circle mx-2"></i><b>My Profile</b></h4>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Profile Information</h6>
                  
                  {/* Profile Information */}
                  {user && (
                    <div className="d-flex align-items-center">
                     <img alt="Profile" class="rounded-circle" src="assets/img/profile-img.jpg" />
                      <div>
                        <h5>{user.first_name} {user.last_name}</h5>
                        <p>{user.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  {/* Tabs */}
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a className="nav-link active" id="personal-tab" data-bs-toggle="tab" href="#personal" role="tab" aria-controls="personal" aria-selected="true">
                        Personal Details
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link" id="bank-tab" data-bs-toggle="tab" href="#bank" role="tab" aria-controls="bank" aria-selected="false">
                        Bank Details
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link" id="education-tab" data-bs-toggle="tab" href="#education" role="tab" aria-controls="education" aria-selected="false">
                        Education Details
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link" id="work-tab" data-bs-toggle="tab" href="#work" role="tab" aria-controls="work" aria-selected="false">
                        Work Details
                      </a>
                    </li>
                  </ul>

                  <div className="tab-content" id="myTabContent">
                    {/* Personal Details */}
                    <div className="tab-pane fade show active" id="personal" role="tabpanel" aria-labelledby="personal-tab">
                      <h6>Personal Information</h6>
                      <p><strong>First Name:</strong> {user ? user.first_name : 'N/A'}</p>
                      <p><strong>Last Name:</strong> {user ? user.last_name : 'N/A'}</p>
                      <p><strong>Email:</strong> {user ? user.email : 'N/A'}</p>
                    </div>

                    {/* Bank Details */}
                    <div className="tab-pane fade" id="bank" role="tabpanel" aria-labelledby="bank-tab">
                      <h6>Bank Information</h6>
                      {/* You can add bank details here */}
                      <p>Bank Name: X Bank</p>
                      <p>Account Number: XXXXXXXX</p>
                    </div>

                    {/* Education Details */}
                    <div className="tab-pane fade" id="education" role="tabpanel" aria-labelledby="education-tab">
                      <h6>Education Information</h6>
                      {/* You can add education details here */}
                      <p>University: XYZ University</p>
                      <p>Degree: Bachelor of Science</p>
                    </div>

                    {/* Work Details */}
                    <div className="tab-pane fade" id="work" role="tabpanel" aria-labelledby="work-tab">
                      <h6>Work Information</h6>
                      {/* You can add work details here */}
                      <p>Company: XYZ Corp</p>
                      <p>Position: Software Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Profile;

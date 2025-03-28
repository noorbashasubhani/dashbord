import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { useNavigate } from 'react-router-dom';
import { EmpContext } from '../../../EmpContext';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../data/apiUrl';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [errs, setErrs] = useState(null);
  const navigation = useNavigate();
  const token = localStorage.getItem('token');
  const decodedToken=jwtDecode(token);
  const userId = decodedToken.userId; 
  //console.log("MY pROFILE DETAISL:"+emp);
  const editprofile=()=>{
    navigation('/Edit-Profile');
  }
 useEffect(() => {
   const fetchUser = async () => {
    
     try {
       const respo = await fetch(`${API_URL}/vendor/Single-user/${userId}`);
       
       if (!respo.ok) {
         throw new Error('Network response was not ok');
       }
       
       const datas = await respo.json();
       setUser(datas);  // Set the user data to state
       //console.log("dddd:"+datas);   // Log the data (optional)
     } catch (err) {
      setErrs(err.message);  // Handle any errors
       console.error('Fetch error:', err);
     }
   };
 
   fetchUser();  // Call the fetchUser function inside useEffect
 }, [userId]);  // Dependency array: re-run the effect if userId changes
 
  

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-person-circle mx-2"></i><b>My Profile</b> <i class="bi bi-slash-square" onClick={editprofile}></i></h4>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Profile Information </h6>
                  
                  {/* Profile Information */}
                  
                    <div className="d-flex align-items-center">
                      <img alt="Profile" class="rounded-circle" src="assets/img/profile-img.jpg"/>
                      <div>
                        <h5 className="p-5">Mr. / Mrs : {user && user.first_name?user.first_name:''} {user && user.last_name?user.last_name:''} </h5>
                        <h5 className="p-3"> {user && user.email ? user.email:''}</h5>
                      </div>
                    </div>
                
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

                  <div className="tab-content mt-5" id="myTabContent">
                    {/* Personal Details */}
                    <div className="tab-pane fade show active" id="personal" role="tabpanel" aria-labelledby="personal-tab">
                      <h6 className='text-primary'>Personal Information</h6>
                      <p><strong>Emp Id:</strong> {user && user.employee_id?user.employee_id:''}  </p>
                      <p><strong>First Name: </strong>{user && user.first_name?user.first_name:''} </p>
                      <p><strong>Last Name: </strong> {user && user.last_name?user.last_name:''}</p>
                      <p><strong>Full Name: </strong> {user && user.first_name?user.first_name:''} {user && user.last_name?user.last_name:''}</p>
                      <p><strong>Email: </strong>{user && user.email?user.email:''}  </p>
                      <p><strong>Gender: </strong>{user && user.gender?user.gender:''}  </p>
                    </div>

                    {/* Bank Details */}
                    <div className="tab-pane fade" id="bank" role="tabpanel" aria-labelledby="bank-tab">
                      <h6 className='text-primary'>Bank Information</h6>
                      {/* You can add bank details here */}
                      <p><strong>Bank Name: </strong> {user && user.previous_company?user.previous_company:''}</p>
                      <p><strong>Bank Branch Name: </strong> {user && user.branch_name?user.branch_name:''} </p>
                      <p><strong>Bank A/C: </strong>{user && user.bank_ac_number?user.bank_ac_number:''}  </p>
                      <p><strong>Bank IFC Code: </strong>{user && user.ifsc_no?user.ifsc_no:''}  </p>
                      
                    </div>

                    {/* Education Details */}
                    <div className="tab-pane fade" id="education" role="tabpanel" aria-labelledby="education-tab">
                      <h6 className='text-primary'>Education Information</h6>
                      <p><strong>Highest Qualification : </strong> {user && user.higher_qualification?user.higher_qualification:''}</p>
                      <p><strong>Qualification Year: </strong> {user && user.qualification_year?user.qualification_year:''} </p>
                      <p><strong>Percentage: </strong>{user && user.percentage?user.percentage:''}  </p>
                      <p><strong>Institute Name: </strong>{user && user.institute_name?user.institute_name:''}  </p>
                      <p><strong>Marksheet Google Drive link: </strong>{user && user.google_link?user.google_link:''}  </p>
                                          </div>

                    {/* Work Details */}
                    <div className="tab-pane fade" id="work" role="tabpanel" aria-labelledby="work-tab">
                      <h6 className='text-primary'>Work Information</h6>
                      <p><strong>Date Of Birthday : </strong> {user && user.date_of_birthday?user.date_of_birthday:''}</p>
                      <p><strong>Department: </strong> {user && user.department_id?user.department_id:''} </p>
                      <p><strong>Designation: </strong>{user && user.designation_id?user.designation_id:''}  </p>
                      <p><strong>PAN NO: </strong>{user && user.pan_number?user.pan_number:''}  </p>
                      <p><strong>Work Location: </strong>{user && user.address?user.address:''}  </p>
                      <hr></hr>
                      {user &&  user.are_you_fresher 
  ? <p> <b>Previous work details</b> : I am a fresher</p> 
  : (
    <div>
      <h6 className='text-primary'>Previous Work Details</h6>
      <p><strong>Previous Company Name: </strong>{user?.previous_company || ''}</p>
      <p><strong>Designation: </strong>{user?.previous_designation || ''}</p>
      <p><strong>Reporting Manager Name: </strong>{user?.reporting_manager_name || ''}</p>
      <p><strong>Reporting Manager No: </strong>{user?.reporting_manager_no || ''}</p>
      <p><strong>From Date: </strong>{user?.from_date || ''} <strong>To Date: </strong>{user?.to_date || ''}</p>
    </div>
  )
}

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

export default MyProfile;

import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const Registration = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        gender: '',
        fathername: '',
        mothername: '',
        fathername_no: '',
        mothername_no: '',
        date_of_birthday: '',
        mobile_no: '',
        department_id: '',
        designation_id: '',
        castname: '',
        address: '',
        contact_number: '',
        user_type: '',
        status: '',
        pan_number: '',
        are_you_fresher: '',
        previous_company: '',
        previous_designation: '',
        reporting_manager_name: '',
        reporting_manager_no: '',
        from_date: '',
        to_date: '',
        experience_details: '',
        heigher_qualification: '',
        qualification_year: '',
        pecentage: '',
        institute_name: '',
        google_link: '',
        bank_name: '',
        branch_name: '',
        bank_ac_number: '',
        ifc_no: '',
        ref_no_one: '',
        ref_no_two: '',
        ref_mobile_one: '',
        ref_mobile_two: '',
        employee_id: ''
      });
  const [dept, setDept] = useState([]);
  const [desg, setdesg] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
    ...prev,
    [name]: value,
  }));
  };

  // Handle password visibility toggle
  const handlePasswordToggle = () => {
    setFormData({ ...formData, password_visible: !formData.password_visible });
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/vendor/Registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      // Redirect to a success page or another route
     // navigate('/success');
    } catch (err) {
      console.error(err.message);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

 
  const getDepartments = async () => {
    try {
      const deptRes = await fetch(`${API_URL}/vendor/Dept`);
      const datas = await deptRes.json();
      setDept(datas.data); // ✅ correc
    } catch (error) {
      console.error('Error fetching departments:', error.message);
      setDept(); // fallback to empty array
    }
  };

  const getDesignation = async () => {
    try {
      const deptRess = await fetch(`${API_URL}/vendor/Desg`);
      const datass = await deptRess.json();
      setdesg(datass.designations); // ✅ correc
    } catch (error) {
      console.error('Error fetching departments:', error.message);
      setdesg(); // fallback to empty array
    }
  };
  
  
  useEffect(() => {
    getDepartments();
    getDesignation();
  }, []);
  

  const validateEmail=async (email)=>{
       try{
        const response = await fetch(`${API_URL}/vendor/Email-check`,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        });
        const data = await response.json();
        alert('Already exits');
        //console.log(data);
       }catch(err){
        console.error('Error checking email:', error);

       }
  }

  return (
    <>
      <main id="" className="">
      <center>
        <div className="pagetitle">
          <h4><i className="bi bi-person-fill mx-2"></i><b>User Registration</b></h4>
          
        </div>
        </center>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                    <center>
                  <h6 className="card-title" style={{ fontSize: '14px' }}>User Registration Form</h6>
                  <p style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Fill out the form below to register a new user.
                  </p>
                  </center>
                  <form onSubmit={handleSubmit}>
                    {/* Row 1: First Name, Last Name, Email */}
                    <div className="row">
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="first_name" className="form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="last_name" className="form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Date Of Birthday</label>
                          <input
                            type="date"
                            className="form-control"
                            id="date_of_birthday"
                            name="date_of_birthday"
                            value={formData.date_of_birthday}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Password, Gender, Father's Name */}
                    <div className="row">
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input
                            type={formData.password_visible ? 'text' : 'password'}
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                          <div className="form-check mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="password_visible"
                              checked={formData.password_visible}
                              onChange={handlePasswordToggle}
                            />
                            <label htmlFor="password_visible" className="form-check-label">
                              Show Password
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label className="form-label">Gender</label>
                          <select
                            className="form-select"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="fathername" className="form-label">Father's Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="fathername"
                            name="fathername"
                            value={formData.fathername}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Mother Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="mothername"
                            name="mothername"
                            value={formData.mothername}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Mobile Number, Address, Department */}
                    <div className="row">

                    <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="mobile_no" className="form-label">Father Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="fathername_no"
                            name="fathername_no"
                            value={formData.fathername_no}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="mobile_no" className="form-label">Mother Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="mothername_no"
                            name="mothername_no"
                            value={formData.mothername_no}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="mobile_no" className="form-label">Mobile Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="mobile_no"
                            name="mobile_no"
                            value={formData.mobile_no}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <hr></hr>
                      
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="mobile_no" className="form-label">Department Name</label>
                          <select
                          className="form-select"
                          id="department_id"
                          name="department_id"
                          value={formData.department_id}
                          onChange={handleInputChange}
                        >
                          <option value="">----Select Departments---</option>
                          {dept && dept.length > 0 && dept.map(department => (
                            <option key={department._id} value={department._id}>
                              {department.name}
                            </option>
                          ))}
                        </select>
                          
                        </div>
                      </div>


                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="mobile_no" className="form-label">Designation Name</label>
                          <select className="form-select" id="designation_id"
                            name="designation_id"
                            value={formData.designation_id}
                            onChange={handleInputChange}>
                              <option value="">----Select Designation ---</option>
                              {desg.map(desfd => (
                                    <option key={desfd._id} value={desfd._id}>
                                    {desfd.name}
                                    </option>
                                ))}
                          </select>
                          
                        </div>
                      </div>



                      
                      
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="address" className="form-label">Cast Name</label>
                          <input type="text"
                            className="form-control"
                            id="castname"
                            name="castname"
                            value={formData.castname}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="user_type" className="form-label">User Type</label>
                          <select
                            className="form-select"
                            name="user_type"
                            value={formData.user_type}
                            onChange={handleInputChange}
                          >
                            <option value="">Select User Type</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Row 4: User Type, Status */}
                    <div className="row">
                     
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">Status</label>
                          <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                     
                    
                      
                      
                     
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Pan Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="pan_number"
                            name="pan_number"
                            value={formData.pan_number}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="address" className="form-label">Address</label>
                          <textarea
                            className="form-control"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      <hr></hr>

                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Are You Fresher ?</label>
                          <input
                            type="text"
                            className="form-control"
                            id="are_you_fresher"
                            name="are_you_fresher"
                            value={formData.are_you_fresher}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Previous Company</label>
                          <input
                            type="text"
                            className="form-control"
                            id="previous_company"
                            name="previous_company"
                            value={formData.previous_company}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Previous Designation</label>
                          <input
                            type="text"
                            className="form-control"
                            id="previous_designation"
                            name="previous_designation"
                            value={formData.previous_designation}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Reporting Manager Name </label>
                          <input
                            type="text"
                            className="form-control"
                            id="reporting_manager_name"
                            name="reporting_manager_name"
                            value={formData.reporting_manager_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Reporting Manager No </label>
                          <input
                            type="text"
                            className="form-control"
                            id="reporting_manager_no"
                            name="reporting_manager_no"
                            value={formData.reporting_manager_no}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">From Date </label>
                          <input
                            type="date"
                            className="form-control"
                            id="from_date"
                            name="from_date"
                            value={formData.from_date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">To Date </label>
                          <input
                            type="date"
                            className="form-control"
                            id="to_date"
                            name="to_date"
                            value={formData.to_date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Experience Details</label>
                          <input
                            type="text"
                            className="form-control"
                            id="experience_details"
                            name="experience_details"
                            value={formData.experience_details}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Heigher Qualification </label>
                          <input
                            type="text"
                            className="form-control"
                            id="heigher_qualification"
                            name="heigher_qualification"
                            value={formData.heigher_qualification}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Qalification Year</label>
                          <input
                            type="text"
                            className="form-control"
                            id="qualification_year"
                            name="qualification_year"
                            value={formData.qualification_year}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Pecentage</label>
                          <input
                            type="text"
                            className="form-control"
                            id="pecentage"
                            name="pecentage"
                            value={formData.pecentage}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Institute Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="institute_name"
                            name="institute_name"
                            value={formData.institute_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">google_link</label>
                          <input
                            type="text"
                            className="form-control"
                            id="google_link"
                            name="google_link"
                            value={formData.google_link}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      
                      
                      <hr></hr>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">bank_name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="bank_name"
                            name="bank_name"
                            value={formData.bank_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">branch_name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="branch_name"
                            name="branch_name"
                            value={formData.branch_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">bank_ac_number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="bank_ac_number"
                            name="bank_ac_number"
                            value={formData.bank_ac_number}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">ifc_no</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ifc_no"
                            name="ifc_no"
                            value={formData.ifc_no}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <hr></hr>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">ref_no_one</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ref_no_one"
                            name="ref_no_one"
                            value={formData.ref_no_one}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">ref_no_two</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ref_no_two"
                            name="ref_no_two"
                            value={formData.ref_ref_no_twono_one}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">ref_mobile_one</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ref_mobile_one"
                            name="ref_mobile_one"
                            value={formData.ref_mobile_one}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">ref_mobile_two</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ref_mobile_two"
                            name="ref_mobile_two"
                            value={formData.ref_mobile_two}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                     
                      
                      
                    </div>






                    <hr></hr>

                    {/* Submit Button */}
                    <div className="mb-12">
                        <center>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                      </button>
                      </center>
                    </div>
                  </form>
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

export default Registration;

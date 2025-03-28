import React, { useState } from 'react';
import { API_URL } from '../data/apiUrl';

const RegistrationEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gender: '',
    father_name: '',
    mother_name: '',
    father_name_no: '',
    mother_name_no: '',
    date_of_birthday: '',
    mobile_no: '',
    department_id: '',
    designation_id: '',
    cast_name: '',
    address: '',
    contact_number: '',
    user_type: '',
    pan_number: '',
    are_you_fresher: false,
    previous_company: '',
    previous_designation: '',
    reporting_manager_name: '',
    reporting_manager_no: '',
    from_date: '',
    to_date: '',
    experience_details: '',
    higher_qualification: '',
    qualification_year: '',
    percentage: '',
    institute_name: '',
    google_link: '',
    bank_name: '',
    branch_name: '',
    bank_ac_number: '',
    ifsc_no: '',
    ref_no_one: '',
    ref_no_two: '',
    ref_mobile_one: '',
    ref_mobile_two: ''
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Submit the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     // const API_URL = 'http://localhost:5000'; // Replace with your actual API URL

      // Send POST request to the backend API
      const response = await fetch(`${API_URL}/vendor/Registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData) // Send the employee data as payload
      });

      // Check if response is OK
      if (!response.ok) {
        throw new Error('Failed to register employee');
      }

      const data = await response.json();
      console.log('Employee registered successfully:', data);
      // You can reset the form or show a success message here
    } catch (error) {
      console.error('Error registering employee:', error);
    }
  };

  return (
    <div className="gradient-background">
      <center><h2>Employee Registration</h2></center>
      <form onSubmit={handleSubmit}>
        <center>
            <h4>Personal Details</h4>
      <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={employeeData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={employeeData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={employeeData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="gender"
            value={employeeData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
       
      
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="date_of_birthday"
            value={employeeData.date_of_birthday}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mobile No:</label>
          <input
            type="text"
            name="mobile_no"
            value={employeeData.mobile_no}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Department ID:</label>
          <input
            type="text"
            name="department_id"
            value={employeeData.department_id}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Designation ID:</label>
          <input
            type="text"
            name="designation_id"
            value={employeeData.designation_id}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Cast Name:</label>
          <input
            type="text"
            name="cast_name"
            value={employeeData.cast_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={employeeData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            name="contact_number"
            value={employeeData.contact_number}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label>PAN Number:</label>
          <input
            type="text"
            name="pan_number"
            value={employeeData.pan_number}
            onChange={handleChange}
          />
        </div>

        <hr></hr>
        <div>
            <h4>Family Details</h4>
        </div>
        <div>
          <label>Father Name:</label>
          <input
            type="text"
            name="father_name"
            value={employeeData.father_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mother Name:</label>
          <input
            type="text"
            name="mother_name"
            value={employeeData.mother_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Father's Mobile No:</label>
          <input
            type="text"
            name="father_name_no"
            value={employeeData.father_name_no}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mother's Mobile No:</label>
          <input
            type="text"
            name="mother_name_no"
            value={employeeData.mother_name_no}
            onChange={handleChange}
          />
        </div>
        <hr></hr>
        <h4>Work Details</h4>
        <div>
          <label>Are you a fresher?</label>
          <input
            type="checkbox"
            name="are_you_fresher"
            checked={employeeData.are_you_fresher}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Previous Company:</label>
          <input
            type="text"
            name="previous_company"
            value={employeeData.previous_company}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Previous Designation:</label>
          <input
            type="text"
            name="previous_designation"
            value={employeeData.previous_designation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Reporting Manager Name:</label>
          <input
            type="text"
            name="reporting_manager_name"
            value={employeeData.reporting_manager_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Reporting Manager Mobile No:</label>
          <input
            type="text"
            name="reporting_manager_no"
            value={employeeData.reporting_manager_no}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>From Date:</label>
          <input
            type="date"
            name="from_date"
            value={employeeData.from_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>To Date:</label>
          <input
            type="date"
            name="to_date"
            value={employeeData.to_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Experience Details:</label>
          <textarea
            name="experience_details"
            value={employeeData.experience_details}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Higher Qualification:</label>
          <input
            type="text"
            name="higher_qualification"
            value={employeeData.higher_qualification}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Qualification Year:</label>
          <input
            type="text"
            name="qualification_year"
            value={employeeData.qualification_year}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Percentage:</label>
          <input
            type="text"
            name="percentage"
            value={employeeData.percentage}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Institute Name:</label>
          <input
            type="text"
            name="institute_name"
            value={employeeData.institute_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Google Link (LinkedIn, etc.):</label>
          <input
            type="text"
            name="google_link"
            value={employeeData.google_link}
            onChange={handleChange}
          />
        </div>
        
        <hr></hr>
        <h4>Bank Details</h4>
        <div>
          <label>Bank Name:</label>
          <input
            type="text"
            name="bank_name"
            value={employeeData.bank_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Bank Branch Name:</label>
          <input
            type="text"
            name="branch_name"
            value={employeeData.branch_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Bank Account Number:</label>
          <input
            type="text"
            name="bank_ac_number"
            value={employeeData.bank_ac_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>IFSC Code:</label>
          <input
            type="text"
            name="ifsc_no"
            value={employeeData.ifsc_no}
            onChange={handleChange}
          />
        </div>
        <hr></hr>
        <h4>Reference Details</h4>
        <div>
          <label>Reference 1:</label>
          <input
            type="text"
            name="ref_no_one"
            value={employeeData.ref_no_one}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Reference 2:</label>
          <input
            type="text"
            name="ref_no_two"
            value={employeeData.ref_no_two}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Reference Mobile 1:</label>
          <input
            type="text"
            name="ref_mobile_one"
            value={employeeData.ref_mobile_one}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">Reference Mobile 2:</label>
          <input
            type="text"
            name="ref_mobile_two"
            value={employeeData.ref_mobile_two}
            onChange={handleChange}
            className="form-controller"
          />
        </div>

        <button type="submit" className='btn btn-primary btn-sm my-5'>Submit</button>
        </center>
      </form>
    </div>
  );
};

export default RegistrationEmployee;

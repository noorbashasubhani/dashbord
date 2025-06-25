import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const PartnerRegistration = () => {
  const { code } = useParams(); // "S", "P", or "L" from URL
  const navigate = useNavigate();
  const [invalidCode, setInvalidCode] = useState(false);
  const [partnerLabel, setPartnerLabel] = useState('');

  const codeToLabelMap = {
    S: 'Super Partner',
    P: 'Sales Partner',
    L: 'Lead Generator',
  };

  const [employeeData, setEmployeeData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gender: '',
    date_of_birthday: '',
    mobile_no: '',
    pan_number: '',
    bank_name: '',
    branch_name: '',
    bank_ac_number: '',
    ifsc_no: '',
    ref_no_one: '',
    ref_no_two: '',
    ref_mobile_one: '',
    ref_mobile_two: '',
    partner_type: '', // holds S, P, or L
  });

  useEffect(() => {
    if (code && codeToLabelMap[code]) {
      setPartnerLabel(code);
      setEmployeeData((prev) => ({ ...prev, partner_type: code }));
    } else {
      setInvalidCode(true);
      toast.error('Invalid registration link!');
    }
  }, [code]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1).toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const preparedData = {
      ...employeeData,
      first_name: capitalize(employeeData.first_name),
      last_name: capitalize(employeeData.last_name),
    };

    try {
      const response = await fetch(`${API_URL}/vendor/partner-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedData),
      });

      if (!response.ok) throw new Error('Failed to register');

      const data = await response.json();
      toast.success('Partner registered successfully!');
      console.log('Registration success:', data);

      // Reset form
      setEmployeeData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        gender: '',
        date_of_birthday: '',
        mobile_no: '',
        pan_number: '',
        bank_name: '',
        branch_name: '',
        bank_ac_number: '',
        ifsc_no: '',
        ref_no_one: '',
        ref_no_two: '',
        ref_mobile_one: '',
        ref_mobile_two: '',
        partner_type: code,
      });
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error('Registration failed!');
    }
  };

  if (invalidCode) {
    return (
      <div className="container text-center my-5">
        <ToastContainer />
        <h3>Invalid registration link</h3>
        <a href="/" className="btn btn-secondary mt-3">Go to Home</a>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <ToastContainer />
      <center><h2>Partner Registration</h2></center>
      <form onSubmit={handleSubmit} className="row g-3">
        <h4>Personal Details</h4>
        <div className="col-md-4">
          <label className="form-label">First Name</label>
          <input type="text" className="form-control" name="first_name" value={employeeData.first_name} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Last Name</label>
          <input type="text" className="form-control" name="last_name" value={employeeData.last_name} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={employeeData.email} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={employeeData.password} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Gender</label>
          <select className="form-select" name="gender" value={employeeData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" name="date_of_birthday" value={employeeData.date_of_birthday} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Mobile No</label>
          <input type="text" className="form-control" name="mobile_no" value={employeeData.mobile_no} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">PAN Number</label>
          <input type="text" className="form-control" name="pan_number" value={employeeData.pan_number} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Partner Type</label>
          <input type="text" className="form-control" value={partnerLabel} readOnly />
        </div>
        <div className="col-md-4">
          <label className="form-label">User Type</label>
          <input type="text" className="form-control" value="P" readOnly />
        </div>

        <h4>Bank Details</h4>
        <div className="col-md-6">
          <label className="form-label">Bank Name</label>
          <input type="text" className="form-control" name="bank_name" value={employeeData.bank_name} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Branch Name</label>
          <input type="text" className="form-control" name="branch_name" value={employeeData.branch_name} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Account Number</label>
          <input type="text" className="form-control" name="bank_ac_number" value={employeeData.bank_ac_number} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">IFSC Code</label>
          <input type="text" className="form-control" name="ifsc_no" value={employeeData.ifsc_no} onChange={handleChange} />
        </div>

        <h4>Reference Details</h4>
        <div className="col-md-6">
          <label className="form-label">Reference 1</label>
          <input type="text" className="form-control" name="ref_no_one" value={employeeData.ref_no_one} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Reference 2</label>
          <input type="text" className="form-control" name="ref_no_two" value={employeeData.ref_no_two} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Reference Mobile 1</label>
          <input type="text" className="form-control" name="ref_mobile_one" value={employeeData.ref_mobile_one} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Reference Mobile 2</label>
          <input type="text" className="form-control" name="ref_mobile_two" value={employeeData.ref_mobile_two} onChange={handleChange} />
        </div>

        <div className="col-12 text-center my-3">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PartnerRegistration;

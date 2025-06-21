import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { ToastContainer, toast } from 'react-toastify';
import { API_URL } from '../data/apiUrl';

const Payroll = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [show,setShow]=useState(false);
  const [emp,setEmp]=useState(null);
  const [showApprove, setShowApprove] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payDetails, setPayDetails] = useState({
    issuanceDate: '',
    modeOfPay: ''
  });
  const [formData, setFormData] = useState({
  incentives: '',
  advance: '',
  other_deduction: '',
  pf_deduction: '',
  prof_tax: '',
  accident_insurance: '',
  month_year: month, // <-- Add this line
  payslop_status: 'Pending'
});

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
const handlePayDetailChange = (e) => {
    const { name, value } = e.target;
    setPayDetails(prev => ({ ...prev, [name]: value }));
  };
  
   const handleApproveSave = async () => {
  try {
    const payload = {
      issuanceDate: payDetails.issuanceDate,
      modeOfPay:     payDetails.modeOfPay,
      final_pay:     selectedEmployee.final_pay,
      payslop_status:'Completed'
    };
    //alert(selectedEmployee.insent_id);
    const res = await fetch(
      `${API_URL}/vendor/ParrollApprove/${selectedEmployee.insent_id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );
    const result = await res.json();

    if (result.success) {
      toast.success('Payment approved!');
      setShowApprove(false);
      fetchPayroll();    // refresh table with new status
    } else {
      toast.error(result.message || 'Approve failed');
    }
  } catch (err) {
    console.error(err);
    toast.error('Server error while approving');
  }
};


  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/Userlist`);
      const result = await res.json();
      setEmployees(result || []);
    } catch {
      toast.error('Failed to load employees');
    }
  };

  const fetchPayroll = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/payroll/${month}`);
      const result = await res.json();
      if (result.success) setPayrollData(result.data);
      else toast.error(result.message);
    } catch {
      toast.error('Failed to load payroll');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchPayroll();
  }, [statusFilter, month]);


const addFun = (emp_id) => {
  setShow(true);
  setEmp(emp_id);

  const employee = payrollData.find((emp) => emp.emp_id === emp_id);

  if (employee) {
    setFormData({
      incentives: employee.incentives || '',
      advance: employee.advance || '',
      other_deduction: employee.other_deduction || '',
      pf_deduction: employee.pf_deduction || '',
      prof_tax: employee.prof_tax || '',
      accident_insurance: employee.accident_insurance || '',
      month_year: month,
      payslop_status: employee.payslop_status || 'Pending'
    });
  } else {
    // fallback: reset form
    setFormData({
      incentives: '',
      advance: '',
      other_deduction: '',
      pf_deduction: '',
      prof_tax: '',
      accident_insurance: '',
      month_year: month,
      payslop_status: 'Pending'
    });
  }
};


const addInc = async () => {
    //alert(emp);
  try {
    const res = await fetch(`${API_URL}/vendor/Addincentive/${emp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        emp_id: emp // optional: some APIs accept this in body too
      }),
    });

    const result = await res.json();

    if (result.success) {
      toast.success('Payroll details saved!');
      setShow(false);
      fetchPayroll();
    } else {
      toast.error(result.message || 'Save failed');
    }
  } catch (err) {
    toast.error('Error saving payroll');
  }
};
const ApprovePay = (emp_id) => {
  const employee = payrollData.find((emp) => emp.emp_id === emp_id);
  if (employee) {
    setSelectedEmployee(employee);
    setShowApprove(true);
  }
};


  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <h4><i className="bi bi-cash mx-2"></i><b>Payroll</b></h4>
            
            <input
              type="month"
              className="form-control"
              value={month}
              onChange={e => setMonth(e.target.value)}
            />
          </div>
        </div>

        <ToastContainer />

        <section className="section mt-4">
          <div className="card">
            <div className="card-body table-responsive">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Employee Name</th>
                    <th>Month Days</th>
                    <th>Paid Leave</th>
                    <th>Unpaid Leave</th>
                    <th>Working Days</th>
                    <th>CTC/Day</th>
                    <th>CTC/Month</th>
                    <th>Prof. Tax</th>
                    <th>Advance</th>
                    <th>PF Deduction</th>
                    <th>Other Deductions</th>
                    <th>Incentives</th>
                    <th>Insurance</th>
                    <th>Final Pay</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.total_days}</td>
                      <td>{item.paid_leave}</td>
                      <td>{item.unpaid_leave}</td>
                      <td>{item.working_days}</td>
                      <td>{item.ctc_per_day}</td>
                      <td>{item.ctc_per_month}</td>
                      <td>{item.prof_tax}</td>
                      <td>{item.advance}</td>
                      <td>{item.pf_deduction}</td>
                      <td>{item.other_deduction}</td>
                      <td>{item.incentives}</td>
                      <td>{item.accident_insurance}</td>
                      <td>{item.present_salary}</td>
                      <td>
                        {item.payslop_status === 'Completed' ? (
  <button className="btn btn-success btn-sm">Pay Slip</button>
) : ''}
                      <button className="btn btn-sm btn-primary" onClick={()=>addFun(item.emp_id)}>Add</button>
                      <button className="btn btn-sm btn-dark" onClick={()=>ApprovePay(item.emp_id)}>Approve Pay</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payrollData.length === 0 && <div className="text-center mt-3">No data found</div>}
            </div>
          </div>
          {show && (
  <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Enter Payroll Details</h5>
          <button type="button" className="close btn" onClick={() => setShow(false)}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
  {[
    { label: 'Incentive Amount', name: 'incentives' },
    { label: 'Advance Amount', name: 'advance' },
    { label: 'Other Deductions', name: 'other_deduction' },
    { label: 'Provident Fund', name: 'pf_deduction' },
    { label: 'Professional Tax', name: 'prof_tax' },
    { label: 'Accident Insurance', name: 'accident_insurance' },
  ].map(({ label, name }) => (
    <div className="form-group mb-2" key={name}>
      <label>{label}</label>
      <input
        type="number"
        className="form-control"
        name={name}
        value={formData[name]}
        onChange={handleChange}
      />
    </div>
  ))}

  <div className="form-group mb-2">
    <label>Status</label>
    <select
      name="payslop_status"
      className="form-control"
      value={formData.payslop_status}
      onChange={handleChange}
    >
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
    </select>
  </div>
</div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShow(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>addInc()}>Save</button>
        </div>
      </div>
    </div>
  </div>
)}



{showApprove && selectedEmployee && (
  <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Payroll Summary for {selectedEmployee.name}</h5>
          <button type="button" className="btn-close" onClick={() => setShowApprove(false)} />
        </div>
        <div className="modal-body">
          <p><b>Annual Salary:</b> ₹{(selectedEmployee.ctc_per_month * 12).toFixed(2)}</p>
          <p><b>Actual Month Salary:</b> ₹{(+selectedEmployee.ctc_per_month).toFixed(2)}</p>
          <p><b>Current Month Salary:</b> ₹{(+selectedEmployee.present_salary).toFixed(2)}</p>

          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Particulars</th>
                <th>Actual Pay</th>
                <th>Per Month</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const ctc = +selectedEmployee.ctc_per_month;
                const basic = ctc * 45 /100;
                const hras = ctc * 0.50;
                const hra = hras * 0.50;
                const medical = hras * 0.40;
                const other = hras * 0.20;
                const gross = basic + hra + medical + other;


                const ctc_c = +selectedEmployee.present_salary;
                const basic_c = ctc_c * 45 /100;
                const hras_c = ctc_c * 0.50;
                const hra_c = hras_c * 0.50;
                const medical_c = hras_c * 0.40;
                const other_c = hras_c * 0.20;
                const gross_c = basic_c + hra_c + medical_c + other_c;

                return (
                  <>
                    <tr>
                      <td>Basic (45% of CTC)</td>
                      <td>{basic.toFixed(2)}</td>
                      <td>{basic_c.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>HRA (50% of CTC)</td>
                      <td>{hra.toFixed(2)}</td>
                      <td>{hra_c.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Medical (40% of HRA)</td>
                      <td>{medical.toFixed(2)}</td>
                      <td>{medical_c.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Other Allowance (20% of HRA)</td>
                      <td>{other.toFixed(2)}</td>
                      <td>{other_c.toFixed(2)}</td>
                    </tr>
                    <tr className="fw-bold">
                      <td>Gross Salary</td>
                      <td>{gross.toFixed(2)}</td>
                      <td>{gross_c.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td> <input
                        type="date"
                        className="form-control"
                        name="issuanceDate"
                        value={selectedEmployee.issuanceDate}
                        onChange={handlePayDetailChange}
                        required
                      /></td>
                        <td>
                             <select
                        name="modeOfPay"
                        className="form-select"
                        value={selectedEmployee.modeOfPay}
                        onChange={handlePayDetailChange}
                        required
                      >
                        <option value="" disabled>Selected</option>
                        <option value="I">IMPS</option>
                        <option value="R">RTGS</option>
                        <option value="C">Cash</option>
                        <option value="Q">Cheque Deposit</option>
                        <option value="B">Bank Transfer</option>
                      </select>
                        </td>
                        <td colSpan="3" className="text-end">
                                <button
                                  className="btn btn-success"
                                  onClick={handleApproveSave}
                                  disabled={
                                    !payDetails.issuanceDate ||
                                    !payDetails.modeOfPay
                                  }
                                >
                                  Save
                                </button>
                              </td>
                    </tr>
                   
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowApprove(false)}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}

        </section>
      </main>
      <Footer />
    </>
  );
};

export default Payroll;

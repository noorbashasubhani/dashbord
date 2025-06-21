import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../data/apiUrl';

const Attendance = () => {
  const [dataS, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (attendanceDate) {
      fetchSavedAttendance(attendanceDate);
    }
  }, [attendanceDate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/vendor/Userlist`);
      const result = await res.json();
      setData(result || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedAttendance = async (selectedDate) => {
    try {
      const res = await fetch(`${API_URL}/vendor/Attendance/${selectedDate}`);
      const result = await res.json();
      if (result.success) {
        const mapped = {};
        result.data.forEach(entry => {
          mapped[entry.user_id] = entry.attendance_status;
        });
        setAttendanceData(mapped);
      } else {
        toast.error('Could not fetch previous attendance');
      }
    } catch (err) {
      toast.error('Error loading previous attendance');
    }
  };

  const handleAttendanceChange = (userId, status) => {
    setAttendanceData(prev => ({ ...prev, [userId]: status }));
  };

  const saveAttendance = async () => {
    const payload = dataS.map(user => ({
      user_id: user._id,
      attendance_status: attendanceData[user._id] || 'A',
      date: attendanceDate,
    }));

    try {
      const res = await fetch(`${API_URL}/vendor/Attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: payload }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Attendance saved successfully');
      } else {
        toast.error(result.message || 'Failed to save');
      }
    } catch (error) {
      toast.error('Error saving attendance');
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <h4><i className="bi bi-pin-fill mx-2"></i><b>Attendance Details</b></h4>
            <input
              type="date"
              className="form-control"
              style={{ width: '200px' }}
              value={attendanceDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={saveAttendance}>Save Attendance</button>
        </div>
        
        <ToastContainer />

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Mark Attendance</h6>

                  <div className="table-responsive">
                    {loading ? (
                      <div className="text-center">Loading...</div>
                    ) : (
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Employee Code</th>
                            <th>Employee Name</th>
                            <th>Attendance</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataS.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.code}</td>
                              <td>{item.first_name} {item.last_name}</td>
                              <td>
                                <div className="btn-group" role="group">
                                  {[
                                    { id: 'P', label: 'Present', className: 'success' },
                                    { id: 'C', label: 'Casual', className: 'warning' },
                                    { id: 'H', label: 'Half Day', className: 'danger' },
                                    { id: 'L', label: 'LOP', className: 'dark' },
                                    { id: 'O', label: 'Holiday', className: 'info' }
                                  ].map(({ id, label, className }) => (
                                    <React.Fragment key={id}>
                                      <input
                                        type="radio"
                                        className="btn-check"
                                        name={`attendance-${item._id}`}
                                        id={`${id}-${item._id}`}
                                        value={id}
                                        onChange={() => handleAttendanceChange(item._id, id)}
                                        checked={attendanceData[item._id] === id}
                                      />
                                      <label className={`btn btn-outline-${className}`} htmlFor={`${id}-${item._id}`}>{label}</label>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </td>
                              <td>
                                {attendanceData[item._id] ? (
                                  <span className="badge bg-success">
                                    Marked: {
                                      attendanceData[item._id] === 'P' ? 'Present' :
                                      attendanceData[item._id] === 'C' ? 'Casual' :
                                      attendanceData[item._id] === 'H' ? 'Half Day' :
                                      attendanceData[item._id] === 'L' ? 'LOP' :
                                      attendanceData[item._id] === 'O' ? 'Holiday' : 'Absent'}
                                  </span>
                                ) : (
                                  <span className="badge bg-secondary">Not Marked</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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

export default Attendance;

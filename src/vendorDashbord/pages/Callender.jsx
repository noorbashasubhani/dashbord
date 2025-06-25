import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendarStyles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../data/apiUrl';
import { Link } from 'react-router-dom';

const Callendar = () => {
  const [attendanceMonth, setAttendanceMonth] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dayStatusMap, setDayStatusMap] = useState({});

  useEffect(() => {
  getEmp();
}, []);

const getEmp = async () => {
  try {
    const response = await fetch(`${API_URL}/vendor/Userlist`);
    const json = await response.json(); // parse JSON

    if (Array.isArray(json.data)) {
  setEmployees(json.data);
} else {
  console.error('Invalid employee data:', json);
}

  } catch (err) {
    console.log('Fetch error:', err.message);
  }
};



  const handleSearch = async () => {
    if (!selectedEmployee || !attendanceMonth) return;
    try {
      const res = await fetch(
        `${API_URL}/vendor/Attendance/${selectedEmployee}/${attendanceMonth}`
      );
      const result = await res.json();
      if (result.success) {
        const map = {};
        result.data.forEach(entry => {
          const key = normalizeDate(entry.date);
          map[key] = entry.attendance_status;
        });
        setDayStatusMap(map);
      } else {
        toast.error(result.message || 'No attendance data found');
      }
    } catch {
      toast.error('Error fetching attendance');
    }
  };

  const normalizeDate = date => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
  };

  const cycleStatus = current => {
    const order = ['A', 'P', 'C', 'H', 'L', 'O'];
    const idx = order.indexOf(current);
    return order[(idx + 1) % order.length];
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <h4><b>Attendance Calendar</b></h4>
            <select
              className="form-select"
              value={selectedEmployee}
              onChange={e => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
            <input
              type="month"
              className="form-control"
              value={attendanceMonth}
              onChange={e => setAttendanceMonth(e.target.value)}
            />
            <button className="btn btn-dark" onClick={handleSearch}>
              Search
            </button>
            <Link to="/Add-Attendance" className="btn btn-sm btn-primary">
              Attendance
            </Link>
          </div>
        </div>

        <ToastContainer />

        <section className="section mt-4">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Calendar View</h6>

                  <Calendar
                    locale="en-GB"
                    value={new Date(`${attendanceMonth}-01`)}
                    minDate={new Date(`${attendanceMonth}-01`)}
                    maxDate={
                      new Date(
                        new Date(`${attendanceMonth}-01`).getFullYear(),
                        new Date(`${attendanceMonth}-01`).getMonth() + 1,
                        0
                      )
                    }
                    defaultView="month"
                    navigationLabel={() => null}
                    onClickDay={date => {
                      if (!selectedEmployee) {
                        toast.error('Select an employee first');
                        return;
                      }
                      const key = normalizeDate(date);
                      const current = dayStatusMap[key] || 'A';
                      const next = cycleStatus(current);
                      // Optimistic update
                      setDayStatusMap(prev => ({ ...prev, [key]: next }));
                      // Background save
                      (async () => {
                        try {
                          await fetch(`${API_URL}/vendor/Attendance`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              records: [{
                                user_id: selectedEmployee,
                                date: date.toISOString(),
                                attendance_status: next
                              }]
                            })
                          });
                          // toast.success('Saved');
                        } catch {
                          toast.error(`Failed to save ${key}`);
                          // rollback
                          setDayStatusMap(prev => ({ ...prev, [key]: current }));
                        }
                      })();
                    }}
                    tileClassName={({ date, view }) => {
                      if (view !== 'month') return '';
                      const status = dayStatusMap[normalizeDate(date)];
                      switch (status) {
                        case 'P': return 'present';
                        case 'C': return 'casual';
                        case 'H': return 'halfday';
                        case 'L': return 'lop';
                        case 'O': return 'holiday';
                        default: return 'absent';
                      }
                    }}
                  />

                  <div className="mt-4">
                    <h6>Legend:</h6>
                    <div className="d-flex gap-3 flex-wrap">
                      <span className="legend present">Present</span>
                      <span className="legend casual">Casual</span>
                      <span className="legend halfday">Half Day</span>
                      <span className="legend lop">LOP</span>
                      <span className="legend holiday">Holiday</span>
                      <span className="legend absent">Absent</span>
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

export default Callendar;

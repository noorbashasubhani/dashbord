import React, { useEffect, useState } from 'react';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';
import SideMenu from '../components/SideBar';
import Footer from '../components/forms/Footer';

const DailySalesReport = () => {
  const [sales, setSales] = useState([]);
  const [teams, setTeams] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/all`);
      const result = await res.json();
      setSales(result.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeamsAndUsers = async () => {
    try {
      const [teamRes, userRes] = await Promise.all([
        fetch(`${API_URL}/vendor/Teams`),
        fetch(`${API_URL}/vendor/Userlist`)
      ]);
      const [teamsData, usersData] = await Promise.all([
        teamRes.json(),
        userRes.json()
      ]);
      setTeams(teamsData.data || []);
      setExecutives(usersData.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchTeamsAndUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`${API_URL}/daily-sales/delete/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        fetchSales();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  // 🔎 Filter sales by selected month
  const filteredSales = selectedMonth
    ? sales.filter(item => item.year_month === selectedMonth)
    : sales;

  return (
    <>
      <NavBar />
      <SideMenu />
      <main id="main" className="main">
        <div className="container mt-4">
          <h4><b>Daily Sales Report</b></h4>

          <div className="row align-items-end mb-3">
            <div className="col-md-4">
              <label><b>Select Month</b></label>
              <input
                type="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          </div>

          {teams.map((team) => {
            const teamSales = filteredSales.filter(item => item.team_id?._id === team._id);
            if (teamSales.length === 0) return null;

            return (
              <div key={team._id} className="mb-5 border rounded p-3 shadow-sm bg-white">
                <h5 className="text-primary mb-3">
                  <b>{team.team_name}</b> - Sales Report
                </h5>

                {teamSales.map((report, reportIdx) => (
                  <div key={report._id} className="mb-4">
                    <h6 className="mb-2 text-secondary">
                      <i className="bi bi-calendar2-week me-1"></i>Month: <b>{report.year_month}</b>
                    </h6>

                    <table className="table table-bordered table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Executive</th>
                          <th>Confirms</th>
                          <th>Target</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {report.executive_ids.map((exec, idx) => (
                          <tr key={exec._id}>
                            <td>{idx + 1}</td>
                            <td>{exec.first_name} {exec.last_name}</td>
                            <td>{report.no_of_confirms[idx]}</td>
                            <td>{report.targets[idx]}</td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            );
          })}

          {filteredSales.length === 0 && (
            <div className="text-center text-muted mt-4">No data available</div>
          )}

          <ToastContainer />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DailySalesReport;

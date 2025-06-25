import React, { useEffect, useState } from 'react';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import NavBar from '../components/NavBar';
import SideMenu from '../components/SideBar';
import Footer from '../components/forms/Footer';

const DailySales = () => {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    team_id: '',
    executive_ids: [],
    year_month: '',
    no_of_confirms: [],
    targets: []
  });
  const [teams, setTeams] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [editId, setEditId] = useState(null);

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

  const handleChange = (index, field, value) => {
    const updated = [...form[field]];
    updated[index] = Number(value);
    setForm(prev => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `${API_URL}/vendor/update/${editId}`
      : `${API_URL}/vendor/add`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        setForm({ team_id: '', executive_ids: [], year_month: '', no_of_confirms: [], targets: [] });
        setEditId(null);
        fetchSales();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  const handleExecutiveSelect = (selectedIds) => {
  const newNoOfConfirms = [];
  const newTargets = [];

  selectedIds.forEach(id => {
    const idx = form.executive_ids.indexOf(id);
    newNoOfConfirms.push(idx !== -1 ? form.no_of_confirms[idx] : 0);
    newTargets.push(idx !== -1 ? form.targets[idx] : 0);
  });

  setForm(prev => ({
    ...prev,
    executive_ids: selectedIds,
    no_of_confirms: newNoOfConfirms,
    targets: newTargets
  }));
};


  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      team_id: item.team_id._id,
      executive_ids: item.executive_ids.map(e => e._id),
      year_month: item.year_month,
      no_of_confirms: item.no_of_confirms,
      targets: item.targets
    });
  };

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

  return (
    <>
    <NavBar />
    <SideMenu />
    <main id="main" className="main">
    <div className="container mt-4">
      <h4><b>Daily Sales Management</b></h4>
      <form onSubmit={handleSubmit} className="border p-3 my-3 rounded bg-light">
        <div className="row mb-2">
          <div className="col-md-3">
            <label>Team</label>
            <select
              className="form-select"
              value={form.team_id}
              onChange={(e) => setForm({ ...form, team_id: e.target.value })}
              required
            >
              <option value="">Select Team</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.team_name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label>Month (YYYY-MM)</label>
            <input
              type="month"
              className="form-control"
              value={form.year_month}
              onChange={(e) => setForm({ ...form, year_month: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <label>Select Executives</label>
            <Select
              isMulti
              options={executives.map(user => ({
                value: user._id,
                label: `${user.first_name} ${user.last_name}`
              }))}
              value={executives
                .filter(user => form.executive_ids.includes(user._id))
                .map(user => ({
                  value: user._id,
                  label: `${user.first_name} ${user.last_name}`
                }))
              }
              onChange={(selectedOptions) => {
                const selectedIds = selectedOptions.map(opt => opt.value);
                handleExecutiveSelect(selectedIds);
              }}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        </div>

        {form.executive_ids.map((id, idx) => {
          const user = executives.find(u => u._id === id);
          return (
            <div key={id} className="row align-items-center mb-2">
              <div className="col-md-4">
                <strong>{user?.first_name} {user?.last_name}</strong>
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Confirm Bookings"
                  value={form.no_of_confirms[idx]}
                  onChange={(e) => handleChange(idx, 'no_of_confirms', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Target"
                  value={form.targets[idx]}
                  onChange={(e) => handleChange(idx, 'targets', e.target.value)}
                  required
                />
              </div>
            </div>
          );
        })}

        <button type="submit" className="btn btn-primary">
          {editId ? 'Update' : 'Add'} Entry
        </button>
      </form>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Month</th>
            <th>Executives</th>
            <th>Confirms</th>
            <th>Targets</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.team_id?.team_name || 'N/A'}</td>
              <td>{item.year_month}</td>
              <td>
                {item.executive_ids.map(e => `${e.first_name} ${e.last_name}`).join(', ')}
              </td>
              <td>{item.no_of_confirms.join(', ')}</td>
              <td>{item.targets.join(', ')}</td>
              <td>
                <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {sales.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
    </main>
    <Footer />
    </>
  );
};

export default DailySales;

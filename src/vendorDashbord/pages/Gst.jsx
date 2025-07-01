import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { useNavigate } from 'react-router-dom';

const Gst = () => {
  const navigate = useNavigate();
  const [ltaList, setLtaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLtaData = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/lta`);
      const data = await res.json();
      if (res.ok) {
        setLtaList(data.data || []);
      } else {
        console.error('Failed to fetch LTA data:', data.message);
      }
    } catch (err) {
      console.error('Error fetching LTA list:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLtaData();
  }, []);

  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this LTA?')) return;

  try {
    const res = await fetch(`${API_URL}/vendor/lta/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (res.ok) {
      alert('Deleted successfully');
      fetchLtaData(); // Refresh list
    } else {
      alert(result.message || 'Delete failed');
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('Error deleting LTA');
  }
};


  return (
    <>
     
      
        <h5 className="mb-3">LTA Records</h5>

        <button className="btn btn-primary mb-3" onClick={() => navigate('/add-lta')}>
          Add LTA
        </button>

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Gogaga Ref No</th>
              <th>Invoice No</th>
              <th>Date</th>
              <th>GST</th>
              <th>Total Cost (Incl. GST)</th>
              <th>Pending</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">Loading...</td>
              </tr>
            ) : ltaList.length > 0 ? (
              ltaList.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.gogaga_reference_no}</td>
                  <td>{item.invoice_no}</td>
                  <td>{item.date_of_issue?.split('T')[0]}</td>
                  <td>{item.gst_amount}</td>
                  <td>{item.total_cab_cost_incl_gst}</td>
                  <td>{item.pending_payment}</td>
                  <td>
                    <td>
  <button
    className="btn btn-sm btn-info me-1"
    onClick={() => navigate(`/edit-lta/${item._id}`)}
  >
    Edit
  </button>
  <button
    className="btn btn-sm btn-danger"
    onClick={() => handleDelete(item._id)}
  >
    Delete
  </button>
</td>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      
    </>
  );
};

export default Gst;

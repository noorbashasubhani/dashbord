import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl'; // Adjust path as needed

const HolidaySummary = ({ customerData, row_id }) => {
  const [showForm, setShowForm] = useState(false);
  const [destin,setDestin]=useState([]);
  const [formData, setFormData] = useState({
    holiday_destination: '',
    start_date: '',
    end_date: '',
    duration: ''
  });

  useEffect(() => {
    destinationlist();
    if (customerData) {
      setFormData({
        holiday_destination: customerData.holiday_destination || '',
        start_date: customerData.start_date || '',
        end_date: customerData.end_date || '',
        duration: customerData.duration || ''
      });
    }
  }, [customerData]);

  // Calculate duration
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, duration: days > 0 ? days : 0 }));
    }
  }, [formData.start_date, formData.end_date]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Customer-inf/${row_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Holiday information updated successfully");
        setShowForm(false);
      } else {
        alert("Failed to update holiday information");
      }
    } catch (error) {
      alert("Error updating data");
      console.error(error);
    }
  };


  const destinationlist=async()=>{

     try{
        const response=await fetch(`${API_URL}/vendor/Domestic-Destination`);
        if(!response.ok){
          throw new Error('This is not link');
        }
        const result=await response.json();
        setDestin(result.data);
     }catch(err){
        console.log(err.message);
     }

  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>
              Holidays Information
            </h3>
            <button className="btn btn-sm btn-primary my-2" onClick={() => setShowForm(true)}>
              Update Holiday Information
            </button>

            <div className="table-responsive">
              <table className="table table-striped table-rounded">
                <thead>
                  <tr>
                    <th>Holiday Destination</th>
                    <th>Trip Start Date</th>
                    <th>Trip End Date</th>
                    <th>Trip Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formData.holiday_destination.destination_name || 'N/A'}</td>
                    <td>{formData.start_date || 'N/A'}</td>
                    <td>{formData.end_date || 'N/A'}</td>
                    <td>{formData.duration || 'N/A'} days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {showForm && (
              <div style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '10px',
                background: '#f9f9f9',
                marginTop: '20px'
              }}>
                <h5>Edit Holiday Info</h5>
                <div className="form-group my-2">
                  <label>Holiday Destination</label>
                 
                  <select className="form-control" value={formData.holiday_destination?._id || ''} name="holiday_destination"
                    onChange={(e) => {
    const selected = destin.find(d => d._id === e.target.value);
    setFormData({ ...formData, holiday_destination: selected });
  }}
                   >
                    <option value="">---Select Holidays ---</option>
                    {destin.length > 0 ? (

                    destin.map((items,index)=>(
                      <option value={items._id}>{items.destination_name}</option>
                    ))
                  
                    ):(<option>No Data Found</option>) }
                    
                  </select>
                </div>
                <div className="form-group my-2">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="form-group my-2">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div className="form-group my-2">
                  <label>Duration (auto-calculated)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    readOnly
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-success" onClick={handleUpdate}>Save</button>
                  <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidaySummary;

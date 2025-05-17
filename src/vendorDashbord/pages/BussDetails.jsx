import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';

const BussDetails = ({ customerData, row_id }) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!customerData); // True if editing
  const [formData, setFormData] = useState({
    fare_source: '',
    bus_name: '',
    start_datetime: '',
    reach_datetime: '',
    start_city: '',
    reach_city: '',
    journey_duration: '',
    bus_class: '',
    seats_available: '',
    cost_considered: '',
    loading_on_bus: '',
    total_bus_fare: ''
  });

  useEffect(() => {
    if (customerData) {
      setFormData({
        fare_source: customerData.fare_source || '',
        bus_name: customerData.bus_name || '',
        start_datetime: customerData.start_datetime || '',
        reach_datetime: customerData.reach_datetime || '',
        start_city: customerData.start_city || '',
        reach_city: customerData.reach_city || '',
        journey_duration: customerData.journey_duration || '',
        bus_class: customerData.bus_class || '',
        seats_available: customerData.seats_available || '',
        cost_considered: customerData.cost_considered || '',
        loading_on_bus: customerData.loading_on_bus || '',
        total_bus_fare: customerData.total_bus_fare || ''
      });
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [customerData]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/updatebus/${row_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Bus information updated successfully");
        setShowForm(false);
      } else {
        alert("Failed to update bus information");
      }
    } catch (error) {
      alert("Error updating data");
      console.error(error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/addbus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Bus information added successfully");
        setShowForm(false);
      } else {
        alert("Failed to add bus information");
      }
    } catch (error) {
      alert("Error adding data");
      console.error(error);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Bus Information</h3>
            <button
              className="btn btn-sm btn-primary my-2"
              onClick={() => {
                setFormData({
                  fare_source: '',
                  bus_name: '',
                  start_datetime: '',
                  reach_datetime: '',
                  start_city: '',
                  reach_city: '',
                  journey_duration: '',
                  bus_class: '',
                  seats_available: '',
                  cost_considered: '',
                  loading_on_bus: '',
                  total_bus_fare: ''
                });
                setIsEditMode(false);
                setShowForm(true);
              }}
            >
              + Add Bus
            </button>

            <div className="table-responsive">
              <table className="table table-striped table-rounded">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Fare Source</th>
                    <th>Bus Name</th>
                    <th>Start Date & Time</th>
                    <th>Reach Date & Time</th>
                    <th>Start City</th>
                    <th>Reach City</th>
                    <th>Journey Duration</th>
                    <th>Class</th>
                    <th>Seats Availability</th>
                    <th>Cost Considered</th>
                    <th>Loading on Bus</th>
                    <th>Total Bus Fare</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{formData.fare_source}</td>
                    <td>{formData.bus_name}</td>
                    <td>{formData.start_datetime}</td>
                    <td>{formData.reach_datetime}</td>
                    <td>{formData.start_city}</td>
                    <td>{formData.reach_city}</td>
                    <td>{formData.journey_duration}</td>
                    <td>{formData.bus_class}</td>
                    <td>{formData.seats_available}</td>
                    <td>{formData.cost_considered}</td>
                    <td>{formData.loading_on_bus}</td>
                    <td>{formData.total_bus_fare}</td>
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
                <h5>{isEditMode ? 'Edit Bus Info' : 'Add Bus Info'}</h5>
                {[ 
                  { name: 'fare_source', label: 'Fare Source' },
                  { name: 'bus_name', label: 'Bus Name' },
                  { name: 'start_datetime', label: 'Start Date & Time', type: 'datetime-local' },
                  { name: 'reach_datetime', label: 'Reach Date & Time', type: 'datetime-local' },
                  { name: 'start_city', label: 'Start City' },
                  { name: 'reach_city', label: 'Reach City' },
                  { name: 'journey_duration', label: 'Journey Duration (e.g. 5h 30m)' },
                  { name: 'bus_class', label: 'Class' },
                  { name: 'seats_available', label: 'Seats Availability', type: 'number' },
                  { name: 'cost_considered', label: 'Cost Considered', type: 'number' },
                  { name: 'loading_on_bus', label: 'Loading on Bus', type: 'number' },
                  { name: 'total_bus_fare', label: 'Total Bus Fare', type: 'number' }
                ].map(({ name, label, type = 'text' }) => (
                  <div className="form-group my-2" key={name}>
                    <label>{label}</label>
                    <input
                      type={type}
                      className="form-control"
                      value={formData[name]}
                      onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-success" onClick={isEditMode ? handleUpdate : handleAdd}>
                    {isEditMode ? 'Update' : 'Add'}
                  </button>
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

export default BussDetails;

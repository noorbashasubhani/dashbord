import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';

const BussDetails = ({ customerData, row_id,onUpdate }) => {
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

  const [busDetails, setBusDetails] = useState([]); // Store fetched bus data
  const [loading, setLoading] = useState(true); // For loading state

  // Fetch bus details from the API
  useEffect(() => {

   
  
    if (formData.seats_available && formData.cost_considered && formData.loading_on_bus) {
      const seats = parseFloat(formData.seats_available);
      const cost = parseFloat(formData.cost_considered);
      const loading = parseFloat(formData.loading_on_bus) / 100;
      const  costonly = seats * cost;
      const totalFare = seats * cost * loading;
      const totalfinals=totalFare+costonly;
      setFormData(prev => ({
        ...prev,
        total_bus_fare: totalfinals.toFixed(2) // Format to 2 decimal places
      }));
    }
    fetchBusDetails(); // Fetch data on mount
  }, [formData.seats_available, formData.cost_considered, formData.loading_on_bus,row_id]); // Empty dependency array ensures it only runs once when the component mounts


   const fetchBusDetails = async () => {
      try {
        
        const response = await fetch(`${API_URL}/vendor/getBussrel/${row_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBusDetails(data.data); // Set bus details to state
          if (onUpdate) onUpdate();
        } else {
          alert("Failed to fetch bus details");
        }
      } catch (error) {
        alert("Error fetching bus details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  // Handle the addition of new bus info
  const handleAdd = async () => {
  
    try {
      const response = await fetch(`${API_URL}/vendor/Addbus/${row_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      fetchBusDetails();
      if (response.ok) {
        //alert("Bus information added successfully");
        setShowForm(false);
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
      } else {
        alert("Failed to add bus information");
      }
    } catch (error) {
      alert("Error adding bus information");
      console.error(error);
    }
  };

  // Handle updating existing bus info
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Bus/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Bus information updated successfully");
        setShowForm(false);
      } else {
        alert("Failed to update bus information");
      }
      fetchBusDetails();
    } catch (error) {
      alert("Error updating data");
      console.error(error);
    }
  };

  // Set form data when selecting a bus entry to edit
  const handleEdit = (bus) => {
   setFormData({ ...bus }); 
    setIsEditMode(true);
    setShowForm(true);
  };
  const handDel=async(id)=>{
    try{
       const Del=await fetch(`${API_URL}/vendor/Delbus/${id}`,{
        method:'delete'
       });
       fetchBusDetails();
    }catch(err){
      console.log(err.message);
    }
  }

  if (loading) return <div>Loading...</div>; // Show loading indicator

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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
    busDetails.length > 0 ? (
    busDetails.map((bus, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{bus.fare_source}</td>
        <td>{bus.bus_name}</td>
        <td>{new Date(bus.start_datetime).toLocaleString()}</td>
        <td>{new Date(bus.reach_datetime).toLocaleString()}</td>
        <td>{bus.start_city}</td>
        <td>{bus.reach_city}</td>
        <td>{bus.journey_duration}</td>
        <td>{bus.bus_class}</td>
        <td>{bus.seats_available}</td>
        <td>{bus.cost_considered}</td>
        <td>{bus.loading_on_bus}</td>
        <td>{bus.total_bus_fare}</td>
        <td>
          <button className="btn btn-sm btn-warning" onClick={() => handleEdit(bus)}> Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => handDel(bus._id)}> Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="14" className="text-center text-muted">
        No bus records found.
      </td>
    </tr>
  )
}

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

    {/** FIELD CONFIGURATION */}
    {[
      { name: 'fare_source', label: 'Fare Source' },
      { name: 'bus_name', label: 'Bus Name' },
      { name: 'start_datetime', label: 'Start Date & Time', type: 'datetime-local' },
      { name: 'reach_datetime', label: 'Reach Date & Time', type: 'datetime-local' },
      { name: 'start_city', label: 'Start City' },
      { name: 'reach_city', label: 'Reach City' },
      { name: 'journey_duration', label: 'Journey Duration (e.g. 5h 30m)' },
      { name: 'bus_class', label: 'Class', type: 'select', options: ['AC', 'Non-AC', 'Sleeper', 'Seater'] },
      { name: 'seats_available', label: 'Seats Availability', type: 'number' },
      { name: 'cost_considered', label: 'Cost Considered', type: 'number' },
      { name: 'loading_on_bus', label: 'Loading on Bus', type: 'number' },
      { name: 'total_bus_fare', label: 'Total Bus Fare', type: 'number' }
    ]
      // Split into chunks of 4 fields
      .reduce((rows, field, index, allFields) => {
        if (index % 4 === 0) rows.push(allFields.slice(index, index + 4));
        return rows;
      }, [])
      .map((row, i) => (
        <div className="row" key={i}>
          {row.map(({ name, label, type = 'text' }) => (
            <div className="col-md-3" key={name}>
              <div className="form-group my-2">
                <label>{label}</label>
                <input
                  type={type}
                  className="form-control"
                  value={formData[name]}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      ))}

    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
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

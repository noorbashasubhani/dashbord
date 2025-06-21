import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import Select from 'react-select';


const Visa = ({ customerData, row_id, onUpdate }) => {
  const [visaData, setVisaData] = useState([]);
  const [form, setForm] = useState({
    destination_id: [],
    nationality: '',
    cost_per_person: '',
    no_of_pax: '',
    total_cost: ''
  });
  const [destinations, setDestinations] = useState([]);


  const fetchVisaData = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Visa/${row_id}`);
        const data = await response.json();
        setVisaData(data);
      } catch (err) {
        console.error('Error fetching visa data:', err);
      }
    };
  // Fetch visa data
  useEffect(() => {
    

    if (row_id) {
      fetchVisaData();
    }
  }, [row_id]);

  useEffect(() => {
  const total =
    parseInt(form.no_of_pax || 0) * parseFloat(form.cost_per_person || 0);
  setForm((prev) => ({ ...prev, total_cost: total.toFixed(2) }));
}, [form.no_of_pax, form.cost_per_person]);

  // Fetch destination data
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Destination`);
        const data = await response.json();
        setDestinations(data.data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      }
    };

    fetchDestinations();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (selectedOptions) => {
  const selectedIds = selectedOptions.map(option => option.value);
  setForm({ ...form, destination_id: selectedIds });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!row_id) return alert("Row ID (doc_id) missing!");

    try {
      const response = await fetch(`${API_URL}/vendor/Visa/${row_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Failed to save visa data');
      }

    
      fetchVisaData();
     // const refreshedData = await refreshed.json();
     // setVisaData(refreshedData);
    } catch (err) {
      console.error(err);
      alert("Error saving visa data");
    }
  };

  return (
    <div className="row mt-5">
      <div className="col-lg-12" style={{ backgroundColor: '#e5550d' }}>
        <div className="card p-3">
          <h3 style={{ fontSize: '16px' }}>Add Visa Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3">
                <label>Destinations</label>
                <Select
  isMulti
  name="destination_id"
  options={destinations.map(dest => ({
    value: dest._id,
    label: dest.destination_name
  }))}
  value={destinations
    .filter(dest => form.destination_id.includes(dest._id))
    .map(dest => ({ value: dest._id, label: dest.destination_name }))
  }
  onChange={handleMultiSelectChange}
  className="basic-multi-select"
  classNamePrefix="select"
/>
              </div>
              <div className="col-md-2">
                <label>Nationality</label>
                <input
                  type="text"
                  className="form-control"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <label>No of Pax</label>
                <input
                  type="number"
                  className="form-control"
                  name="no_of_pax"
                  value={form.no_of_pax}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <label>Cost Per Person</label>
                <input
                  type="number"
                  className="form-control"
                  name="cost_per_person"
                  value={form.cost_per_person}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <label>Total Cost</label>
                <input
  type="number"
  className="form-control"
  name="total_cost"
  value={form.total_cost}
  onChange={handleChange}
/>
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button className="btn btn-success btn-sm" type="submit">Add</button>
              </div>
            </div>
          </form>
        </div>

        <table className="table table-striped table-bordered table-sm small mt-3">
          <thead>
            <tr>
              <th>Destination Names</th>
              <th>Nationality</th>
              <th>No of Pax</th>
              <th>Cost Per Person</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {visaData.map((visa, index) => (
              <tr key={index}>
                <td>{visa.destination_id.map(dest => dest.destination_name).join(', ')}</td>
                <td>{visa.nationality}</td>
                <td>{visa.no_of_pax}</td>
                <td>{visa.cost_per_person}</td>
                <td>{visa.total_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Visa;

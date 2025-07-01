import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';

// ✅ Initial form state constant
const initialFormState = {
  hotel_id: '',
  hotel_rating: '',
  location: '',
  contact_person: '',
  contact_number: '',
  check_in_date: '',
  check_out_date: '',
  in_time: '',
  out_time: '',
  meals_plan: '',
  single_room_cost: 0,
  double_room_cost: 0,
  triple_room_cost: 0,
  extra_room_cost: 0,
  no_of_single_rooms: 0,
  no_of_double_rooms: 0,
  no_of_triple_rooms: 0,
  no_of_extra_rooms: 0,
  no_of_single_room_nights: 0,
  no_double_room_nights: 0,
  no_of_triple_room_nights: 0,
  no_of_extra_room_nights: 0,
  single_category: '',
  double_category: '',
  triple_category: '',
  extra_category: '',
  cost_for_single: 0,
  cost_for_double: 0,
  cost_for_triple: 0,
  cost_for_extra: 0,
  final_cost: 0
};

const DomestciHotels = ({ leads, row_id, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [formHotels, setForHotels] = useState([]);
  const [form, setForm] = useState(initialFormState);

  // ✅ Fetch all hotel options and this lead's hotel entries
  useEffect(() => {
    getHotels();
    getHotelsData();
    
  }, []);

  const getHotels = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/Gethotels`);
      const data = await res.json();
      setHotels(data.data);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.log(err.message);
    }
  };

  const getHotelsData = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/Domestic-Hotel/${row_id}`);
      const data = await res.json();
      setForHotels(data.data);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === 'hotel_id') {
      const selectedHotel = hotels.find(h => h._id === value);
      setForm({
        ...form,
        hotel_id: value,
        hotel_rating: selectedHotel?.hotel_rating || '',
        location: selectedHotel?.hotel_city || '',
        contact_person: selectedHotel?.contact_person || '',
        contact_number: selectedHotel?.contact_no || '',
      });
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  // ✅ Auto calculate cost and nights
  useEffect(() => {
    const {
      check_in_date, check_out_date,
      single_room_cost, no_of_single_rooms,
      double_room_cost, no_of_double_rooms,
      triple_room_cost, no_of_triple_rooms,
      extra_room_cost, no_of_extra_rooms
    } = form;

    let number_of_nights = 0;
    if (check_in_date && check_out_date) {
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const diffTime = checkOut - checkIn;
      number_of_nights = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
    }

    const updatedForm = {
      no_of_single_room_nights: number_of_nights,
      no_double_room_nights: number_of_nights,
      no_of_triple_room_nights: number_of_nights,
      no_of_extra_room_nights: number_of_nights,
      cost_for_single: single_room_cost * no_of_single_rooms * number_of_nights,
      cost_for_double: double_room_cost * no_of_double_rooms * number_of_nights,
      cost_for_triple: triple_room_cost * no_of_triple_rooms * number_of_nights,
      cost_for_extra: extra_room_cost * no_of_extra_rooms * number_of_nights,
    };

    updatedForm.final_cost = Object.values(updatedForm).slice(4).reduce((acc, val) => acc + val, 0);

    setForm(prev => ({ ...prev, ...updatedForm }));
  }, [
    form.check_in_date, form.check_out_date,
    form.single_room_cost, form.no_of_single_rooms,
    form.double_room_cost, form.no_of_double_rooms,
    form.triple_room_cost, form.no_of_triple_rooms,
    form.extra_room_cost, form.no_of_extra_rooms
  ]);

  // ✅ Submit or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = form._id ? 'PUT' : 'POST';
      const url = form._id
        ? `${API_URL}/vendor/Domestic-Hotel/${form._id}`
        : `${API_URL}/vendor/Domestic-Hotel/${row_id}`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Failed to save hotel details');
      toast.success(form._id ? 'Updated successfully' : 'Added successfully');
      setShowModal(false);
      setForm(initialFormState);
      await getHotelsData();
      if (onUpdate) onUpdate(); // ✅ Ensure totals refresh
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const delFun = async (del_id) => {
    try {
      const res = await fetch(`${API_URL}/vendor/Domestic-Hotel/${del_id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Data not deleted');
      await getHotelsData();
      if (onUpdate) onUpdate(); // ✅ Ensure totals refresh
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEditClick = (hotelData) => {
    setShowModal(true);
    setForm({
      ...hotelData,
      hotel_id: hotelData.hotel_id?._id || ''
    });
  };
  return (
    <Layout>
      <div className="row mt-5">
        <div className="col-lg-12" style={{ backgroundColor: 'lightblue' }}>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title" style={{ fontSize: '16px' }}>Hotel Details</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                + Add Hotel
              </button>
              <div className="table-responsive mt-4">
              <table className="table table-bordered">
  <thead>
    <tr>
      <th>Hotel Name</th>
      <th>Rating</th>
      <th>Location</th>
      <th>Contact Person</th>
      <th>Contact Number</th>
      <th>Check-In</th>
      <th>Check-Out</th>
      <th>Meals Plan</th>
      <th>Single Room Cost</th>
      <th>Double Room Cost</th>
      <th>Triple Room Cost</th>
      <th>Extra Room Cost</th>
      <th>Final Cost</th>
      <th>Action</th>
      {/* Add other fields as needed */}
    </tr>
  </thead>
  <tbody>
    {formHotels.map((hotel, index) => (
      <tr key={index}>
        <td>{hotel.hotel_id?.hotel_name || 'N/A'}</td>
        <td>{hotel.hotel_rating}</td>
        <td>{hotel.location}</td>
        <td>{hotel.contact_person}</td>
        <td>{hotel.contact_number}</td>
        <td>{hotel.check_in_date}</td>
        <td>{hotel.check_out_date}</td>
        <td>{hotel.meals_plan}</td>
        <td>{hotel.single_room_cost}</td>
        <td>{hotel.double_room_cost}</td>
        <td>{hotel.triple_room_cost}</td>
        <td>{hotel.extra_room_cost}</td>
        <td>{hotel.final_cost}</td>
        <td><button onClick={()=>delFun(hotel._id)} className="btn btn-sm btn-danger">Delete</button>
            <button className="btn btn-sm btn-warning" onClick={() => handleEditClick(hotel)}>Edit</button>

        </td>
        {/* Add more <td> for additional fields */}
      </tr>
    ))}
  </tbody>
</table>
</div>
              <div className="table-responsive mt-4">
                {showModal && (
                  <form onSubmit={handleSubmit}>
                    <h4 className="mb-3">Add Hotel Details</h4>
                    
                    {/* Basic Info */}
   <div className="row mb-3">
      <div className="col-md-3">
      
      <select
  name="hotel_id"
  value={form.hotel_id || ''}  // ensure it's always a string
  onChange={handleChange}
  className="form-control"
>
  <option value="">-- Select Hotel --</option>
  {(hotels || []).map((hotel) => (
    <option key={hotel._id} value={hotel._id}>
      {hotel.hotel_name}
    </option>
  ))}
</select>

    </div>
  <div className="col-md-2">
    <input
      type="text"
      name="hotel_rating"
      value={form.hotel_rating}
      onChange={handleChange}
      placeholder="Hotel Rating"
      className="form-control"
    />
  </div>
  <div className="col-md-2">
    <input
      type="text"
      name="location"
      value={form.location}
      onChange={handleChange}
      placeholder="Location"
      className="form-control"
    />
  </div>
  <div className="col-md-2">
    <input
      type="text"
      name="contact_person"
      value={form.contact_person}
      onChange={handleChange}
      placeholder="Contact Person"
      className="form-control"
    />
  </div>
  <div className="col-md-2">
    <input
      type="text"
      name="contact_number"
      value={form.contact_number}
      onChange={handleChange}
      placeholder="Contact Number"
      className="form-control"
    />
  </div>
</div>
 
                    <div className="row mb-3">
  <div className="col-md-2">
    <input
      type="date"
      name="check_in_date"
      value={form.check_in_date}
      onChange={handleChange}
      className="form-control"
      placeholder="Check-In Date"
    />
  </div>
  <div className="col-md-2">
    <input
      type="date"
      name="check_out_date"
      value={form.check_out_date}
      onChange={handleChange}
      className="form-control"
      placeholder="Check-Out Date"
    />
  </div>
  <div className="col-md-2">
    <input
      type="time"
      name="in_time"
      value={form.in_time}
      onChange={handleChange}
      className="form-control"
      placeholder="In Time"
    />
  </div>
  <div className="col-md-3">
    <input
      type="time"
      name="out_time"
      value={form.out_time}
      onChange={handleChange}
      className="form-control"
      placeholder="Out Time"
    />
  </div>
  <div className="col-md-3">
   <input type="text" name="meals_plan" value={form.meals_plan} onChange={handleChange} placeholder="Meals Plan" className="form-control mb-2" />

  </div>
</div>

                    
                   

                   <div className="row mb-3">
  <div className="col-md-2">
    <input
      type="number"
      name="single_room_cost"
      value={form.single_room_cost}
      onChange={handleChange}
      className="form-control"
      placeholder="Room Cost"
    />
  </div>
  <div className="col-md-2">
    <input
      type="number"
      name="no_of_single_rooms"
      value={form.no_of_single_rooms}
      onChange={handleChange}
      className="form-control"
      placeholder="No. of Rooms"
    />
  </div>
  <div className="col-md-2">
    <input
      type="number"
      name="no_of_single_room_nights"
      value={form.no_of_single_room_nights}
      onChange={handleChange}
      className="form-control"
      placeholder="Room Nights"
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      name="single_category"
      value={form.single_category}
      onChange={handleChange}
      className="form-control"
      placeholder="Category"
    />
  </div>
  <div className="col-md-3">
    <input
      type="number"
      name="cost_for_single"
      value={form.cost_for_single}
      onChange={handleChange}
      className="form-control"
      placeholder="Total Cost"
    />
  </div>
</div>

                   
                   
                   
                   
                   <div className="row mb-3">
  <div className="col-md-2">
    <input
      type="number"
      name="double_room_cost"
      value={form.double_room_cost}
      onChange={handleChange}
      className="form-control"
      placeholder="Room Cost"
    />
  </div>
  <div className="col-md-2">
    <input
      type="number"
      name="no_of_double_rooms"
      value={form.no_of_double_rooms}
      onChange={handleChange}
      className="form-control"
      placeholder="No. of Rooms"
    />
  </div>
  <div className="col-md-2">
    <input
      type="number"
      name="no_double_room_nights"
      value={form.no_double_room_nights}
      onChange={handleChange}
      className="form-control"
      placeholder="Room Nights"
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      name="double_category"
      value={form.double_category}
      onChange={handleChange}
      className="form-control"
      placeholder="Category"
    />
  </div>
  <div className="col-md-3">
    <input
      type="number"
      name="cost_for_double"
      value={form.cost_for_double}
      onChange={handleChange}
      className="form-control"
      placeholder="Total Cost"
    />
  </div>
</div>

                   
                    
                    
                     

<div className="row mb-3">
  <div className="col-md-2">
    <input
      type="number"
      name="no_of_triple_rooms"
      value={form.no_of_triple_rooms}
      onChange={handleChange}
      className="form-control"
      placeholder="No. of Rooms"
    />
  </div>
  
  <div className="col-md-2">
    <input
      type="number"
      name="triple_room_cost"
      value={form.triple_room_cost}
      onChange={handleChange}
      className="form-control"
      placeholder="Room Cost"
    />
  </div>
  <div className="col-md-2">
    <input
      type="number"
      name="no_of_triple_room_nights"
      value={form.no_of_triple_room_nights}
      onChange={handleChange}
      className="form-control"
      placeholder="Room Nights"
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      name="triple_category"
      value={form.triple_category}
      onChange={handleChange}
      className="form-control"
      placeholder="Category"
    />
  </div>
  <div className="col-md-3">
    <input
      type="number"
      name="cost_for_triple"
      value={form.cost_for_triple}
      onChange={handleChange}
      className="form-control"
      placeholder="Total Cost"
    />
  </div>
</div>

                  
                   <div className="row mb-3">
  <div className="col-md-2">
    <input
      type="number"
      name="no_of_extra_rooms"
      value={form.no_of_extra_rooms}
      onChange={handleChange}
      className="form-control"
      placeholder="No. of Rooms"
    />
  </div>
 
  <div className="col-md-2">
    <input
      type="number"
      name="extra_room_cost"
      value={form.extra_room_cost}
      onChange={handleChange}
      className="form-control"
      placeholder="Room Cost"
    />
  </div>
   <div className="col-md-2">
    <input
      type="number"
      name="no_of_extra_room_nights"
      value={form.no_of_extra_room_nights}
      onChange={handleChange}
      className="form-control"
      placeholder="Room Nights"
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      name="extra_category"
      value={form.extra_category}
      onChange={handleChange}
      className="form-control"
      placeholder="Category"
    />
  </div>
  <div className="col-md-3">
    <input
      type="number"
      name="cost_for_extra"
      value={form.cost_for_extra}
      onChange={handleChange}
      className="form-control"
      placeholder="Total Cost"
    />
  </div>
</div>

                    
                      

                       
                        <input type="number" name="final_cost" value={form.final_cost} readOnly className="form-control mb-2" />

                    <button type="submit" className="btn btn-success">Submit</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </Layout>
  );
};

export default DomestciHotels;

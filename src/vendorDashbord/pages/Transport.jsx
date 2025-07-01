import React from 'react'
import { useState,useReducer,useEffect } from 'react'
import { API_URL } from '../data/apiUrl'



export const Transport = ({ customerData, row_id , onUpdate }) => {
 
    const [data,setData]=useState([]);
    const [form,setForm]=useState({
    transport_type:'',
    transport_cat:'',
    transport_name:'',
    transport_location:'',
    transport_vehicle:'',
    transport_site_cap:'',
    transport_start_date:'',
    transport_end_date:'',
    no_of_days:'',
    no_of_vehicles:'',
    cost_per_vehicle:'',
    total_cost:'',
    });
    const [pop,setPop]=useState(false);

    useEffect(() => {
      getTansport(); 
    }, [row_id]);

useEffect(() => {
  const start = new Date(form.transport_start_date);
  const end = new Date(form.transport_end_date);

  if (form.transport_start_date && form.transport_end_date && !isNaN(start) && !isNaN(end)) {
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // get date diff in days

    const no_of_vehicles = parseFloat(form.no_of_vehicles);
    const cost_per_vehicle = parseFloat(form.cost_per_vehicle);

    const total = diffDays * no_of_vehicles * cost_per_vehicle;

    setForm(prev => ({
      ...prev,
      no_of_days: diffDays,       // ✅ update days
      total_cost: total           // ✅ update cost
    }));
  }
}, [form.transport_start_date, form.transport_end_date, form.no_of_vehicles, form.cost_per_vehicle]);



const getTansport=async()=>{

        try{
        const resp = await fetch(`${API_URL}/vendor/Transports/${row_id}`);
        //console.log('Response status:', resp.status); // 👈 Add thi
        if (!resp.ok) {
            throw new Error('Data not fetching in this url');
         }
        const getingdata = await resp.json();
        setData(getingdata.data);
        if (onUpdate) onUpdate();
        }catch(err){
            console.log(err.message);
        }

    }
    

   const FaUnderline=async(row_id)=>{
        try{
           const delData=await fetch(`${API_URL}/vendor/Transports/${row_id}`,{
            method:'delete'
           });
           if(!delData.ok){
            throw new Error('Data not deleting above url');
           }
           getTansport();
        }catch(err){
           console.log(err.message);
        }
    }

    const handleChange=(e)=>{
      const {name,value}=e.target;
      setForm((prevData) => ({
  ...prevData,
  [name]: value
}));

    }

    const saveData=async()=>{
        try{

          if(form.id){
const resData=await fetch(`${API_URL}/vendor/Transports/${form.id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(form)
         });
          }else{
const resData=await fetch(`${API_URL}/vendor/Transports/${row_id}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(form)
         });
          }  
         
         setPop(false);
         getTansport();
        }catch(err){
        console.log(err.message);
        }
    }

    const editFun=(datss)=>{
    setForm({
    transport_type: datss.transport_type || '',
    transport_cat: datss.transport_cat || '',
    transport_name: datss.transport_name || '',
    transport_location: datss.transport_location || '',
    transport_vehicle: datss.transport_vehicle || '',
    transport_site_cap: datss.transport_site_cap || '',
    transport_start_date: datss.transport_start_date || '',
    transport_end_date: datss.transport_end_date || '',
    no_of_days: datss.no_of_days || '',
    no_of_vehicles: datss.no_of_vehicles || '',
    cost_per_vehicle: datss.cost_per_vehicle || '',
    total_cost: datss.total_cost || '',
    id: datss._id,
  });
      setPop(true);
    }

  return (
    <>
    <div className="row mt-5" >
      <div className="col-lg-12" style={{ backgroundColor: 'lightgray' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Transport   Details</h3>
            <button className="btn btn-primary btn-sm" onClick={()=>setPop(true)}>
              + Add Transport 
            </button>
              
            <div className="table-responsive mt-4">
<table className="table table-stripped table-bordered">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Action</th>
      <th>transport_type</th>
      <th>transport_cat </th>
      <th>transport_name</th>
      <th>transport_location</th>
      <th>transport_vehicle</th>
      <th>transport_site_cap</th>
      <th>transport_start_date</th>
      <th>transport_end_date</th>
      <th>no_of_days</th>
      <th>no_of_vehicles</th>
      <th>cost_per_vehicle</th>
      <th>total_cost</th>
      
    </tr>
  </thead>
  <tbody>
    {data && data.length > 0 ? (
      data.map((item, index) => (
        <tr key={item._id || index}>
          <td>{index + 1}</td>
          <td>
            <button className="btn btn-danger btn-sm" onClick={()=>{FaUnderline(item._id)}}>Delete</button>
            <button className="btn btn-primary btn-sm" onClick={()=>{editFun(item)}}>Edit</button>
            </td>
          <td>{item.transport_type}</td>
          <td>{item.transport_cat}</td>
          <td>{item.transport_name}</td>
          <td>{item.transport_location}</td>
          <td>{item.transport_vehicle}</td>
          <td>{item.transport_site_cap}</td>
          <td>{item.transport_start_date}</td>
          <td>{item.transport_end_date}</td>
          <td>{item.no_of_days}</td>
          <td>{item.no_of_vehicles}</td>
          <td>{item.cost_per_vehicle}</td>
          <td>{item.total_cost}</td>
          
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="16">No Cruise Data Found</td>
      </tr>
    )}
  </tbody>
</table>
             {pop && (
  <div className="mt-4">
    <div className="row">
      {/* Cruise Supplier */}
      <div className="col-md-4 mb-2">
       <label>Transport Type</label>
        <select
          name="transport_type"
          className="form-control"
          value={form.transport_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Transport Type</option>
          <option value="Private">Private</option>
          <option value="SIC">SIC</option>
        </select>
      </div>

      {/* Cruise Name */}
      <div className="col-md-4 mb-2">
        <label>Transport Category</label>
        <select
          name="transport_cat"
          className="form-control"
          value={form.transport_cat}
          onChange={handleChange}
          required
        >
          <option value="">Select Transport Category</option>
          <option value="All Tour Transfer">All Tour Transfer</option>
          <option value="All Airport Transfer">All Airport Transfer</option>
          <option value="One Way Airport Transfer">One Way Airport Transfer</option>
          <option value="Tour">Tour</option>
        </select>
      </div>

      {/* Contact Person */}
      <div className="col-md-4 mb-2">
        <label>Transport Name</label>
        <input
          type="text"
          name="transport_name"
          className="form-control"
          value={form.transport_name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Contact Number */}
      <div className="col-md-4 mb-2">
        <label>Transport Location</label>
        <input
          type="text"
          name="transport_location"
          className="form-control"
          value={form.transport_location}
          onChange={handleChange}
          required
        />
      </div>

      {/* Start Date */}
      <div className="col-md-4 mb-2">
        <label>Site Capacity</label>
        <input
          type="number"
          name="transport_site_cap"
          className="form-control"
          value={form.transport_site_cap}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      {/* End Date */}
      <div className="col-md-4 mb-2">
        <label>Start Date</label>
        <input
          type="date"
          name="transport_start_date"
          className="form-control"
          value={form.transport_start_date}
          onChange={handleChange}
          required
        />
      </div>

      {/* Start City */}
      <div className="col-md-4 mb-2">
        <label>End Date</label>
        <input
          type="date"
          name="transport_end_date"
          className="form-control"
          value={form.transport_end_date}
          onChange={handleChange}
          required
        />
      </div>

      {/* End City */}
      <div className="col-md-4 mb-2">
         <label>Number of Days</label>
        <input
          type="number"
          name="no_of_days"
          className="form-control"
          value={form.no_of_days}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      {/* Cabin Type */}
      <div className="col-md-4 mb-2">
         <label>Number of Vehicles</label>
        <input
          type="number"
          name="no_of_vehicles"
          className="form-control"
          value={form.no_of_vehicles}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      {/* Meal Plan */}
      <div className="col-md-4 mb-2">
        <label>Cost per Vehicle</label>
        <input
          type="number"
          name="cost_per_vehicle"
          className="form-control"
          value={form.cost_per_vehicle}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Nights */}
      <div className="col-md-4 mb-2">
        <label>Total Cost</label>
        <input
          type="number"
          name="total_cost"
          className="form-control"
          value={form.total_cost}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>

     
    </div>

    <button className="btn btn-success btn-sm me-2" onClick={saveData}>
      Save
    </button>
    <button className="btn btn-secondary btn-sm" onClick={() => setPop(false)}>
      Cancel
    </button>
  </div>
)}


                
            </div>
           </div>
         </div>  
        </div>   
    </div>  
    </>
  )
}

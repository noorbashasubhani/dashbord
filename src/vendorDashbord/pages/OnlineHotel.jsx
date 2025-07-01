import React from 'react'
import { useState,useReducer,useEffect } from 'react'
import { API_URL } from '../data/apiUrl'

export const OnlineHotel = ({ customerData, row_id ,onUpdate }) => {
    const [data,setData]=useState([]);
    const [form,setForm]=useState({
        price_source: '',
        hotel_name: '',
        hotel_standed: '',
        location: '',
        check_in: '',
        check_out: '',
        in_time: '',
        out_time: '',
        meals_plan: '',
        no_of_double_room: '',
        no_of_double_room_nights: '',
        no_of_double_room_cat: '',
        no_of_single_room:'',
        no_of_single_room_nights: '',
        no_of_single_room_cat: '',
        no_of_triple_room: '',
        no_of_triple_room_nights: '',
        no_of_triple_room_cat: '',
        no_of_extra_room: '',
        no_of_extra_room_nights: '',
        no_of_extra_room_cat: '',
        no_of_suite_room: '',
        no_of_suite_room_nights: '',
        no_of_suite_room_cat: '',
        total_cost: ''
    });
    const [pop,setPop]=useState(false);

    useEffect(() => {getCruise(); }, []);

    const getCruise=async()=>{

        try{
        const resp = await fetch(`${API_URL}/vendor/online/${row_id}`);
        console.log('Response status:', resp.status); // 👈 Add thi
        if (!resp.ok) {
            throw new Error('Data not fetching in this url');
         }
        const getingdata = await resp.json();
        //console.log("Fetched Data:", getingdata.data);
        setData(getingdata.data);
        if (onUpdate) onUpdate();
        }catch(err){
            console.log(err.message);
        }

    }
    

   const FaUnderline=async(row_id)=>{
        try{
           const delData=await fetch(`${API_URL}/vendor/online/${row_id}`,{
            method:'Delete'
           });
           if(!delData.ok){
            throw new Error('Data not deleting above url');
           }
           getCruise();
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
const resData=await fetch(`${API_URL}/vendor/online/${form.id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(form)
         });
          }else{
const resData=await fetch(`${API_URL}/vendor/online/${row_id}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(form)
         });
          }  
         
         setPop(false);
         getCruise();
         
        }catch(err){
        console.log(err.message);
        }
    }

    const editFun=(datss)=>{
    setForm({
    price_source: datss.price_source || '',
    hotel_name: datss.hotel_name || '',
    hotel_standed: datss.hotel_standed || '',
    location: datss.location || '',
    check_in: datss.check_in || '',
    check_out: datss.check_out || '',
    in_time: datss.in_time || '',
    out_time: datss.out_time || '',
    meals_plan: datss.meals_plan || '',
    no_of_double_room: datss.no_of_double_room || '',
    no_of_double_room_nights: datss.no_of_double_room_nights || '',
    no_of_double_room_cat: datss.no_of_double_room_cat || '',
    no_of_single_room: datss.no_of_single_room || '',
    no_of_single_room_nights: datss.no_of_single_room_nights || '',
    no_of_single_room_cat: datss.no_of_single_room_cat || '',
    no_of_triple_room: datss.no_of_triple_room || '',
    no_of_triple_room_nights: datss.no_of_triple_room_nights || '',
    no_of_triple_room_cat: datss.no_of_triple_room_cat || '',
    no_of_extra_room: datss.no_of_extra_room || '',
    no_of_extra_room_nights: datss.no_of_extra_room_nights || '',
    no_of_extra_room_cat: datss.no_of_extra_room_cat || '',
    no_of_suite_room: datss.no_of_suite_room || '',
    no_of_suite_room_nights: datss.no_of_suite_room_nights || '',
    no_of_suite_room_cat: datss.no_of_suite_room_cat || '',
    total_cost: datss.total_cost || '',
    id: datss._id,
  });
      setPop(true);
    }
//console.log('Fetched hotel data:', data);

  return (
    <>
    <div className="row mt-5" >
      <div className="col-lg-12" style={{ backgroundColor: '#efa1f0' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Online Hotel   Details</h3>
            <button className="btn btn-primary btn-sm" onClick={()=>setPop(true)}>
              + Add Hotel 
            </button>
              
            <div className="table-responsive mt-4">
<table className="table table-stripped table-bordered">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Action</th>
      <th>price_source</th>
      <th>hotel_name </th>
      <th>hotel_standed</th>
      <th>location</th>
      <th>check_in</th>
      <th>check_out</th>
      <th>in_time</th>
      <th>out_time</th>
      <th>meals_plan</th>
      <th>no_of_double_room</th>
      <th>no_of_double_room_nights</th>
      <th>no_of_double_room_cat</th>

      <th>no_of_single_room</th>
      <th>no_of_single_room_nights</th>
      <th>no_of_single_room_cat</th>
      <th>no_of_triple_room</th>
      <th>no_of_triple_room_nights</th>
      <th>no_of_triple_room_cat</th>
      <th>no_of_extra_room</th>
      <th>no_of_extra_room_nights</th>
      <th>no_of_extra_room_cat</th>

      <th>no_of_suite_room</th>
      <th>no_of_suite_room_nights</th>
      <th>no_of_suite_room_cat</th>
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
          <td>{item.price_source}</td>
          <td>{item.hotel_name}</td>
          <td>{item.hotel_standed}</td>
          <td>{item.location}</td>
          <td>{item.check_in}</td>
          <td>{item.check_out}</td>
          <td>{item.in_time}</td>
          <td>{item.out_time}</td>
          <td>{item.meals_plan}</td>
          <td>{item.no_of_double_room}</td>
          <td>{item.no_of_double_room_nights}</td>
          <td>{item.no_of_double_room_cat}</td>


          <td>{item.no_of_single_room}</td>
          <td>{item.no_of_single_room_nights}</td>
          <td>{item.no_of_single_room_cat}</td>
          <td>{item.no_of_triple_room}</td>
          <td>{item.no_of_triple_room_nights}</td>
          <td>{item.no_of_triple_room_cat}</td>
          <td>{item.no_of_extra_room}</td>
          <td>{item.no_of_extra_room_nights}</td>
          <td>{item.no_of_extra_room_cat}</td>
          <td>{item.no_of_suite_room}</td>
          <td>{item.no_of_suite_room_nights}</td>
          <td>{item.no_of_suite_room_cat}</td>
          <td>{item.total_cost}</td>

          
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="16">No  Data Found</td>
      </tr>
    )}
  </tbody>
</table>
             {pop && (
  <div className="mt-4">
    <div className="row">
      {/* Cruise Supplier */}
      
      <div>
 <div className="row">
  <div className="col">
  <label>Price Source</label>
  <input type="text" name="price_source" className="form-control" value={form.price_source} onChange={handleChange}/>
 </div>

  <div className="col">

  <label>Hotel Name</label>
  <input type="text" name="hotel_name" className="form-control"  value={form.hotel_name} onChange={handleChange}/>
</div>

  <div className="col">
  <label>Hotel Standard</label>
  <input type="text" name="hotel_standed" className="form-control"  value={form.hotel_standed} onChange={handleChange}/>
   </div>

   <div className="col">
  <label>Location</label>
  <input type="text" name="location" className="form-control"  value={form.location} onChange={handleChange}/>
</div>
</div>


<div className="row">
  <div className="col">
  <label>Check In Date</label>
  <input type="date" name="check_in" className="form-control"  value={form.check_in} onChange={handleChange}/>
</div>
 <div className="col">
  <label>Check Out Date</label>
  <input type="date" name="check_out" className="form-control"  value={form.check_out} onChange={handleChange}/>
</div>
 <div className="col">
  <label>Check In Time</label>
  <input type="time" name="in_time" className="form-control"  value={form.in_time} onChange={handleChange}/>
</div>
 <div className="col">
  <label>Check Out Time</label>
  <input type="time" name="out_time" className="form-control"  value={form.out_time} onChange={handleChange}/>

</div>
</div>


  <label>Meals Plan</label>
  <input type="text" name="meals_plan" className="form-control"  value={form.meals_plan} onChange={handleChange}/>

  <div className="row">
  <div className="col">
    <label>Number of Double Rooms</label>
    <input type="number" name="no_of_double_room" className="form-control" value={form.no_of_double_room} onChange={handleChange}/>
  </div>
  <div className="col">
    <label>Double Room Nights</label>
    <input type="number" name="no_of_double_room_nights" className="form-control" value={form.no_of_double_room_nights} onChange={handleChange}/>
  </div>
  <div className="col">
    <label>Double Room Category</label>
    <input type="text" name="no_of_double_room_cat" className="form-control" value={form.no_of_double_room_cat} onChange={handleChange}/>
  </div>
</div>

 <div className="row">
  <div className="col">
    <label>Number of Single Rooms</label>
    <input type="number" name="no_of_single_room" className="form-control" value={form.no_of_single_room} onChange={handleChange}/>
  </div>
  <div className="col">
    <label>Single Room Nights</label>
    <input type="number" name="no_of_single_room_nights" className="form-control" value={form.no_of_single_room_nights} onChange={handleChange}/>
  </div>
  <div className="col">
    <label>Single Room Category</label>
    <input type="text" name="no_of_single_room_cat" className="form-control" value={form.no_of_single_room_cat} onChange={handleChange}/>
  </div>
</div>

<div className="row">
  <div className="col">
  <label>Number of Triple Rooms</label>
  <input type="number" name="no_of_triple_room" className="form-control" 
   value={form.no_of_triple_room} onChange={handleChange}/>
</div>
 <div className="col">
  <label>Triple Room Nights</label>
  <input type="number" name="no_of_triple_room_nights" className="form-control"  value={form.no_of_triple_room_nights} onChange={handleChange}/>
</div>
 <div className="col">
  <label>Triple Room Category</label>
  <input type="text" name="no_of_triple_room_cat" className="form-control"  value={form.no_of_triple_room_cat} onChange={handleChange}/>
 </div>
</div>

<div className="row">
  <div className="col">
  <label>Number of Extra Rooms</label>
  <input type="number" name="no_of_extra_room" className="form-control"  value={form.no_of_extra_room} onChange={handleChange}/>
  </div>
  <div className="col">
  <label>Extra Room Nights</label>
  <input type="number" name="no_of_extra_room_nights" className="form-control"  value={form.no_of_extra_room_nights} onChange={handleChange}/>
</div>
<div className="col">
  <label>Extra Room Category</label>
  <input type="text" name="no_of_extra_room_cat" className="form-control"  value={form.no_of_extra_room_cat} onChange={handleChange}/>
</div>
</div>

<div className="row">
  <div className="col">
  <label>Number of Suite Rooms</label>
  <input type="number" name="no_of_suite_room" className="form-control"  value={form.no_of_suite_room} onChange={handleChange}/>
</div>
<div className="col">
  <label>Suite Room Nights</label>
  <input type="number" name="no_of_suite_room_nights" className="form-control"  value={form.no_of_suite_room_nights} onChange={handleChange}/>
</div>
<div className="col">
  <label>Suite Room Category</label>
  <input type="text" name="no_of_suite_room_cat" className="form-control"  value={form.no_of_suite_room_cat} onChange={handleChange}/>
</div>
</div>




  <label>Total Cost</label>
  <input type="number" name="total_cost" className="form-control"  value={form.total_cost} onChange={handleChange}/>
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

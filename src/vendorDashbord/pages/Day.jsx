import React from 'react'
import { useState,useReducer,useEffect } from 'react'
import { API_URL } from '../data/apiUrl'

export const Day = ({ customerData, row_id }) => {
    const [data,setData]=useState([]);
    const [hotels, setHotels] = useState([]);

    const [form,setForm]=useState({
        day_no: "",
        day_title: "",
        day_date: "",
        hotel_id: "",
        distance: "",
        meals_plan: 0,
        day_summary: 0
    });
    const [pop,setPop]=useState(false);

    useEffect(() => {getCruise();getHotels(); }, [row_id]);


    const getHotels=async()=>{
        try{
          const getData=await fetch(`${API_URL}/vendor/online`);
          if(!getData.ok){
            throw new Error('Data not comming in this url');
          }
          const Datas=await getData.json();
          setHotels(Datas.data || []); // assuming response has a `list` key
        }catch(err){
          console.log(err.message);
        }
    }

    const getCruise=async()=>{

        try{
        const resp = await fetch(`${API_URL}/vendor/day/${row_id}`);
        console.log('Response status:', resp.status); // 👈 Add thi
        if (!resp.ok) {
            throw new Error('Data not fetching in this url');
         }
        const getingdata = await resp.json();
        setData(getingdata.data);
        }catch(err){
            console.log(err.message);
        }

    }
    

   const FaUnderline=async(row_id)=>{
    
        try{
           const delData=await fetch(`${API_URL}/vendor/day/${row_id}`,{
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

    const saveData = async () => {
  try {
    const payload = { ...form, doc_id: row_id };

    const resData = await fetch(`${API_URL}/vendor/day/${form.id ? form.id : row_id}`, {
      method: form.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resText = await resData.text();
    console.log("Server Response:", resText);

    if (!resData.ok) {
      throw new Error('Failed to save data');
    }

    setPop(false);
    setForm({
      day_no: "",
      day_title: "",
      day_date: "",
      hotel_id: "",
      distance: "",
      meals_plan: 0,
      day_summary: 0,
    });
    getCruise();
  } catch (err) {
    console.log(err.message);
  }
};


    const editFun=(datss)=>{
    setForm({
    day_no: datss.day_no || '',
    day_title: datss.day_title || '',
    day_date: datss.day_date || '',
    hotel_id: datss.hotel_id?._id || datss.hotel_id || '', // <<== Fix is here
    distance: datss.distance || '',
    meals_plan: datss.meals_plan || 0,
    day_summary: datss.day_summary || 0,
    doc_id: datss.doc_id || row_id, // 👈 Add this
    id: datss._id,
  });
      setPop(true);
    }

  return (
    <>
    <div className="row mt-5" >
      <div className="col-lg-12" style={{ backgroundColor: 'black' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Day Wise Itenary  Details</h3>
            <button className="btn btn-primary btn-sm" onClick={()=>setPop(true)}>
              + Add Day 
            </button>
              
            <div className="table-responsive mt-4">
<table className="table table-stripped table-bordered">
  <thead>
    <tr>
    <td>S.No</td>
    <td>Action</td>
    <td>day_no</td>
    <td>day_title</td>
    <td>day_date</td>
    <td>hotel_id</td>
    <td>distance</td>
    <td>meals_plan</td>
    <td>day_summary</td>
    
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
           <td>{item.day_no}</td>
  <td>{item.day_title}</td>
  <td>{item.day_date}</td>
  <td>{item.hotel_id.hotel_name}</td>
  <td>{item.distance}</td>
  <td>{item.meals_plan}</td>
  <td>{item.day_summary}</td>
   
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
  <form >
    <div className="row">
      <div className="col-md-4">
      <div>
        <label>Day No:</label><input type="text" name="day_no" className="form-control" onChange={handleChange}  value={form.day_no}/>
      </div>
  </div>
   <div className="col-md-4">
  <div><label>Title:</label><input type="text" name="day_title" className="form-control" onChange={handleChange} value={form.day_title}/></div>
   </div>
  <div className="col-md-4">
  <div><label>Date:</label><input type="date" name="day_date" className="form-control" onChange={handleChange} value={form.day_date}/></div>
  </div>
  


  <div className="col-md-4">
  <div>
    <label>Hotel Name:</label>
    <select
      name="hotel_id"
      className="form-control"
      value={form.hotel_id}
      onChange={handleChange}
    >
      <option value="">-- Select Hotel --</option>
      {hotels.map((hotel) => (
        <option key={hotel._id} value={hotel._id}>
          {hotel.hotel_name}
        </option>
      ))}
    </select>
  </div>
</div>

  
   
  <div className="col-md-4">
  <div><label>Distance:</label><input type="text" name="distance" className="form-control" onChange={handleChange} value={form.distance}/></div>
  </div>
  <div className="col-md-4">
  <div><label>Meals Plan:</label><input type="text" name="meals_plan" className="form-control" onChange={handleChange} value={form.meals_plan}/></div>
  </div>

  <div className="col-md-12">
  <div><label>Day Summary:</label><textarea name="day_summary" className="form-control"
   onChange={handleChange} value={form.day_summary}></textarea></div>
  </div>
  
   
    </div>


   
<hr></hr>
   <div className="row">
  <div className="col-md-3"></div>
  <div className="col-md-3"></div>
  <div className="col-md-3">
  <div><button className="btn btn-primary btn-sm" type="button" onClick={saveData}>Submit</button></div>
  </div>
  </div>
</form>

)}


                
            </div>
           </div>
         </div>  
        </div>   
    </div>  
    </>
  )
}

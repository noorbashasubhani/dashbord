import React from 'react'
import { useState,useReducer,useEffect } from 'react'
import { API_URL } from '../data/apiUrl'

export const Flight = ({ customerData, row_id, onUpdate  }) => {
    const [data,setData]=useState([]);
    const [airport,setAirport]=useState([]);
    const [form,setForm]=useState({
  if_fare: "",
  group_provided_by: "",
  fare_validity: "",
  fare_source: "",
  travel_type: "",
  no_of_adults: 0,
  no_of_children: 0,
  no_of_infants: 0,
  total_pax: 0,
  on_flight_name: "",
  on_flight_no: "",
  on_from_city: "",
  on_to_city: "",
  on_from_terminal: "",
  on_to_terminal: "",
  on_start_date: null,
  on_reach_date: null,
  on_duration: "",
  on_hand_bag: "",
  on_cabin_bag: "",
  on_class_type: "",
  r_flight_name: "",
  r_flight_no: "",
  r_from_city: "",
  r_to_city: "",
  r_from_terminal: "",
  r_to_terminal: "",
  r_start_date: null,
  r_reach_date: null,
  r_duration: "",
  r_hand_bag: "",
  r_cabin_bag: "",
  r_class_type: "",
  flight_cost_consider: 0,
  bagage_cost: 0,
  total_flight_cost: 0,
    });
    const [pop,setPop]=useState(false);



  const sanitizeFlightForm = (form) => {
  const cleaned = { ...form };

  // List of all ObjectId fields
  const objectIdFields = [
    'on_from_city',
    'on_to_city',
    'r_from_city',
    'r_to_city',
    'doc_id'
  ];

  objectIdFields.forEach(field => {
    if (cleaned[field] === "") {
      cleaned[field] = null; // or delete cleaned[field];
    }
  });

  return cleaned;
};


  useEffect(() => {
  const adult = parseInt(form.no_of_adults) || 0;
  const childs = parseInt(form.no_of_children) || 0;
  const infants = parseInt(form.no_of_infants) || 0;
  const totalPersons = adult + childs + infants;

  const flightCost = parseInt(form.flight_cost_consider) || 0;
  const baggageCost = parseInt(form.bagage_cost) || 0;
  const totalFlightCost = flightCost + baggageCost;

  if (
    form.total_pax !== totalPersons ||
    form.total_flight_cost !== totalFlightCost
  ) {
    setForm(prev => ({
      ...prev,
      total_pax: totalPersons,
      total_flight_cost: totalFlightCost
    }));
  }
  getFlights();
  getAirports();
}, [
  form.no_of_adults,
  form.no_of_children,
  form.no_of_infants,
  form.flight_cost_consider,
  form.bagage_cost
]);





    const getFlights=async()=>{
        try{
        const resp = await fetch(`${API_URL}/vendor/Flights/${row_id}`);
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

    const getAirports=async()=>{
        try{
        const resp = await fetch(`${API_URL}/vendor/Airplan-List`);
        console.log('Response status:', resp.status); // 👈 Add thi
        if (!resp.ok) {
            throw new Error('Data not fetching in this url');
         }
        const getingdata = await resp.json();
        setAirport(getingdata.data);
        }catch(err){
            console.log(err.message);
        }
    }
    

   const FaUnderline=async(row_id)=>{
    
        try{
           const delData=await fetch(`${API_URL}/vendor/Flights/${row_id}`,{
            method:'Delete'
           });
           if(!delData.ok){
            throw new Error('Data not deleting above url');
           }
           getFlights();
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
        const cleanedForm = sanitizeFlightForm(form);

        try{

          if(form.id){
const resData=await fetch(`${API_URL}/vendor/Flights/${form.id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(cleanedForm)
         });
          }else{
const resData=await fetch(`${API_URL}/vendor/Flights/${row_id}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(cleanedForm)
         });
          }  
         onUpdate();
         setPop(false);
         getFlights();
        }catch(err){
        console.log(err.message);
        }
    }

    const editFun=(datss)=>{
    setForm({
if_fare: datss.if_fare || '',
group_provided_by: datss.group_provided_by || '',
fare_validity: datss.fare_validity || '',
fare_source: datss.fare_source || '',
travel_type: datss.travel_type || '',
no_of_adults: datss.no_of_adults || 0,
no_of_children: datss.no_of_children || 0,
no_of_infants: datss.no_of_infants || 0,
total_pax: datss.total_pax || 0,
on_flight_name: datss.on_flight_name || '',
on_flight_no: datss.on_flight_no || '',
on_from_city: datss.on_from_city?._id || '',
on_to_city: datss.on_to_city?._id || '',
on_from_terminal: datss.on_from_terminal || '',
on_to_terminal: datss.on_to_terminal || '',
on_start_date: datss.on_start_date || null,
on_reach_date: datss.on_reach_date || null,
on_duration: datss.on_duration || '',
on_hand_bag: datss.on_hand_bag || '',
on_cabin_bag: datss.on_cabin_bag || '',
on_class_type: datss.on_class_type || '',
r_flight_name: datss.r_flight_name || '',
r_flight_no: datss.r_flight_no || '',
r_from_city: datss.r_from_city?._id || '',
r_to_city: datss.r_to_city?._id || '',
r_from_terminal: datss.r_from_terminal || '',
r_to_terminal: datss.r_to_terminal || '',
r_start_date: datss.r_start_date || null,
r_reach_date: datss.r_reach_date || null,
r_duration: datss.r_duration || '',
r_hand_bag: datss.r_hand_bag || '',
r_cabin_bag: datss.r_cabin_bag || '',
r_class_type: datss.r_class_type || '',
flight_cost_consider: datss.flight_cost_consider || 0,
bagage_cost: datss.bagage_cost || 0,
total_flight_cost: datss.total_flight_cost || 0,


    id: datss._id,
  });
  
      setPop(true);
    }

  return (
    <>
    <div className="row mt-5" >
      <div className="col-lg-12" style={{ backgroundColor: '#69f33e' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Flight  Details</h3>
            <button className="btn btn-primary btn-sm" onClick={()=>setPop(true)}>
              + Add Flight 
            </button>
              
            <div className="table-responsive mt-4">
<table className="table table-stripped table-bordered">
  <thead>
    <tr>
    <td>S.No</td>
    <td>Action</td>
    <td>if_fare</td>
    <td>group_provided_by</td>
    <td>fare_validity</td>
    <td>fare_source</td>
    <td>travel_type</td>
    <td>no_of_adults</td>
    <td>no_of_children</td>
    <td>no_of_infants</td>
    <td>total_pax</td>
    <td>on_flight_name</td>
    <td>on_flight_no</td>
    <td>on_from_city</td>
    <td>on_to_city</td>
    <td>on_from_terminal</td>
    <td>on_to_terminal</td>
    <td>on_start_date</td>
    <td>on_reach_date</td>
    <td>on_duration</td>
    <td>on_hand_bag</td>
    <td>on_cabin_bag</td>
    <td>on_class_type</td>
    <td>r_flight_name</td>
    <td>r_flight_no</td>
    <td>r_from_city</td>
    <td>r_to_city</td>
    <td>r_from_terminal</td>
    <td>r_to_terminal</td>
    <td>r_start_date</td>
    <td>r_reach_date</td>
    <td>r_duration</td>
    <td>r_hand_bag</td>
    <td>r_cabin_bag</td>
    <td>r_class_type</td>
    <td>flight_cost_consider</td>
    <td>bagage_cost</td>
    <td>total_flight_cost</td>
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
           <td>{item.if_fare}</td>
  <td>{item.group_provided_by}</td>
  <td>{item.fare_validity}</td>
  <td>{item.fare_source}</td>
  <td>{item.travel_type}</td>
  <td>{item.no_of_adults}</td>
  <td>{item.no_of_children}</td>
  <td>{item.no_of_infants}</td>
  <td>{item.total_pax}</td>
  <td>{item.on_flight_name}</td>
  <td>{item.on_flight_no}</td>
  <td>{item.on_from_city?.airport_name}</td>
  <td>{item.on_to_city?.airport_name}</td>
  <td>{item.on_from_terminal}</td>
  <td>{item.on_to_terminal}</td>
  <td>{item.on_start_date}</td>
  <td>{item.on_reach_date}</td>
  <td>{item.on_duration}</td>
  <td>{item.on_hand_bag}</td>
  <td>{item.on_cabin_bag}</td>
  <td>{item.on_class_type}</td>
  <td>{item.r_flight_name}</td>
  <td>{item.r_flight_no}</td>
  <td>{item.r_from_city?.airport_name}</td>
  <td>{item.r_to_city?.airport_name}</td>
  <td>{item.r_from_terminal}</td>
  <td>{item.r_to_terminal}</td>
  <td>{item.r_start_date}</td>
  <td>{item.r_reach_date}</td>
  <td>{item.r_duration}</td>
  <td>{item.r_hand_bag}</td>
  <td>{item.r_cabin_bag}</td>
  <td>{item.r_class_type}</td>
  <td>{item.flight_cost_consider}</td>
  <td>{item.bagage_cost}</td>
  <td>{item.total_flight_cost}</td>


          
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="16">No Cruise Data Found</td>
      </tr>
    )}
  </tbody>
</table>
</div>
             {pop && (
  <form >
    <div className="row">
      <div className="col-md-3">
      <div>
        {form && (
        <div>
  <label>IF Fare:</label>
  <select
    name="if_fare"
    className="form-control"
    onChange={handleChange}
    value={form.if_fare}
  >
    <option value="">-- Select --</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>
)}
      </div>
  </div>
 {form.if_fare === "Yes" && (
  <>
   <div className="col-md-3">
   
  <div>
    <label>Group Provided By:</label>
    <input type="text" name="group_provided_by" className="form-control" onChange={handleChange}
     value={form.group_provided_by}/></div>
   </div>

  <div className="col-md-3">
    <div>
    <label>Fare Validity:</label>
    <input type="date" name="fare_validity" className="form-control" onChange={handleChange}
     value={form.fare_validity}/>
     </div>
  </div>
  </>
)}
  <div className="col-md-3">
  <div><label>Fare Source:</label><input type="text" name="fare_source" className="form-control" onChange={handleChange} value={form.fare_source}/></div>
  </div>
  
   </div>

<div className="row">
  <div className="col-md-3">
  <label>Travel Type:</label>
  <select
    name="travel_type"
    className="form-control"
    onChange={handleChange}
    value={form.travel_type}
  >
    <option value="">-- Select Travel Type --</option>
    <option value="Return">Return</option>
    <option value="OneWay">One Way</option>
  </select>
</div>

  <div className="col-md-3">
  <div><label>Number of Adults:</label><input type="number" name="no_of_adults" className="form-control" onChange={handleChange} value={form.no_of_adults}/></div>
  </div>

  <div className="col-md-3">
  <div><label>Number of Children:</label><input type="number" name="no_of_children" className="form-control" onChange={handleChange} value={form.no_of_children}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Number of Infants:</label><input type="number" name="no_of_infants" className="form-control" onChange={handleChange} value={form.no_of_infants}/></div>
  </div>
    <div className="col-md-3">
       <div><label>Total Pax:</label><input type="number" name="total_pax" className="form-control" onChange={handleChange} value={form.total_pax} /></div>
    </div>
    </div>


   <div className="row">
    <div className="col-md-12"></div>
    </div> 
<hr></hr>


{(form.travel_type === "OneWay" || form.travel_type === "Return") && (
<>
    <div className="row">
      <div className="col-md-3">
         <div><label>Onward Flight Name:</label><input type="text" name="on_flight_name" className="form-control" onChange={handleChange} value={form.on_flight_name}/></div>
      </div>
      <div className="col-md-3">
    <div><label>Onward Flight Number:</label><input type="text" name="on_flight_no" className="form-control" onChange={handleChange} value={form.on_flight_no}/></div>
    </div>
    <div className="col-md-3">
    <div>
      <label>Onward From City:</label>
<select
  name="on_from_city"
  className="form-control"
  onChange={handleChange}
  value={form.on_from_city}
>
  <option value="">-- Select Airport --</option>
  {airport.map((airport) => (
    <option key={airport._id} value={airport._id}>
      {airport.airport_name} ({airport.airport_code})
    </option>
  ))}
</select>

      </div>
    </div>
    <div className="col-md-3">
    <div>
      <label>Onward To City:</label>
       <select
  name="on_to_city"
  className="form-control"
  onChange={handleChange}
  value={form.on_to_city}
>
  <option value="">-- Select Airport --</option>
  {airport.map((airport) => (
    <option key={airport._id} value={airport._id}>
      {airport.airport_name} ({airport.airport_code})
    </option>
  ))}
</select>
       
       </div>
    </div>
    </div>

  <div className="row">
    <div className="col-md-3">
  <div><label>Onward From Terminal:</label><input type="text" name="on_from_terminal" className="form-control" onChange={handleChange} value={form.on_from_terminal}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Onward To Terminal:</label><input type="text" name="on_to_terminal" className="form-control" onChange={handleChange} value={form.on_to_terminal}/>
  </div>
  </div>
  <div className="col-md-3">
  <div><label>Onward Start Date:</label><input type="date" name="on_start_date" className="form-control" onChange={handleChange} value={form.on_start_date}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Onward Reach Date:</label><input type="date" name="on_reach_date" className="form-control" onChange={handleChange} value={form.on_reach_date}/></div>
  </div>
  </div>

  <div className="row">
  <div className="col-md-3"> 
  <div><label>Onward Duration:</label><input type="text" name="on_duration" className="form-control" onChange={handleChange} value={form.on_duration}/></div>
  </div> 
  <div className="col-md-3">
  <div><label>Onward Hand Bag:</label><input type="text" name="on_hand_bag" className="form-control" onChange={handleChange} value={form.on_hand_bag}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Onward Cabin Bag:</label><input type="text" name="on_cabin_bag" className="form-control" onChange={handleChange} value={form.on_cabin_bag}/></div>
  </div>
    <div className="col-md-3">
  <div><label>Onward Class Type:</label><input type="text" name="on_class_type" className="form-control" onChange={handleChange} value={form.on_class_type}/></div>
  </div>
</div>

</>
)}

<hr></hr>
{form.travel_type === "Return" && (
  <>
<div className="row">
  <div className="col-md-3">
  <div><label>Return Flight Name:</label>
  <input type="text" name="r_flight_name" className="form-control" onChange={handleChange} value={form.r_flight_name}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Return Flight Number:</label><input type="text" name="r_flight_no" className="form-control" onChange={handleChange} value={form.r_flight_no}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Return From City:</label>
   <select
  name="r_from_city"
  className="form-control"
  onChange={handleChange}
  value={form.r_from_city}
>
  <option value="">-- Select Airport --</option>
  {airport.map((airport) => (
    <option key={airport._id} value={airport._id}>
      {airport.airport_name} ({airport.airport_code})
    </option>
  ))}
</select>
  
  
  </div>
 
 
  </div>
  <div className="col-md-3">
  <div><label>Return To City:</label>
  
   <select
  name="r_to_city"
  className="form-control"
  onChange={handleChange}
  value={form.r_to_city}
>
  <option value="">-- Select Airport --</option>
  {airport.map((airport) => (
    <option key={airport._id} value={airport._id}>
      {airport.airport_name} ({airport.airport_code})
    </option>
  ))}
</select>
  
  </div>
  </div>
  </div>

  <div className="row">
    <div className="col-md-3">
  <div><label>Return From Terminal:</label><input type="text" name="r_from_terminal" className="form-control" onChange={handleChange} value={form.r_from_terminal}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Return To Terminal:</label><input type="text" name="r_to_terminal" className="form-control" onChange={handleChange} value={form.r_to_terminal}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Return Start Date:</label><input type="date" name="r_start_date" className="form-control" onChange={handleChange} value={form.r_start_date}/></div>
 </div>
 <div className="col-md-3">
   <div><label>Return Reach Date:</label><input type="date" name="r_reach_date" className="form-control" onChange={handleChange} value={form.r_reach_date}/></div>
  </div>
 </div>

 <div className="row">
  <div className="col-md-3">
  <div><label>Return Duration:</label><input type="text" name="r_duration" className="form-control" onChange={handleChange} value={form.r_duration}/></div>
   </div>
  <div className="col-md-3">
  <div><label>Return Hand Bag:</label><input type="text" name="r_hand_bag" className="form-control" onChange={handleChange} value={form.r_hand_bag}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Return Cabin Bag:</label><input type="text" name="r_cabin_bag" className="form-control" onChange={handleChange} value={form.r_cabin_bag}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Return Class Type:</label><input type="text" placeholder="e.g. Economy, Business, First Class" name="r_class_type" className="form-control" onChange={handleChange} value={form.r_class_type}/></div>
  </div>
</div>
</>
)}

<hr></hr>
<div className="row">
  <div className="col-md-3">
  <div><label>Flight Cost Consider:</label><input type="number" name="flight_cost_consider" className="form-control" onChange={handleChange} value={form.flight_cost_consider}/></div>
   </div>
  <div className="col-md-3">
  <div><label>Baggage Cost:</label><input type="number" name="bagage_cost" className="form-control" onChange={handleChange} value={form.bagage_cost}/></div>
  </div>
  <div className="col-md-3">
  <div><label>Total Flight Cost:</label><input type="number" name="total_flight_cost" className="form-control" onChange={handleChange} value={form.total_flight_cost}/></div>
 </div>
</div>
<hr></hr>
   <div className="row">
  <div className="col-md-3"></div>
  <div className="col-md-3"></div>
  <div className="col-md-3">
  <div><button className="btn btn-primary btn-sm" type="button" onClick={saveData}>Submit</button>
  <button className="btn btn-secondary btn-sm" type="button" onClick={() => setPop(false)}>Cancel</button>

  </div>
  </div>
  </div>
</form>

)}


                
            </div>
           </div>
         </div>  
        </div>   
     
    </>
  )
}

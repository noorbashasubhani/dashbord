import React from 'react'
import { useState,useReducer,useEffect } from 'react'
import { API_URL } from '../data/apiUrl'
import Select from 'react-select';



export const Cruise = ({ customerData, row_id , onUpdate}) => {
    const [data,setData]=useState([]);
    const [form,setForm]=useState({
    cruise_supp:'',cruise_name:'',contact_person:'',contact_number:'',
    start_date:'',end_date:'',start_city:'',end_city:'',cabin_type:'',
    meal_plan:'',no_of_ninghts:'',no_of_adults:'',no_of_children:'',
    no_of_cabin:'',total_cost:'',selling_cities:[],id: ''
    });
    const [pop,setPop]=useState(false);
     const [cityOptions, setCityOptions] = useState([]);

    
const handleCityChange = (selectedOptions) => {
    setForm((prevForm) => ({
      ...prevForm,
      selling_cities: selectedOptions ? selectedOptions.map((opt) => opt.value) : []
    }));
  };

  const getCity=async()=>{
    try{
      const datacity=await fetch(`${API_URL}/vendor/Cruise-Destination`);
      if(!datacity.ok){
        throw new Error('This is not getting data');
      }
      const Datas=await datacity.json();
      const citlid=await Datas.data;
      const formatted = citlid.map((city) => ({
          value: city._id,
          label: city.destination_name
        }));
      setCityOptions(formatted);
    }catch(err){
      console.log(err.message);
    }
  }

   useEffect(() => {
  getCity();
  getCruise();
}, []);

useEffect(() => {
  if (form.start_date && form.end_date) {
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setForm(prev => ({ ...prev, no_of_ninghts: diffDays }));
  }
}, [form.start_date, form.end_date]);



    const getCruise=async()=>{

        try{
        const resp = await fetch(`${API_URL}/vendor/Cruise/${row_id}`);
        console.log('Response status:', resp.status); // 👈 Add thi
        if (!resp.ok) {
            throw new Error('Data not fetching in this url');
         }
        const getingdata = await resp.json();
        setData(getingdata.list);
        if (onUpdate) onUpdate();
        }catch(err){
            console.log(err.message);
        }

    }
    

   const FaUnderline=async(row_id)=>{
        try{
           const delData=await fetch(`${API_URL}/vendor/Cruise/${row_id}`,{
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

    const evenChange=(e)=>{
      const {name,value}=e.target;
      setForm((prevData) => ({
  ...prevData,
  [name]: value
}));

    }

    const saveData=async()=>{
        try{

          if(form.id){
const resData=await fetch(`${API_URL}/vendor/Cruise/${form.id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(form)
         });
          }else{
const resData=await fetch(`${API_URL}/vendor/Cruise/${row_id}`,{
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

    const editFun = (datss) => {
  setForm({
    cruise_supp: datss.cruise_supp || '',
    cruise_name: datss.cruise_name || '',
    contact_person: datss.contact_person || '',
    contact_number: datss.contact_number || '',
    start_date: datss.start_date || '',
    end_date: datss.end_date || '',
    start_city: datss.start_city || '',
    end_city: datss.end_city || '',
    cabin_type: datss.cabin_type || '',
    meal_plan: datss.meal_plan || '',
    no_of_ninghts: datss.no_of_ninghts || '',
    no_of_adults: datss.no_of_adults || '',
    no_of_children: datss.no_of_children || '',
    no_of_cabin: datss.no_of_cabin || '',
    total_cost: datss.total_cost || '',
    selling_cities: datss.selling_cities?.map(c => c._id) || [],
    id: datss._id
  });
  setPop(true);
};


  return (
    <>
    <div className="row mt-5" >
      <div className="col-lg-12" style={{ backgroundColor: 'lightblue' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Cruise   Details</h3>
            <button className="btn btn-primary btn-sm" onClick={()=>setPop(true)}>
              + Add Cruise 
            </button>
              
            <div className="table-responsive mt-4">
<table className="table table-stripped table-bordered">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Action</th>
      <th>Cruise Supp</th>
      <th>Cruise name</th>
      <th>contact_person</th>
      <th>contact_number</th>
      <th>start_date</th>
      <th>end_date</th>
      <th>start_city</th>
      <th>end_city</th>
      <th>cabin_type</th>
      <th>meal_plan</th>
      <th>no_of_nights</th>
      <th>no_of_adults</th>
      <th>no_of_children</th>
      <th>no_of_cabin</th>
      <th>total_cost</th>
      <th>Selling Cities</th>
    </tr>
  </thead>
  <tbody>
{data && data.length > 0 ? (
  data.map((item, index) => (
    <tr key={item._id || index}>
      <td>{index + 1}</td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={() => FaUnderline(item._id)}>Delete</button>
        <button className="btn btn-primary btn-sm" onClick={() => editFun(item)}>Edit</button>
      </td>
      <td>{item.cruise_supp}</td>
      <td>{item.cruise_name}</td>
      <td>{item.contact_person}</td>
      <td>{item.contact_number}</td>
      <td>{item.start_date?.slice(0, 10)}</td>
      <td>{item.end_date?.slice(0, 10)}</td>
      <td>{item.start_city}</td>
      <td>{item.end_city}</td>
      <td>{item.cabin_type}</td>
      <td>{item.meal_plan}</td>
      <td>{item.no_of_ninghts}</td> {/* ✅ Correct spelling */}
      <td>{item.no_of_adults}</td>
      <td>{item.no_of_children}</td>
      <td>{item.no_of_cabin}</td>
      <td>{item.total_cost}</td>
      <td>
        {item.selling_cities?.length > 0
          ? item.selling_cities.map((city, idx) => (
              <span key={city._id}>
                {city.destination_name}
                {idx < item.selling_cities.length - 1 ? ', ' : ''}
              </span>
            ))
          : 'N/A'}
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="18" className="text-center">No Cruise Data Found</td>
  </tr>
)}

  </tbody>
</table>
             {pop && (
  <div className="mt-4">
    <div className="row">
      {/* Cruise Supplier */}
      <div className="col-md-3 mb-2">
        <label>Cruise Supplier</label>
        <input
          type="text"
          className="form-control"
          name="cruise_supp"
          value={form.cruise_supp}
          onChange={evenChange}
        />
      </div>

      {/* Cruise Name */}
      <div className="col-md-3 mb-2">
        <label>Cruise Name</label>
        <input
          type="text"
          className="form-control"
          name="cruise_name"
          value={form.cruise_name}
          onChange={evenChange}
        />
      </div>

      {/* Contact Person */}
      <div className="col-md-3 mb-2">
        <label>Contact Person</label>
        <input
          type="text"
          className="form-control"
          name="contact_person"
          value={form.contact_person}
          onChange={evenChange}
        />
      </div>

      {/* Contact Number */}
      <div className="col-md-3 mb-2">
        <label>Contact Number</label>
        <input
          type="text"
          className="form-control"
          name="contact_number"
          value={form.contact_number}
          onChange={evenChange}
        />
      </div>

      {/* Start Date */}
      <div className="col-md-3 mb-2">
        <label>Start Date</label>
        <input
          type="date"
          className="form-control"
          name="start_date"
          value={form.start_date}
          onChange={evenChange}
        />
      </div>

      {/* End Date */}
      <div className="col-md-3 mb-2">
        <label>End Date</label>
        <input
          type="date"
          className="form-control"
          name="end_date"
          value={form.end_date}
          onChange={evenChange}
        />
      </div>

      {/* Start City */}
      <div className="col-md-3 mb-2">
        <label>Start City</label>
        <input
          type="text"
          className="form-control"
          name="start_city"
          value={form.start_city}
          onChange={evenChange}
        />
      </div>

      {/* End City */}
      <div className="col-md-3 mb-2">
        <label>End City</label>
        <input
          type="text"
          className="form-control"
          name="end_city"
          value={form.end_city}
          onChange={evenChange}
        />
      </div>

      {/* Cabin Type */}
      <div className="col-md-3 mb-2">
        <label>Cabin Type</label>
        <input
          type="text"
          className="form-control"
          name="cabin_type"
          value={form.cabin_type}
          onChange={evenChange}
        />
      </div>

      {/* Meal Plan */}
      <div className="col-md-3 mb-2">
        <label>Meal Plan</label>
        <input
          type="text"
          className="form-control"
          name="meal_plan"
          value={form.meal_plan}
          onChange={evenChange}
        />
      </div>

      {/* Nights */}
      <div className="col-md-3 mb-2">
        <label>No. of Nights</label>
        <input
          type="number"
          className="form-control"
          name="no_of_ninghts"
          value={form.no_of_ninghts}
          onChange={evenChange}
        />
      </div>

      {/* Adults */}
      <div className="col-md-3 mb-2">
        <label>No. of Adults</label>
        <input
          type="number"
          className="form-control"
          name="no_of_adults"
          value={form.no_of_adults}
          onChange={evenChange}
        />
      </div>

      {/* Children */}
      <div className="col-md-3 mb-2">
        <label>No. of Children</label>
        <input
          type="number"
          className="form-control"
          name="no_of_children"
          value={form.no_of_children}
          onChange={evenChange}
        />
      </div>

      {/* Cabins */}
      <div className="col-md-3 mb-2">
        <label>No. of Cabins</label>
        <input
          type="number"
          className="form-control"
          name="no_of_cabin"
          value={form.no_of_cabin}
          onChange={evenChange}
        />
      </div>

      {/* Total Cost */}
      <div className="col-md-3 mb-2">
        <label>Total Cost</label>
        <input
          type="number"
          className="form-control"
          name="total_cost"
          value={form.total_cost}
          onChange={evenChange}
        />
      </div>
      <div className="col-md-3 mb-2">
  <label>Selling Cities</label>
 
     <Select
  isMulti
  options={cityOptions}
  value={cityOptions.filter((opt) => form.selling_cities.includes(opt.value))}
  onChange={(selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      selling_cities: selectedOptions.map((opt) => opt.value), // <-- send _ids only
    }));
  }}
/>
</div>
    </div>

   
  





    <div className="col-md-4 mb-2">
    <button className="btn btn-success btn-sm me-2" onClick={saveData}>
      Save
    </button>
    <button className="btn btn-secondary btn-sm" onClick={() => setPop(false)}>
      Cancel
    </button>
    </div>
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

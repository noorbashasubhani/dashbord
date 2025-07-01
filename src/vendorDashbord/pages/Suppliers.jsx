import React from 'react'
import { useState,useReducer,useEffect } from 'react'
import { API_URL } from '../data/apiUrl'

const initial={
      supparrays:[],
      error_msg:'',
      
}
const reduce = (state, action) => {
  switch (action.type) {
    case 'FETC':
      return { ...state, supparrays: action.payload, error_msg: '' };
    case 'FETC_ERROR':
      return { ...state, error_msg: action.payload };
    case 'DELETE':
      return {
        ...state,
        supparrays: state.supparrays.filter(item => item._id !== action.payload),
      };
    default:
      return state;
  }
};

export const Suppliers = ({ customerData, row_id, onUpdate }) => {
    const [show,setShow]=useState(false);
    const [form,setForm]=useState({
        location:'',
        provison_date:'',
        supp_name:'',
        supp_cost:''
    })
    const [state,dispatch]=useReducer(reduce,initial);
    const getSuppliers=async()=>{
        try{
            const res=await fetch(`${API_URL}/vendor/supplimentry/${row_id}`);
            if(!res.ok){
                throw new Error('Data not coming in this url');
            }
            const resdata=await res.json();
            dispatch({type:'FETC',payload:resdata.data});
            if (onUpdate) onUpdate();
        }catch(err){
         console.log(err.message);
         dispatch({type:'FETC',error_msg:err.message});
        }

    }
    useEffect(()=>{
        getSuppliers();
    },[]);


   const defaultColumn=async(row_id)=>{
      try{
      const deldata=await fetch(`${API_URL}/vendor/supplimentry/${row_id}`,{
        method:'DELETE'
      });
      if(!deldata.ok){
        throw new Error('Data not found for this link');
      }
      getSuppliers();
    }catch(err){
       console.log(err.message);
    }
   }


   const addSup=()=>{
    setShow(true);
   }
   const closeModal=()=>{
    setShow(false);
   }

   const inputFhange=(e)=>{
      const {name,value}=e.target;
      setForm(prevData=>({...prevData,[name]:value}));
   }

   const saveFunc=async()=>{
   
     try{

      if (form._id) {
              const insData=await fetch(`${API_URL}/vendor/supplimentry/${form._id}`,{
              method:'PUT',
              headers:{
                'Content-Type':'application/json',
              },
              body:JSON.stringify(form)
              });
      }else{
             const insData=await fetch(`${API_URL}/vendor/supplimentry/${row_id}`,{
              method:'POST',
              headers:{
                'Content-Type':'application/json',
              },
              body:JSON.stringify(form)
            });
      }
       


setShow(false);
getSuppliers();
     }catch(err){
        console.log(err.message);
     }
   }

  const editFun=(item)=>{
    
    setForm({
      _id: item._id,
    location: item.location || '',
    provison_date: item.provison_date || '',
    supp_name: item.supp_name || '',
    supp_cost: item.supp_cost || ''
  });
  setShow(true);

  }

  return (
    <>
    <div className="row mt-5" >
      <div className="col-lg-12" style={{ backgroundColor: 'lightgreen' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Supplementary   Details</h3>
            <button className="btn btn-primary btn-sm" onClick={addSup}>
              + Add Supplementary 
            </button>
               {state.error_msg ? state.error_msg :''}
            <div className="table-responsive mt-4">
                <table className="table table-stripped table-bordered">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Location</th>
                      <th>Provision Date provison_date</th>
                      <th>Supp Name</th>
                      <th>Supp Cost</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                   {state.supparrays.length > 0 ? (
                      state.supparrays.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index+1}</td>
                          <td>{item.location}</td>
                          <td>{item.provison_date}</td>
                          <td>{item.supp_name}</td>
                          <td>{item.supp_cost}</td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={()=>defaultColumn(item._id)}>Delete</button>
                            
                            <button className="btn btn-primary btn-sm" onClick={() => editFun(item)}>Edit</button>

                            </td>
                          
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No Data Found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {show && (
  <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Create Supplementary</h5>
          <button type="button" className="btn-close" onClick={closeModal}></button>
        </div>
        <div className="modal-body">
          <input type="text" placeholder="Location" name="location" onChange={inputFhange} value={form.location} className="form-control mb-2" />
          <input type="date" placeholder="Provision Date" name="provison_date" onChange={inputFhange} className="form-control mb-2"  value={form.provison_date}/>
          <input type="text" placeholder="Supplementary Name" name="supp_name" onChange={inputFhange} className="form-control mb-2" value={form.supp_name}/>
          <input type="number" placeholder="Cost" name="supp_cost" onChange={inputFhange} className="form-control mb-2" value={form.supp_cost}/>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={saveFunc}>Save</button>
          <button className="btn btn-secondary" onClick={closeModal}>Close</button>
        </div>
      </div>
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

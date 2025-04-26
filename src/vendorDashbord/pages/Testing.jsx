import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { API_URL } from '../data/apiUrl';

function App() {
  const [addpop,setAddpop]=useState(false);
  const [aldata,setAldata]=useState([]);
  const [form,setForm]=useState({
    stock_name:''
  });

  const [errr,setErr]=useState({
    stock_name:''
  });

  const addFunc=()=>{
    setAddpop(true);
  }

  const formValidation=()=>{
      const Msg={};
      let isValid=true;
      if(!form.stock_name){
        Msg.stock_name='Please Enter Data Here';
        isValid=false;
      }
      setErr(Msg);
      return isValid;
  }

  const eventChange=(e)=>{
     const {name,value}=e.target;
     setForm((preData)=>({...preData,[name]:value}));
  }

  const saveFun=async()=>{
      if(!formValidation()){
        return;
      }

      if(editid){

        const responce=await fetch(`${API_URL}/vendor/Assets/${editid}`,{
          method:'put',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify(form)
        });
        if(!responce.ok){
            throw new Error('Please Check this error');
        }

        const datas=await responce.json();
        setAddpop(false);

        setAldata((pred)=>pred.map((itc)=>itc._id===editid ? {...itc,...form }: itc));

      }else{
      const responce=await fetch(`${API_URL}/vendor/Assets`,{
        method:'post',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(form)
      });
        if(!responce.ok){
           throw new Error('Please Check this error');
        }
        const datas=await responce.json();
        setAddpop(false); 
        setAldata((preData)=>([...preData,datas.data]));
      }
  }

  useEffect(()=>{

      // setTimeout=(()=>setLoad(false),5000);
       setTimeout(() => setLoad(false), 500);


    const getData=async()=>{
       const responce=await fetch(`${API_URL}/vendor/Assets`); 
       if(!responce.ok){
        throw new Error('Please Check this error');
     }
     const datas=await responce.json();
     setAldata(datas.data); 
    }
    getData();
  },[]);

  const [delid,setDelid]=useState(null);
  const [delpop,setDelpop]=useState(false);
   
  const defaultColumn=(id)=>{
    setDelid(id);
    setDelpop(true);
  }

  const saveRow=async(row_id)=>{

       try{
          const responce=await fetch(`${API_URL}/vendor/Assets/${row_id}`,{
            method:'delete',
            headers:{
              'Content-Type':'application/json'
            }
          });
          if(!responce.ok){
            throw new Error('Please Check this error');
         }
         setDelpop(false);
         setAldata(aldata.filter((itm)=>itm._id !==row_id));
       }catch(error){
          console.log(error.message);
       }

  }




 const [editid,setEditid]=useState(null);

  const editFun=(row_id)=>{
    setEditid(row_id);
 
    setAddpop(true);
    const editData=aldata.find((itms)=>itms._id===row_id);
    //console.log(editData);
    if(editData){
      setForm({
        stock_name:editData.stock_name
      });
      
    }
  }

const [search,setSearch]=useState("");

const searchFun=(e)=>{
  setSearch(e.target.value);
}

const searchData=aldata.filter((itmes)=>
  itmes.stock_name.toLowerCase().includes(search.toLowerCase())
);

const [load,setLoad]=useState(true);

  return (
    <div className="">
        <div>
           <button className="btn btn-sm btn-primary mt-5" onClick={addFunc}>+ Add Stock</button>
        </div>
        <div>
           <a className="btn btn-sm btn-primary mt-5" href="addregister">+ Add Stock</a>
        </div>

        <div>
          <input type="text" name="search_data" value={search} onChange={searchFun} className="form-control my-5" placeholder='Please Search Text Here'/>
          <table className="table table-stripped table-borderd">
            <thead>
              <tr>
                <td>S.No</td>
                <td>Names</td>
                <td>Action</td>
              </tr>
            </thead>
            {searchData.length > 0 ? (
            <tbody>
  {load ? (
    <tr>
      <td colSpan={3} className="text-center">
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </td>
    </tr>
  ) : (
    searchData.map((item, index) => (
      <tr key={item._id}>
        <td>{index + 1}</td>
        <td>{item.stock_name}</td>
        <td>
          <button className="btn btn-sm btn-danger" onClick={() => defaultColumn(item._id)}>Delete</button>
          <button className="btn btn-sm btn-primary" onClick={() => editFun(item._id)}>Edit</button>
        </td>
      </tr>
    ))
  )}
</tbody>
):(
  <tr>
    <td colSpan={3}><center>No data found</center></td>
  </tr>
)}
          </table>
        </div>
        {addpop && (

<div class="modal show" style={{display:'block'}} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Add Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setAddpop(false)}></button>
      </div>
      
      <div class="modal-body">
        <label>Enter Stock Name:</label>
        <input type="text" className="form-control" name="stock_name" value={form.stock_name} onChange={eventChange}/>
        {errr.stock_name && (<p className="text-warning">{errr.stock_name}</p>)}
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>setAddpop(false)}>Close</button>
        <button type="button" class="btn btn-primary" onClick={()=>saveFun()}>Save changes</button>
      </div>
      
    </div>
  </div>
</div>

        )}


{delpop && (

<div class="modal show" style={{display:'block'}} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Remove Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setDelpop(false)}></button>
      </div>
      
      
      
      <div class="modal-footer">
        <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal" onClick={()=>setDelpop(false)}>Close</button>
        <button type="button" class="btn btn-sm btn-danger" onClick={()=>saveRow(delid)}>Yes Delete</button>
      </div>
      
    </div>
  </div>
</div>

        )}
    </div>
  );
}

export default App;

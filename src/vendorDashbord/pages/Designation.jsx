import React, { useState, useEffect, useReducer } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import DataTable from 'react-data-table-component';
import { Departments } from './Departmnets';
const initial={
  formData:{
    department:'',
    name:''
  },
  showPop:false,
  departmentList:[],
  tableData:[]
}


const reducer=(state,action)=>{
    switch(action.type){
       case 'SHOW':return {...state,showPop:true}
       case 'HIDE':return {...state,showPop:false}
       case 'DEPT':return {...state,departmentList:action.payload}
       case 'SAVE':return {...state,formData:{...state.formData,[action.payload.name]:action.payload.value}}
case 'FETCH': return {...state, tableData: action.payload }
default: return state;
    }
}

const Designation = () => {
  const [gdata,setGdata]=useState([]);
  const [state,dispacth]=useReducer(reducer,initial);
  const openOpo=()=>{
    dispacth({type:'SHOW'});
  }
  

  const depatList=async()=>{
    const respnce=await fetch(`${API_URL}/vendor/Dept`);
    if(!respnce.ok){
      throw new Error('Data not comming using this Departmns');
    }
    const destlist=await respnce.json();
    dispacth({type:'DEPT',payload:destlist.data});
  }

  const desgList=async()=>{
    const respnce=await fetch(`${API_URL}/vendor/Desg`);
    if(!respnce.ok){
      throw new Error('Data not comming using this Departmns');
    }
    const destlist=await respnce.json();
    dispacth({type:'FETCH',payload:destlist.designations});
  }
  useEffect(()=>{
    depatList();
    desgList();
    Datalist();
  },[]);
  const evenChage=(e)=>{
    dispacth({type:'SAVE',payload:{name:e.target.name,value:e.target.value}});
  }

  
  const addFun=async(e)=>{
   
    e.preventDefault();
      const sdavedData=await fetch(`${API_URL}/vendor/Add-Designations`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(state.formData)
      });
      dispacth({type:'HIDE'});
       desgList();
      if(!sdavedData.ok){
      throw new Error('Data not saved');
      }
  }        

 const delFun=async(row_id)=>{
      try{
        const datalist=await fetch(`${API_URL}/vendor/Desg/${row_id}`,{
          method:'DELETE'
        });
         desgList();
      }catch(err){
          console.log(err.message);
      }
 }

  const column = [
  { name: '#', selector: (row, index) => index + 1, sortable: true },
  {
    name: 'Department Name',
    selector: row => row.department?.name || 'N/A',
    sortable: true
  },
  { name: 'Designation', selector: row => row.name, sortable: true },
  {name:'Action',cell:row=>(<button className="btn btn-danger btn-sm" onClick={()=>delFun(row._id)}>Delete</button>)}
];

const Datalist = async () => {
  const response = await fetch(`${API_URL}/vendor/GroupDesinations`);
  if (!response.ok) {
    throw new Error('Failed to fetch grouped data');
  }

  const json = await response.json(); // Assuming `json.data` holds your object

  const transformed = Object.entries(json.data).map(([department, designations]) => ({
    department,
    designations,
  }));

  setGdata(transformed);
};




  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Departments & Designation Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="#">Departments</a>
              </li>
              <li className="breadcrumb-item active">Designation</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={openOpo}>
              + Add Designation
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Departments & Designation Details</h6>
                  <p style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>

                 

                <DataTable title='Department-Designiation List' columns={column} data={state.tableData} pagination/>
              



                </div>
              </div>
            </div>
          </div>
          {state.showPop && (
  <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add New Designation</h5>
          <button type="button" className="btn-close" onClick={() => dispacth({ type: 'HIDE' })}></button>
        </div>
        <form onSubmit={addFun}>
          <div className="modal-body">
            <div className="mb-3">
  <label className="form-label">Select Department</label>
  <select
    name="department"
    className="form-select"
    value={state.formData.department}
    onChange={evenChage}
    required
  >
    <option value="">-- Select Department --</option>
    {state.departmentList.map((dept) => (
      <option key={dept._id} value={dept._id}>
        {dept.name}
      </option>
    ))}
  </select>
</div>

            <div className="mb-3">
              <label className="form-label">Designation Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={state.formData.name}
                onChange={evenChage}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => dispacth({ type: 'HIDE' })}>Close</button>
            <button type="button" className="btn btn-primary" onClick={addFun}>Add</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

        </section>
      </main>


      <Departments />
      <Footer />
    </>
  );
};

export default Designation;

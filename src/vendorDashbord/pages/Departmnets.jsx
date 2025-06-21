import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import SideMenu from '../components/SideBar'
import Footer from '../components/forms/Footer'
import { useState,userEffect,useReducer } from 'react'
import { API_URL } from '../data/apiUrl'
import DataTable from 'react-data-table-component'

const initialstate={
    deptList:[],
    formData:{
        name:'',
        _id:''
    }
}
const reducer=(state,action)=>{
   switch(action.type){
      case 'LIST':
        return {...state,deptList:action.payload}
       case 'SAVE':
        return {...state,formData:{...state.formData,[action.payload.name]:action.payload.value}} 
       case 'RESET':
        return {...state,formData:{name:''}} 
        default:return state;
   }
}


export const Departments = () => {

    const [state,dispatch]=useReducer(reducer,initialstate);

const getData=async()=>{
    try{
      const responce=await fetch(`${API_URL}/vendor/Dept`);
      if(!responce.ok){
        throw new Error('Please Check Data not comming..');
      }
      const result=await responce.json();
      dispatch({type:'LIST',payload:result.data})
    
    }catch(err){
      console.log(err.message);
    }
}

useEffect(()=>{
    getData();
},[]);

const delFun=async(row_id)=>{
    try{
        const delData=await fetch(`${API_URL}/vendor/Dept/${row_id}`,{
            method:'DELETE'
        });
        if(!delData.ok){
            throw new Error('Data not deleting in this url');
        }
        getData();
    }catch(err){
        console.log(err.message);
    }
}

const column=[
    {name:'#',selector:(row,index)=>index+1,sortable:true},
    {name:"Department Name",selector:row=>row.name,sortable:true},
    {name:'Action',cell:(row)=>(
        <button className="btn btn-danger btn-sm" onClick={()=>delFun(row._id)}>Delete</button>
    )}
];
const changeEvent=(e)=>{
     dispatch({type:'SAVE',payload:{name:e.target.name,value:e.target.value}});
}
const saveData=async(e)=>{
  e.preventDefault();
  try{
     const saveData=await fetch(`${API_URL}/vendor/Add-Dept`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(state.formData)
     });
     getData();
     dispatch({type:'RESET'});
     if(!saveData.ok){
        throw new Error('Data not found please check this');
     }
  }catch(err){
      console.log(err.message);
  }
}
  return (
    <>
    
    <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Department Creating</b></h4>
          <nav className="d-flex align-items-center">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Department</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ "font-size": "14px" }}>Department Details Table </h6>
                  <p className="" style={{ "font-size": "13px", "margin-top": "-15px" }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  <div className="container">
 
  <form className="my-5" onSubmit={saveData}>
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="name">Package Code </label>
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Enter your full name"
          name="name"
          value={state.formData.name}
          onChange={changeEvent}
        />
        
      </div>
    </div>
    {/* Submit Button */}
    <button type="submit" className="btn btn-primary">
      Submit
    </button>
  </form>
  
  <DataTable titel="Department List" columns={column} data={state.deptList} pagination/>
                </div>

                  
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </main>
   
    </>
  )
}

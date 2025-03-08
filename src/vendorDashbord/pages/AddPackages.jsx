import React from 'react'
import NavBar from '../components/NavBar'
import SideMenu from '../components/SideBar'
import Footer from '../components/forms/Footer'
import { useState,userEffect } from 'react'

export const AddPackages = () => {
const [newData,SetNewData]=useState({
    full_name:''
});
const [error,setError]=useState({
     full_name:''
});


// Input Enter Data
const inputTextField=(e)=>{
   const {name,value}=e.target;
   SetNewData({...newData,[name]:value});
}
// form validation 
 const formvalidation=()=>{
    const error={};
    let sisV=true;
    if(!newData.full_name){
      error.full_name='Please Enter Valid Date';
      sisV=false;
      
    }
    setError(error);
    return sisV;

}

 // form submit functionality
 const formSubmit=(elem)=>{
    elem.preventDefault();
    formvalidation();
 }
  return (
    <>
    <NavBar />
    <SideMenu />
    <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Package Creating</b></h4>
          <nav className="d-flex align-items-center">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Package</a>
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
                  <h6 className="card-title" style={{ "font-size": "14px" }}>Package Details Table </h6>
                  <p className="" style={{ "font-size": "13px", "margin-top": "-15px" }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  <div className="container">
 
  <form onClick={formSubmit}>
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="name">Package Code </label>
        <input
          type="text"
          className="form-control"
          id="full_name"
          placeholder="Enter your full name"
          name="full_name"
          onChange={inputTextField}
          value={newData.full_name}
        />
        {error.full_name && <span className="text-danger">{error.full_name}</span>}
      </div>
    </div>
    {/* Submit Button */}
    <button type="submit" className="btn btn-primary">
      Submit
    </button>
  </form>
                </div>

                  
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </main>
    <Footer />
    </>
  )
}

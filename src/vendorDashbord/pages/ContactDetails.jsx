import NavBar from '../components/NavBar'
import SideMenu from '../components/SideBar'
import Footer from '../components/forms/Footer'
import { useState,useEffect,useReducer } from 'react'
import { API_URL } from '../data/apiUrl'
import DataTable from 'react-data-table-component'

const initialstate={
    emplist:[]
}
const reducer=(state,action)=>{
   switch(action.type){
      case 'LIST':
        return {...state,emplist:action.payload}
        default:return state;
   }
}


export const ContactDetails = () => {

    const [state,dispatch]=useReducer(reducer,initialstate);

const getData=async()=>{
    try{
      const responce=await fetch(`${API_URL}/vendor/Userlist`);
      if(!responce.ok){
        throw new Error('Please Check Data not comming..');
      }
      const result=await responce.json();
      dispatch({type:'LIST',payload:result})
    
    }catch(err){
      console.log(err.message);
    }
}

useEffect(()=>{
    getData();
},[]);



const column=[
    {name:'#',selector:(row,index)=>index+1,sortable:true},
    {name:"Father Name",selector:row=>row.fathername,sortable:true},
    {name:"Mother Name",selector:row=>row.mothername,sortable:true},
    {name:"Cast Name",selector:row=>row.castname,sortable:true},
    {name:"Date Of Birth",selector:row=>row.date_of_birthday,sortable:true},
    
    { name: "Designation", selector: row => row.designation_id?.name || 'N/A', sortable: true },

    {name:"Office Contact details",selector:row=>row.mobile_no,sortable:true},
    {name:"in - House Number",selector:row=>row.in_house_no,sortable:true},
    
];


  return (
    <>
      <NavBar />
      <SideMenu />
    <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Contact Details</b></h4>
          <nav className="d-flex align-items-center">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Employees</a>
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
 
  
  
                 
                  <DataTable title="Contact Details" columns={column} data={state.emplist} pagination />

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

import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LeadsTabs = ({ tabs }) => {
     const navigate = useNavigate();
   const [tab,setTab]=useState(tabs);

   const leadstab = () =>{
    navigate('/Lead');
  }
  const leadstabdel = () =>{
    navigate('/Lead-delete');
  }
  const monthwiseleads = () =>{
    navigate('/Month-wise_leads');
  }
  return (
    <div>
        <ul class="nav nav-tabs" id="leadsTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button className={`nav-link ${tabs === 1 ? 'active' : ''}`} id="active-tab" data-bs-toggle="tab" 
          data-bs-target="#active" type="button" role="tab" onClick={leadstab}>Active Leads</button>
        </li>
        <li class="nav-item" role="presentation">
          <button className={`nav-link ${tabs === 2 ? 'active' : ''}`} id="deleted-tab" data-bs-toggle="tab" 
          data-bs-target="#deleted" type="button" role="tab" onClick={leadstabdel}>Deleted Leads</button>
        </li>
        <li class="nav-item" role="presentation">
          <button className={`nav-link ${tabs === 3 ? 'active' : ''}`} id="day-tab" data-bs-toggle="tab" 
          data-bs-target="#day" type="button" role="tab" onClick={monthwiseleads}>Day-wise Leads</button>
        </li>
                    
                  </ul>
    </div>
  )
}

export default LeadsTabs
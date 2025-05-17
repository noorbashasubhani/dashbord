import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ItenaryTabs = ({ tabs }) => {
     const navigate = useNavigate();
   const [tab,setTab]=useState(tabs);

   const pendingtab = () =>{
    navigate('/Pending-Itenary');
  }
  const publishedTab = () =>{
    //navigate('/Lead-delete');
  }
  const confirmedTab = () =>{
   // navigate('/Lead-delete');
  }
  const cancelledTab = () =>{
   // navigate('/Lead-delete');
  }
  const deletedTab = () =>{
    navigate('/Delete-Itenary');
  }

  return (
    <div>
        <ul class="nav nav-tabs" id="leadsTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button className={`nav-link ${tabs === 1 ? 'active' : ''}`} id="active-tab" data-bs-toggle="tab" 
          data-bs-target="#active" type="button" role="tab" onClick={pendingtab}>Pending</button>
        </li>
        <li class="nav-item" role="presentation">
          <button className={`nav-link ${tabs === 2 ? 'active' : ''}`} id="active-tab" data-bs-toggle="tab" 
          data-bs-target="#active" type="button" role="tab" onClick={publishedTab}>Published</button>
        </li>
        <li class="nav-item" role="presentation">
          <button className={`nav-link ${tabs === 3 ? 'active' : ''}`} id="day-tab" data-bs-toggle="tab" 
          data-bs-target="#day" type="button" role="tab" onClick={confirmedTab}>Confirmed</button>
        </li>
        <li class="nav-item" role="presentation">
          <button className={`nav-link ${tabs === 4 ? 'active' : ''}`} id="day-tab" data-bs-toggle="tab" 
          data-bs-target="#day" type="button" role="tab" onClick={cancelledTab}>Cancelled</button>
        </li>
        <li class="nav-item" role="presentation">
          <button className={`nav-link ${tabs === 5 ? 'active' : ''}`} id="deleted-tab" data-bs-toggle="tab" 
          data-bs-target="#deleted" type="button" role="tab" onClick={deletedTab}>Deleted</button>
        </li>
        
                    
                  </ul>
    </div>
  )
}

export default ItenaryTabs;
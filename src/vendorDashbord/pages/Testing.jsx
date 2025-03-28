import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../data/apiUrl';

const Testing = () => {
  const [loadiing,setLoading]=useState(false);
 
  useEffect(()=>{
    const datafech=async()=>{
      try{
          const responce=await fetch(`${API_URL}/vendor/Assets`);
          if(!responce.ok){
            throw new Error('This data is getting ');
          }
      }catch(err){
          console.log(err.message);
      }finally{
        setLoading(false);
      }
    };
    datafech();
  },[]);

  return (
    <div>
     
      <table className="table table-stripped table-borderd">
       
          <thead>
           <tr>
            <th>S.No</th>
            <th>Stack Name</th>
            <th>Quantity</th>
            <th>Action</th>
           </tr>
          </thead>
        
      </table>

    </div>
  );
};

export default Testing;

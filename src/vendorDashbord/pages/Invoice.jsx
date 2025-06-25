import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { API_URL } from '../data/apiUrl';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';

const deductionTypes = [
  { label: 'One Time', value: 'one_time' },
  { label: 'Recurring', value: 'recurring' }
];

const deductionTowardsOptions = [
  { label: 'Packages', value: 'packages' },
  { label: 'Others', value: 'others' }
];

const Invoice = () => {


  return (

    

         <>
          <h5>All Invoice</h5>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Partner</th>
                <th>Type</th>
                <th>Cycle</th>
                <th>Amount</th>
                <th>Towards</th>
                <th>GHRN No</th>
                <th>Particulars</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              
            </tbody>
          </table>
        </>

       
    
      
  );
};

export default Invoice;

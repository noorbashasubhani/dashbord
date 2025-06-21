import React, { useReducer, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { API_URL } from '../data/apiUrl';

const initialstate = {
  tableList: [],
  formData:{
    name:'',
    email:'',
    message:'',
    _id:''
  },
  isEdit:false,
  editId:null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCHING':
      return { ...state, tableList: action.payload };
     case 'ADD':
      return {...state,formData:{...state.formData,[action.payload.name]:action.payload.value}} 
      case 'RESET':
        return {...state,formData: { name: '', email: '', message: '', _id: '' },isEdit:false}
      case 'EDIT':
        return { ...state, 
        isEdit: true, 
        editId: action.payload.editId, 
        formData: action.payload.formData }  
    default:
      return state;
  }
};



const Message = () => {
  const [state, dispatch] = useReducer(reducer, initialstate);
  const [search, setSearch] = useState('');

  const columns = [
  {
    name: '#',
    selector: (row, index) => index + 1,
    sortable: false,
    width: '60px',
    center: true,
  },
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Email', selector: row => row.email, sortable: true },
  { name: 'Message', selector: row => row.message, sortable: true },
  {
    name: 'Action',
    cell: (row) => (
     <div className="d-flex gap-2">
      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row._id)}>Delete</button>

      <button
        className="btn btn-sm btn-warning"
        onClick={() => handleEdit(row)}
      >
        Edit
      </button>
    </div>
    ),
    button:true
  }
];

  const handleDelete=async(row_id)=>{
      try{
      const dataDel=await fetch(`${API_URL}/vendor/Mess/${row_id}`,{
        method:'DELETE'
      });
        getFun();
      }catch(err){
        console.log(err.message);
      }
  }

  const handleEdit=(rowData)=>{
      dispatch({type:'EDIT',payload:{isEdit:true,editId:rowData._id,formData:{name: rowData.name,
      email: rowData.email,
      message: rowData.message,
      _id: rowData._id
      }}})
  }

  const getFun = async () => {
    try {
      const getDataa = await fetch(`${API_URL}/vendor/Mess`);
      if (!getDataa.ok) {
        throw new Error('Data not coming using this link');
      }
      const tableData = await getDataa.json();
      dispatch({ type: 'FETCHING', payload: tableData.data });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getFun();
  }, []);

  const inputChange=(e)=>{
        dispatch({type:'ADD',payload:{name:e.target.name,value:e.target.value}});
  }

  const searchFilter = state.tableList.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.email?.toLowerCase().includes(search.toLowerCase()) ||
    item.message?.toLowerCase().includes(search.toLowerCase())
  );

  const saveData=async(e)=>{
    e.preventDefault();
    try{
        const url=state.isEdit ? `${API_URL}/vendor/Mess/${state.editId}` : `${API_URL}/vendor/Mess`;
        const method=state.isEdit ? 'PUT':'POST';

        const responce=await fetch(url,{
          method,
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(state.formData)
        });
        if(!responce.ok){
          throw new Error('Data not saved here');
        }
      getFun();
      dispatch({type:'RESET'});
    }catch(err){
            console.log(err.message);
    }
  }

  const resetdata=()=>{
    dispatch({type:'RESET'});
  }

  

  return (
    <div className="container mt-4">
      <center>
        <h3>{state.isEdit ? ('Edit The Details'):('Add The Details')}</h3>
        <form style={{ maxWidth: '500px' }} onSubmit={saveData}>
          <input name="name" placeholder="Name" className="form-control mb-2" value={state.formData.name} onChange={inputChange} required/>
          <input name="email" placeholder="Email" className="form-control mb-2" value={state.formData.email}  onChange={inputChange} required/>
          <textarea name="message" placeholder="Message" className="form-control mb-2" value={state.formData.message} onChange={inputChange} required/>
          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-sm btn-dark" onClick={resetdata}>Reset</button>
            <button type="submit" className="btn btn-sm btn-primary">{state.isEdit ? ('Edit Message'):('Save Message')}</button>
          </div>
        </form>
      </center>

      <div className="mt-4" id="print-section">
        <input
          type="text"
          name="search"
          placeholder="Search by name, email, or message"
          className="form-control mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />

        <DataTable
          title="Message Table"
          columns={columns}
          data={searchFilter}
          pagination
          striped
          highlightOnHover
          dense
          
        />
      </div>
    </div>
  );
};

export default Message;

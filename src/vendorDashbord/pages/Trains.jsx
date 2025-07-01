import React, { useEffect, useReducer } from 'react';
import { API_URL } from '../data/apiUrl';

const initialstatea = {
  transArray: [],
  error_message: '',
  showForm: false,
  isEditing: false,
  editingId: null,
  formdate: {
    fare_source: '',
    train_name: '',
    train_number: '',
    start_date: '',
    end_date: '',
    start_city: '',
    end_city: '',
    duration: '',
    class_name: '',
    site_available: '',
    cost: '',
    loading: '',
    total_cost: '',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCHING':
      return { ...state, transArray: action.payload };
    case 'FETCHINGERROR':
      return { ...state, error_message: action.payload };
    case 'OPENPOP':
      return { ...state, showForm: true };
    case 'CLOSEPOP':
      return { ...state, showForm: false };

    case 'START_EDIT':
      return {
        ...state,
        showForm: true,
        isEditing: true,
        editingId: action.payload._id,
        formdate: { ...action.payload },
      };

      case 'UPDATE_TRAIN':
  return {
    ...state,
    transArray: state.transArray.map(item =>
      String(item._id) === String(action.payload._id) ? action.payload : item
    ),
    showForm: false,
    isEditing: false,
    editingId: null,
    formdate: initialstatea.formdate,
  };


    case 'UPDATE_FORM':
      return {
        ...state,
        formdate: {
          ...state.formdate,
          [action.payload.name]: action.payload.value,
        },
      };
      
      case 'DELETE_TRAIN':
      return {
        ...state,
        transArray: state.transArray.filter(item => item._id !== action.payload),
      };
      case 'CAL':
      return {
        ...state,
        formdate: {
          ...state.formdate,
          total_cost: action.payload
        }
      };
    case 'ADD_TRAIN':
      return {
        ...state,
        transArray: [...state.transArray, action.payload],
        showForm: false,
      };
    default:
      return state;
  }
};



const Trains = ({ customerData, row_id ,onUpdate }) => {
  const [state, dispatch] = useReducer(reducer, initialstatea);

  const getTrainsDetails = async (row_id) => {
    try {
      const res = await fetch(`${API_URL}/vendor/Train/${row_id}`);
      if (!res.ok) {
        throw new Error('Data not fetching correctly.');
      }
      const data = await res.json();
      dispatch({ type: 'FETCHING', payload: data.list });
      if (onUpdate) onUpdate();
    } catch (err) {
      dispatch({ type: 'FETCHINGERROR', payload: err.message });
    }
  };

  useEffect(() => {
    getTrainsDetails(row_id);

    if(state.formdate.site_available && state.formdate.cost && state.formdate.loading){

      const site_available=parseFloat(state.formdate.site_available);
      const cost=parseFloat(state.formdate.cost);
      const loading=parseFloat(state.formdate.loading) / 100;
      const gross_total=site_available*cost;
      const after_loading=gross_total*loading;
      const total_cost=after_loading+gross_total;
       dispatch({ type: 'CAL', payload: total_cost.toFixed(2) });

    }

  }, [state.formdate.site_available,state.formdate.cost,state.formdate.loading,row_id]);

  const openAdd = () => dispatch({ type: 'OPENPOP' });
  const closeAdd = () => dispatch({ type: 'CLOSEPOP' });

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const url = state.isEditing
      ? `${API_URL}/vendor/Train/${state.editingId}`
      : `${API_URL}/vendor/Train/${row_id}`;

    const method = state.isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.formdate),
    });

    if (!res.ok) throw new Error(state.isEditing ? 'Failed to update train' : 'Failed to add train');

    const result = await res.json();
    const updatedTrain = result.list || result;

    if (state.isEditing) {
      dispatch({ type: 'UPDATE_TRAIN', payload: updatedTrain });
    } else {
      dispatch({ type: 'ADD_TRAIN', payload: updatedTrain });
    }

    // ✅ Trigger Calculation update after add/edit
    if (onUpdate) onUpdate();

  } catch (err) {
    console.error(err.message);
  }
};



  const delFunc = async (row_id) => {
  try {
    const res = await fetch(`${API_URL}/vendor/Train/${row_id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete train');

    dispatch({ type: 'DELETE_TRAIN', payload: row_id });

    // ✅ Refresh calculation totals
    if (onUpdate) onUpdate();

  } catch (err) {
    console.error(err.message);
  }
};


  const editFunc=async(train)=>{
    
    dispatch({ type: 'START_EDIT', payload: train });

  }

  return (
    <div className="row" >
      <div className="col-lg-12" style={{ backgroundColor: 'yellow' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Train Details</h3>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>
              + Add Train
            </button>

            <div className="table-responsive mt-4">
              <table className="table table-striped table-rounded">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fare Source</th>
                    <th>Train Name</th>
                    <th>Train Number</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Start City</th>
                    <th>End City</th>
                    <th>Duration</th>
                    <th>Class</th>
                    <th>Seats</th>
                    <th>Cost</th>
                    <th>Loading</th>
                    <th>Total Cost</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.transArray.length > 0 ? (
                    state.transArray.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>
                        <td>{item.fare_source}</td>
                        <td>{item.train_name}</td>
                        <td>{item.train_number}</td>
                        <td>{item.start_date}</td>
                        <td>{item.end_date}</td>
                        <td>{item.start_city}</td>
                        <td>{item.end_city}</td>
                        <td>{item.duration}</td>
                        <td>{item.class_name}</td>
                        <td>{item.site_available}</td>
                        <td>{item.cost}</td>
                        <td>{item.loading}</td>
                        <td>{item.total_cost}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={()=>delFunc(item._id)}>Delete</button>                          
                          <button className="btn btn-sm btn-primary" onClick={()=>editFunc(item)}>Edit</button>
                          </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="15" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {state.showForm && (
  <div className="mt-3 border p-3 rounded bg-light">
    <h5>{state.isEditing ? 'Edit Train Details' : 'Add Train Details'}</h5>
    <form onSubmit={handleSubmit}>
      {[
        { name: 'fare_source', label: 'Fare Source', type: 'select', options: ['MMT', 'TBO', 'IRCTC', 'OTHER'] },
        { name: 'train_name', label: 'Train Name' },
        { name: 'train_number', label: 'Train Number', type: 'number' },
        { name: 'start_date', label: 'Train Start Date', type: 'date' },
        { name: 'end_date', label: 'Reach Train Date', type: 'date' },
        { name: 'start_city', label: 'Start City' },
        { name: 'end_city', label: 'Reach City' },
        { name: 'duration', label: 'Journey Distance' },
        { name: 'class_name', label: 'Class' },
        { name: 'site_available', label: 'Seats Availability', type: 'number' },
        { name: 'cost', label: 'Cost Considered', type: 'number' },
        { name: 'loading', label: 'Loading on Train', type: 'number' },
        { name: 'total_cost', label: 'Total Cost', type: 'number' }
      ]
        .reduce((acc, curr, idx, arr) => {
          if (idx % 4 === 0) acc.push(arr.slice(idx, idx + 4));
          return acc;
        }, [])
        .map((row, i) => (
          <div className="row" key={i}>
            {row.map((field) => (
              <div className="col-md-3" key={field.name}>
                <div className="form-group mb-2">
                  <label>{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className="form-control"
                      name={field.name}
                      value={state.formdate[field.name]}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_FORM',
                          payload: { name: e.target.name, value: e.target.value },
                        })
                      }
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option value={opt} key={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      className="form-control"
                      value={state.formdate[field.name]}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_FORM',
                          payload: { name: e.target.name, value: e.target.value },
                        })
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

      <div className="mt-3">
        <button type="button" className="btn btn-secondary btn-sm me-2" onClick={closeAdd}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success btn-sm">
          {state.isEditing ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  </div>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trains;

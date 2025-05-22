import React, { useReducer, useEffect, useState } from "react";
import { API_URL } from "../data/apiUrl";
const initialState = {
  name: "",
  email: "",
  message: ""
};

const reducer = (state, action) => {
    

    

  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const Tee = () => {
    const [editId, setEditId] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [formData, setFormData] = useState([]);

  // ✅ Fetch data on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/tee`); // Change to your API URL
      const data = await res.json();
      setFormData(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const handleEdit = (item) => {
    
    dispatch({ type: "SET_FIELD", field: "name", value: item.name });
    dispatch({ type: "SET_FIELD", field: "email", value: item.email });
    dispatch({ type: "SET_FIELD", field: "message", value: item.message });
    setEditId(item._id); // Set edit ID
    };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const url = editId
    ? `${API_URL}/vendor/tee/${editId}`
    : `${API_URL}/vendor/Add-Tee`;
  const method = editId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(state)
    });

    const result = await res.json();
    console.log(editId ? "✅ Updated:" : "✅ Submitted:", result);

    dispatch({ type: "RESET" });
    setEditId(null); // Reset edit mode
    fetchData(); // Refresh table
  } catch (err) {
    console.error("Error submitting/updating data:", err);
  }
};


  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_URL}/vendor/tee/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();
    console.log("✅ Deleted:", result);

    fetchData(); // Refresh the list
  } catch (err) {
    console.error("❌ Error deleting data:", err);
  }
};



  return (
    <center>
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="row col-12"> 
            <div className="col-sm-3">
        <label>
          Name:
          <input
            value={state.name}
            className="form-control" 
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })
            }
          />
        </label>
        </div>
        <div className="col-sm-3">
        <label>
          Email:
          <input
            value={state.email}
            className="form-control" 
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })
            }
          />
        </label>
        </div>
        <div className="col-sm-3">
        <label>
          Message:
          <textarea
            value={state.message}
            className="form-control" 
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "message", value: e.target.value })
            }
          />
        </label>
        </div>
        <div className="col-sm-3">
        <button type="submit" className="btn btn-success btn-sm">Submit</button>
        </div>
        </div>
      </form>

      <h3 className="mt-5">📋 Submitted Data</h3>
      <table border="1" cellPadding="10" className="table table-stripped table-rounded">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.message}</td>
              
               
                <td>
  <button
    onClick={() => handleEdit(item)}
    className="btn btn-primary btn-sm"
  >
    Edit
  </button>
        <button
  onClick={() => handleDelete(item._id)}
  className="btn btn-danger btn-sm"
>
  Delete
</button>
      </td>
            </tr>
          ))}
        </tbody>
      </table>
    </center>
  );
};

export default Tee;

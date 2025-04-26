import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const IntCredite = () => {
    const [all, setAll] = useState([]);
    const [viewModel, setViewModel] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);  // For distinguishing add or view mode
    const [modalData, setModalData] = useState({
        country_name: '',
        sup_name: '',
        issue_date: '',
        valid_date: '',
        ref_no: '',
        amount: '',
        currency_type: '',
    });  // Initialize modal data with empty fields

    // Fetch data from the API
    const getData = async () => {
        try {
            const response = await fetch(`${API_URL}/vendor/Internation-Creditnote`);
            if (!response.ok) {
                throw new Error('Something went wrong with this link');
            }
            const list = await response.json();
            setAll(list.data);
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    // Open the modal for adding a new entry
    const openAddModal = () => {
        setIsAddMode(true);  // Set mode to Add
        setModalData({
            country_name: '',
            sup_name: '',
            issue_date: '',
            valid_date: '',
            ref_no: '',
            amount: '',
            currency_type: '',
        });  // Clear previous data in modal
        setViewModel(true);  // Show modal
    };

    // Show the modal for viewing/editing existing data
    const openEditModal = (item) => {
        setIsAddMode(false);  // Set mode to Edit
        setModalData(item);  // Set modal data to the selected item
        setViewModel(true);  // Show modal
    };

    // Close the modal
    const closeModal = () => {
        setViewModel(false);
        setModalData({
            country_name: '',
            sup_name: '',
            issue_date: '',
            valid_date: '',
            ref_no: '',
            amount: '',
            currency_type: '',
        });  // Clear the modal data when closing
    };

    // Handle input change in the modal form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModalData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Submit the form (Add or Edit)
    const submitData = async () => {
        const token = localStorage.getItem('token');  // or however you are storing the token (in Redux, Context, etc.)

        if (isAddMode) {
            // If it's "Add" mode, create a new entry
            try {
                const response = await fetch(`${API_URL}/vendor/Internation-Creditnote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, 
                    },
                    body: JSON.stringify(modalData),
                });

                if (!response.ok) {
                    throw new Error('Error adding data');
                }

                const newData = await response.json();
                console.log('Data added successfully:', newData);

                // Update state and close modal
                setAll((prevData) => [...prevData, newData.data]);
                closeModal();
            } catch (err) {
                console.error('Error:', err);
            }
        } else {
            // If it's "Edit" mode, update existing entry
            try {
                const response = await fetch(`${API_URL}/vendor/Internation-Creditnote/${modalData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(modalData),
                });

                if (!response.ok) {
                    throw new Error('Error updating data');
                }

                const updatedData = await response.json();
                console.log('Data updated successfully:', updatedData);

                // Update state with the edited data
                setAll((prevData) =>
                    prevData.map((item) => (item._id === updatedData._id ? updatedData : item))
                );
                closeModal();
            } catch (err) {
                console.error('Error:', err);
            }
        }
    };
    const [delModel,setDelModle]=useState(false);
    const [delid,setDelid]=useState(null);
    const delFun=(row_id)=>{
        setDelid(row_id);
       setDelModle(true);
    }
    const delRow=async(row_id)=>{
        try{
          const response=await fetch(`${API_URL}/vendor/Internation-Creditnote/${row_id}`,{
            method:'delete'
          });
          if(!response.ok){
            throw new Error('This amount not receiveing linkes');
          }
          //setAll((prev)=>filter(prev._id!==row_id));
          setAll((prev) => prev.filter((item) => item._id !== row_id));
          setDelModle(false);

        }catch(err){
           console.log(err.meessage);
        }
    }

    return (
        <>
            <NavBar />
            <SideBar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h4><i className="bi bi-pin-fill mx-2"></i><b>International Credit Details</b></h4>
                    <nav className="d-flex justify-arround">
                        <ol className="breadcrumb mx-2">
                            <li className="breadcrumb-item">
                                <a href="index.html">International Credit</a>
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
                                    <h6 className="card-title" style={{ fontSize: "14px" }}>Airport Details</h6>
                                    <p className="" style={{ fontSize: "13px", marginTop: "-15px" }}>
                                        Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                                    </p>

                                    <button className="btn btn-success mb-3" onClick={openAddModal}>
                                        Add New Credit
                                    </button>

                                    <table className="table datatable table-striped">
                                        <thead style={{ fontSize: "13px" }}>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Country Name</th>
                                                <th>DMC / Supplier Name</th>
                                                <th>CN Issued Date</th>
                                                <th>Towards Ref Number</th>
                                                <th>Amount</th>
                                                <th>Valid Till</th>
                                                <th>Currency Type</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {all.map((itms, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{itms.country_name}</td>
                                                    <td>{itms.sup_name}</td>
                                                    <td>{itms.issue_date}</td>
                                                    <td>{itms.ref_no}</td>
                                                    <td>{itms.amount}</td>
                                                    <td>{itms.valid_date}</td>
                                                    <td>{itms.currency_type}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => openEditModal(itms)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-danger btn-sm" onClick={()=>delFun(itms._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Modal */}
            {viewModel && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isAddMode ? 'Add New Credit' : 'Edit Credit Details'}</h2>

                        {/* Form Inputs */}
                        <label>Country Name</label>
                        <input
                            type="text"
                            name="country_name"
                            value={modalData.country_name}
                            onChange={handleInputChange}
                        />

                        <label>Supplier Name</label>
                        <input
                            type="text"
                            name="sup_name"
                            value={modalData.sup_name}
                            onChange={handleInputChange}
                        />

                        <label>Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={modalData.amount}
                            onChange={handleInputChange}
                        />
                         <label>CN Issued Date</label>
                        <input
                            type="date"
                            name="issue_date"
                            value={modalData.issue_date}
                            onChange={handleInputChange}
                        />
                        <label>Valid Till</label>
                        <input
                            type="date"
                            name="valid_date"
                            value={modalData.valid_date}
                            onChange={handleInputChange}
                        />
                        <label>Towards Ref Number</label>
                        <input
                            type="text"
                            name="ref_no"
                            value={modalData.ref_no}
                            onChange={handleInputChange}
                        />
                        <label>Currency Type</label>
                        <input
                            type="text"
                            name="currency_type"
                            value={modalData.currency_type}
                            onChange={handleInputChange}
                        />

                        <div>
                            <button onClick={submitData}>{isAddMode ? 'Add' : 'Save'}</button>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}


            {delModel &&(
                 <div className="modal">
                 <div className="modal-content">
                     <h5 className="text-center">Are you sure want to delete ?</h5>
                

                     <div className="d-flex justify-content-center">
                        <button className="btn btn-sm btn-warning mx-2" onClick={()=>setDelModle(false)}>Close</button>
                        <button className="btn btn-sm btn-danger mx-2" onClick={()=>delRow(delid)}>Yes Delete</button>
                        </div>
                 </div>
             </div>
            )}

            {/* Modal styling */}
            <style>
                {`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 60%;
                    max-width: 500px;
                }
                button {
                    margin-top: 20px;
                    padding: 8px 15px;
                    background-color: #28a745;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #218838;
                }
                `}
            </style>
        </>
    );
};

export default IntCredite;

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const DomesticCredit = () => {
  const token = localStorage.getItem('token');
  
  const [datas, setData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newItem, setNewItem] = useState({
    city_name: '',
    service_type: '',
    hotel_name: '',
    issue_date: '',
    ref_no: '',
    amount: '',
    valid_date: '',
    travel_type:'D'
  });

  const [delid, setDelid] = useState(null);  
  const [delmodel, setDelmodel] = useState(false);

  // Fetch the data when the component is mounted
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/Credit-Domestic-Note`);
        if (!response.ok) {
          throw new Error('Data fetch failed');
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    getData();
  }, []);

  // Handle changes for adding new credit note
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle saving the new credit note
  const handleSaveNew = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/Credit-Domestic-Note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) {
        //const errorRes = await res.json();
        throw new Error(errorRes.message || 'Failed to add new credit note');
      }

      const addedData = await res.json();
      console.log('Added Data:', addedData);

      // Prepend new data to the top of the list
      setData((prevData) => [addedData.data, ...prevData]);
      //alert('Yes');
      // Close modal and reset form
      //setShowAddModal(false);
      
    } catch (err) {
      console.error('Error adding credit note:', err.message);
      alert(err.message); // Optional: show a user-friendly error
    }
  };

  // Handle delete button click
  const delBtn = (row_id) => {
    setDelid(row_id);
    setDelmodel(true);
  };

  // Handle deletion of row
  const delRow = async (row_id) => {
    try {
      const response = await fetch(`${API_URL}/vendor/Credit-Domestic-Note/${row_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete data');
      }

      const data = await response.json();
      console.log('Deleted:', data);

      // Optionally update UI: remove the item
      setData((prev) => prev.filter((item) => item._id !== row_id));

      // Close modal
      setDelmodel(false);
      setDelid(null);
    } catch (err) {
      console.error('Error deleting credit note:', err.message);
      alert(err.message); // Optional: show a user-friendly error
    }
  };

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h4>
            <i className="bi bi-pin-fill mx-2"></i><b>Domestic Details</b>
          </h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item"><a href="#">Departments</a></li>
              <li className="breadcrumb-item active">Designation</li>
            </ol>
            <button
              className="btn btn-sm btn-primary mb-3 ms-auto"
              onClick={() => setShowAddModal(true)}
            >
              + Add Credit Notes
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>
                    Departments & Designation Details
                  </h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>

                  <table className="table datatable table-striped">
                    <thead style={{ fontSize: "13px" }}>
                      <tr>
                        <th>S.No</th>
                        <th>City Name</th>
                        <th>Service Type</th>
                        <th>Hotel / Supplier Name</th>
                        <th>CN Issued Date</th>
                        <th>Towards Ref Number</th>
                        <th>Towards Used Ref No</th>
                        <th>Amount</th>
                        <th>Used Amount</th>
                        <th>Balance Amount</th>
                        <th>Valid Till</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datas.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.city_name}</td>
                          <td>{item.service_type}</td>
                          <td>{item.hotel_name}</td>
                          <td>{item.issue_date}</td>
                          <td>{item.ref_no}</td>
                          <td></td>
                          <td>{item.amount}</td>
                          <td></td>
                          <td></td>
                          <td>{item.valid_date}</td>
                          <td></td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setSelectedItem(item);
                                setViewModal(true);
                              }}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => delBtn(item._id)}
                            >
                              Delete
                            </button>
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

      {/* View Modal */}
      {viewModal && selectedItem && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Credit Note Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>City Name:</strong> {selectedItem.city_name}</p>
                <p><strong>Service Type:</strong> {selectedItem.service_type}</p>
                <p><strong>Hotel Name:</strong> {selectedItem.hotel_name}</p>
                <p><strong>Issue Date:</strong> {selectedItem.issue_date}</p>
                <p><strong>Ref No:</strong> {selectedItem.ref_no}</p>
                <p><strong>Amount:</strong> ₹{selectedItem.amount}</p>
                <p><strong>Valid Till:</strong> {selectedItem.valid_date}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Credit Note Modal */}
      {showAddModal && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Credit Note</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <label><strong>City Name</strong></label>
                    <input
                      className="form-control"
                      name="city_name"
                      value={newItem.city_name}
                      onChange={handleNewChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label><strong>Service Type</strong></label>
                    <input
                      className="form-control"
                      name="service_type"
                      value={newItem.service_type}
                      onChange={handleNewChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label><strong>Hotel Name</strong></label>
                    <input
                      className="form-control"
                      name="hotel_name"
                      value={newItem.hotel_name}
                      onChange={handleNewChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label><strong>CN Issue Date</strong></label>
                    <input
                      type="date"
                      className="form-control"
                      name="issue_date"
                      value={newItem.issue_date}
                      onChange={handleNewChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label><strong>Validity Date</strong></label>
                    <input
                      type="date"
                      className="form-control"
                      name="valid_date"
                      value={newItem.valid_date}
                      onChange={handleNewChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label><strong>Towards Ref Number</strong></label>
                    <input
                      className="form-control"
                      name="ref_no"
                      value={newItem.ref_no}
                      onChange={handleNewChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label><strong>Amount</strong></label>
                    <input
                      className="form-control"
                      name="amount"
                      value={newItem.amount}
                      onChange={handleNewChange}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleSaveNew}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {delmodel && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this item?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary">Cancel</button>
                <button
                  className="btn btn-danger"
                  onClick={() => delRow(delid)}
                >
                  Yes Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render NavBar, SideBar, Footer */}
      <NavBar />
      <SideBar />
      <Footer />
    </>
  );
};

export default DomesticCredit;

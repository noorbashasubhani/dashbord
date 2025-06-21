import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Holidays = () => {
  const [holiday, setHoliday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [holidayData, setHolidayData] = useState({
    name: '',
    holiday_date: ''
  });

  const [isEditMode, setIsEditMode] = useState(false); // new
  const [editId, setEditId] = useState(null); // new


  const fetchHoliday = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/HolidayList`);
        if (!response.ok) {
          throw new Error('Failed to fetch holiday details');
        }
        const data = await response.json();
        setHoliday(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    

    fetchHoliday();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHolidayData({
      ...holidayData,
      [name]: value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode
      ? `${API_URL}/vendor/UpdateHoliday/${editId}`
      : `${API_URL}/vendor/Add-Holidays`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(holidayData),
    });

    if (!response.ok) {
      throw new Error(isEditMode ? 'Failed to update holiday' : 'Failed to add holiday');
    }

    const result = await response.json();
    console.log(isEditMode ? 'Updated holiday:' : 'Added holiday:', result);

    // Reset form and close modal
    setShowModal(false);
    setHolidayData({ name: '', holiday_date: '' });
    setEditId(null);
    setIsEditMode(false);
    fetchHoliday();
  } catch (err) {
    setError(err.message);
  }
};

 const delFun=async(row_id)=>{
      const del=await fetch(`${API_URL}/vendor/DeleteHoliday/${row_id}`,{
        method:'DELETE'
      });
     if(!del.ok){
      throw new Error('Data not deleted using this url');
     }
     fetchHoliday();
 }

 
 const editFun = (holidayId) => {
  const holidayToEdit = holiday.find((h) => h._id === holidayId);
  if (holidayToEdit) {
    setHolidayData({
      name: holidayToEdit.name,
      holiday_date: holidayToEdit.holiday_date?.slice(0, 10) || ''
    });
    setEditId(holidayId);
    setIsEditMode(true);
    setShowModal(true);
  }
};


  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Holidays Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Holidays</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
            <button
              className="btn btn-sm btn-primary mb-3 ms-auto"
              onClick={() => setShowModal(true)} // Show modal on click
            >
              + Add Holiday
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: '14px' }}>Holiday Details</h6>
                  <p className="" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>

                  {loading && <p><center>Loading...</center></p>}
                  {error && <p className="text-danger">{error}</p>}

                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead style={{ fontSize: '13px' }}>
                        <tr>
                          <th>S.No</th>
                          <th>Holiday Name</th>
                          <th>Holiday Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {holiday.map((holidayS, index) => (
                          <tr key={holidayS._id}>
                            <td>{index + 1}</td>
                            <td>{holidayS.name}</td>
                            <td>{holidayS.holiday_date}</td>
                            <td>
                    <button className="btn btn-danger btn-sm" onClick={()=>delFun(holidayS._id)}>Delete</button>
                    <button className="btn btn-primary btn-sm" onClick={()=>editFun(holidayS._id)}>Edit</button>
                    </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Holiday</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Holiday Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={holidayData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="holiday_date">Holiday Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="holiday_date"
                      name="holiday_date"
                      value={holidayData.holiday_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
                    Save Holiday
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Holidays;

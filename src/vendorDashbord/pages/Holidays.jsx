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

  useEffect(() => {
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
    console.log("Form submitted with data:", holidayData); // Debugging form data
    try {
      const response = await fetch(`${API_URL}/vendor/Add-Holidays`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(holidayData),
      });

      if (!response.ok) {
        throw new Error('Failed to add holiday');
      }

      const newHoliday = await response.json();
      console.log("New holiday added:", newHoliday); // Debugging response
      setHoliday([...holiday, newHoliday]);
      setShowModal(false); // Close the modal
      setHolidayData({ name: '', holiday_date: '' }); // Reset form data
    } catch (err) {
      setError(err.message);
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
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {holiday.map((holidayS, index) => (
                          <tr key={holidayS._id}>
                            <td>{index + 1}</td>
                            <td>{holidayS.name}</td>
                            <td>{holidayS.holiday_date}</td>
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

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Holidays = () => {
  const [holiday, setHoliday] = useState([]); // Should be an array to store multiple holidays
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the "HolidayList" collection
    const fetchHoliday = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/HolidayList`);
        if (!response.ok) {
          throw new Error('Failed to fetch holiday details');
        }
        const data = await response.json();
        setHoliday(data); // This will store the list of holidays
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHoliday();
  }, []);

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
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
               + Add Holiday
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ "font-size": "14px" }}>Holiday Details</h6>
                  <p className="" style={{ "font-size": "13px", "margin-top": "-15px" }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>
                  
                  {/* Loading State */}
                  {loading && <p><center>Loading...</center></p>}
                  
                  {/* Error State */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Table with dynamic data */}
                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead style={{ fontSize: "13px" }}>
                        <tr>
                          <th>S.No</th>
                          <th>Holiday Name</th>
                          <th>Holiday Date</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: "13px" }}>
                        {/* Loop through the holiday data and populate the table rows */}
                        {holiday.map((holidayS, index) => (
                          <tr key={holidayS._id}> {/* Use holidayS._id here */}
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{holidayS.name}</td> {/* Holiday name */}
                            <td>{holidayS.holiday_date}</td> {/* Holiday date */}
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

      <Footer />
    </>
  );
};

export default Holidays;

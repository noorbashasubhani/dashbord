import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Escalation = () => {
  const [escale, setEscale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    annonymus: '',
    added_by: '',
    concern_specific: '',
    concern: '',
    created_date: '',
    status: '',
    reason_for_close: ''
  });

  useEffect(() => {
    const fetchCompaints = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/complaints`);
        if (!response.ok) {
          throw new Error('Failed to fetch hotel details');
        }
        const data = await response.json();
        setEscale(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompaints();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/vendor/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add escalation');
      }

      const data = await response.json();
      setEscale((prev) => [...prev, data.data]);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const Modal = ({ onClose }) => (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Escalation</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Form Fields */}
              <div className="form-group">
                <label htmlFor="annonymus">Anonymous</label>
                <input
                  type="text"
                  id="annonymus"
                  name="annonymus"
                  className="form-control"
                  value={formData.annonymus}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="added_by">Escalation From</label>
                <input
                  type="text"
                  id="added_by"
                  name="added_by"
                  className="form-control"
                  value={formData.added_by}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="concern_specific">Concern Specific</label>
                <input
                  type="text"
                  id="concern_specific"
                  name="concern_specific"
                  className="form-control"
                  value={formData.concern_specific}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="concern">Escalation Regarding</label>
                <input
                  type="text"
                  id="concern"
                  name="concern"
                  className="form-control"
                  value={formData.concern}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="created_date">Received Date</label>
                <input
                  type="date"
                  id="created_date"
                  name="created_date"
                  className="form-control"
                  value={formData.created_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reason_for_close">Reason for Close</label>
                <input
                  type="text"
                  id="reason_for_close"
                  name="reason_for_close"
                  className="form-control"
                  value={formData.reason_for_close}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">Add Escalation</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Escalation Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item">
                <a href="index.html">Escalation</a>
              </li>
              <li className="breadcrumb-item active">List</li>
            </ol>
            <button 
              className="btn btn-sm btn-dark mb-3 ms-auto" 
              onClick={() => setShowModal(true)}
            >
              + Add Escalation
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{"font-size":"14px"}}>Escalation Details</h6>
                  <p className="" style={{"font-size":"13px", "margin-top":"-15px"}}>Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.</p>

                  {loading && <p><center>Loading...</center></p>}
                  {error && <p className="text-danger">{error}</p>}

                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead>
                        <th>S.No</th>
                        <th>Anonymous</th>
                        <th>Escalation From</th>
                        <th>Concern Specific</th>
                        <th>Escalation Regarding</th>
                        <th>Received Date</th>
                        <th>Status</th>
                        <th>Reason For Close</th>
                        <th> Actions</th>
                      </thead>
                      <tbody style={{fontSize: "13px"}}>
                        {escale.map((esc, index) => (
                          <tr key={esc._id}>
                            <td>{index + 1}</td>
                            <td>{esc.annonymus}</td>
                            <td>{esc.added_by}</td>
                            <td>{esc.concern_specific}</td>
                            <td>{esc.concern}</td>
                            <td>{esc.created_date}</td>
                            <td>{esc.status}</td>
                            <td>{esc.reason_for_close}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-dark" 
                                onClick={() => {
                                  setSelectedEscalation(esc);
                                  setShowModal(true);
                                }}
                              >
                                Action
                              </button>
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

      <Footer />

      {showModal && (
        <Modal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Escalation;

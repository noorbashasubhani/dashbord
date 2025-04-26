import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';

const Destinations = () => {
  const [desing, setdesing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    destination_name: '',
    latitude: '',
    longitude: '',
    destination: '',
    is_country: '',
    is_state: '',
    is_city: '',
    is_cruise: '',
    country_id: '',
    state_id: ''
  });

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/Destination`);
      if (!response.ok) throw new Error('Data not fetching');
      const data = await response.json();
      setdesing(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: val });
  };

  const handleSubmit = async() =>{

    try {
        const response = await fetch(`${API_URL}/vendor/Destination`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(form),
      });

      const datas = await response.json();
      if(response.ok){
        setdesing([datas.data, ...desing]);
        setShowModal(false);
        setForm({
          destination_name: '',
          latitude: '',
          longitude: '',
          destination: '',
          is_country: '',
          is_state: '',
          is_city: '',
          is_cruise: '',
          country_id: '',
          state_id: ''
        });
        //setdesing((prev)=>);
      } else {
        alert('Failed to add destination');
      }
    } catch (err) {
      console.error(err);
    }

  };
  
  

  const delFuc=async(row_id)=>{
    try{
      const responce=await fetch(`${API_URL}/vendor/Destination/${row_id}`,{
        method:'delete'
      });

      if(!responce.ok){
         throw new Error('THIS IS THE ERROR');
      }
      setdesing((prv) => prv.filter((items) => items._id !== row_id));

    }catch(err){
       console.log(err.message);
    }
  }
  const [viewItem, setViewItem] = useState(null);
  const [showModalv, setShowModalv] = useState(false);

  const viewDat = (item) => {
    setViewItem(item);
    setShowModalv(true);  // Open the modal
  };

  return (
    <>
      <NavBar />
      <SideBar />

      <main id="main" className="main">
        <div className="pagetitle">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Destinations Details</b></h4>
          <nav className="d-flex justify-arround">
            <ol className="breadcrumb mx-2">
              <li className="breadcrumb-item"><a href="#">Departments</a></li>
              <li className="breadcrumb-item active">Designation</li>
            </ol>
            <button className="btn btn-sm btn-primary mb-3 ms-auto" onClick={() => setShowModal(true)}>
              + Add Designation
            </button>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title" style={{ fontSize: "14px" }}>Departments & Designation Details</h6>
                  <p className="" style={{ fontSize: "13px", marginTop: "-15px" }}>
                    Explore our CRM's organized Departments & Designations feature, facilitating seamless collaboration and clear communication within the workforce.
                  </p>

                  {loading && <p><center>Loading...</center></p>}
                  {error && <p className="text-danger">{error}</p>}

                  {!loading && !error && (
                    <table className="table datatable table-striped">
                      <thead style={{ fontSize: "13px" }}>
                        <tr>
                          <th>S.No</th>
                          <th>Destination Name</th>
                          <th>Country Name</th>
                          <th>State Name</th>
                          <th>Destination Type</th>
                          <th>Latitude</th>
                          <th>Longitude</th>
                          <th>Is It Country?</th>
                          <th>Is It State?</th>
                          <th>Is It City?</th>
                          <th>Is It Cruise?</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13px' }}>
                        {desing.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.destination_name}</td>
                            <td>
    {
      desing.find(dest => dest._id === item.country_id)?.destination_name || 'N/A'
    }
  </td>
  <td>
    {
      desing.find(sts => sts._id === item.state_id)?.destination_name || 'N/A'
    }
  </td>
                            <td>{item.destination}</td>
                            <td>{item.latitude}</td>
                            <td>{item.longitude}</td>
                            <td>{item.is_country}</td>
                            <td>{item.is_state}</td>
                            <td>{item.is_city}</td>
                            <td>{item.is_cruise}</td>
                            <td>
                            <button className="btn btn-warning btn-sm" onClick={() => viewDat(item)}>View</button>
                            <button className="btn btn-danger btn-sm" onClick={()=>delFuc(item._id)}>Delete</button>
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

      {/* Modal */}
      {showModal && (
        <div className="modal model-lg show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Add Destination</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
              <div className="row">
                <div className="mb-3">
                  <label className="form-label">Destination Name</label>
                  <input type="text" name="destination_name" className="form-control" value={form.destination_name} onChange={handleChange} />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Destination Type</label>
                  <select className="form-select" name="destination" value={form.destination} onChange={handleChange}>
                   <option>Select </option>
                   <option value="Domestic">Domestic</option>
                   <option value="International">International</option>
                 </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Latitude</label>
                 
                  <input type="text" name="latitude" className="form-control" value={form.latitude} onChange={handleChange} />
                </div>
                </div>


                <div className="mb-3">
                  <label className="form-label">Longitude</label>
                  <input type="text" name="longitude" className="form-control" value={form.longitude} onChange={handleChange} />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Is It a Country?</label>
                  <select className="form-select" name="is_country" value={form.is_country} onChange={handleChange}>
                   <option>Select </option>
                   <option value="Yes">Yes</option>
                   <option value="No">No</option>
                 </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Is It a State?</label>
                  <select className="form-select" name="is_state" value={form.is_state} onChange={handleChange}>
                   <option>Select </option>
                   <option value="Yes">Yes</option>
                   <option value="No">No</option>
                 </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Is It a City?</label>
                  <select className="form-select" name="is_city" value={form.is_city} onChange={handleChange}>
                   <option>Select </option>
                   <option value="Yes">Yes</option>
                   <option value="No">No</option>
                 </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Is It a Cruise?</label>
                  <select className="form-select" name="is_cruise" value={form.is_cruise} onChange={handleChange}>
                   <option>Select </option>
                   <option value="Yes">Yes</option>
                   <option value="No">No</option>
                 </select>
                </div>
                {(form.is_state === 'Yes' || form.is_city === 'Yes') && (
                <div className="mb-3">
                  <label className="form-label">Select Country</label>
                  <select className="form-select" name="country_id" value={form.country_id} onChange={handleChange}>
                   <option>Select </option>

                   {desing.map((items, index) =>
                      items.is_country === 'Yes' ? (
                        <option key={index} value={items._id}>
                          {items.destination_name}
                        </option>
                      ) : null
                    )}


                 </select>
                </div>
                )}
                {form.is_city === 'Yes' && (
                <div className="mb-3">
                  <label className="form-label">Select State</label>
                  <select className="form-select" name="state_id" value={form.state_id} onChange={handleChange}>
                   <option>Select </option>
                   {desing.map((dddd, index) =>
                      dddd.is_state === 'Yes' ? (
                        <option key={index} value={dddd._id}>
                          {dddd.destination_name}
                        </option>
                      ) : null
                    )}
                 </select>
                </div>  
                )}

               
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModalv && viewItem && (
  <div className="modal show d-block" style={{ display: "block" }} tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">View Destination</h5>
          <button type="button" className="btn-close" onClick={() => setShowModalv(false)}></button>
        </div>
        <div className="modal-body">
          <p><strong>Destination Name:</strong> {viewItem.destination_name}</p>
          <p><strong>Country Name:</strong> {viewItem.country_id ? desing.find(dest => dest._id === viewItem.country_id)?.destination_name : 'N/A'}</p>
          <p><strong>State Name:</strong> {viewItem.state_id ? desing.find(sts => sts._id === viewItem.state_id)?.destination_name : 'N/A'}</p>
          <p><strong>Destination Type:</strong> {viewItem.destination}</p>
          <p><strong>Latitude:</strong> {viewItem.latitude}</p>
          <p><strong>Longitude:</strong> {viewItem.longitude}</p>
          <p><strong>Is It a Country?</strong> {viewItem.is_country}</p>
          <p><strong>Is It a State?</strong> {viewItem.is_state}</p>
          <p><strong>Is It a City?</strong> {viewItem.is_city}</p>
          <p><strong>Is It a Cruise?</strong> {viewItem.is_cruise}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowModalv(false)}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Destinations;

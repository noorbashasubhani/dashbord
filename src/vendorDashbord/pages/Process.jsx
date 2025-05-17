import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useParams} from 'react-router-dom';


const Process = () => {
    const { lead_id } = useParams();
    const [formData, setFormData] = useState({});
    const [dest,setDest]=useState([]);
    const [leads,setLeads]=useState([]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
      
        setFormData((prev) => {
          const updatedForm = {
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
          };
      
          // Auto-calculate trip duration
          if ((name === 'start_date' || name === 'end_date') && updatedForm.start_date && updatedForm.end_date) {
            const start = new Date(updatedForm.start_date);
            const end = new Date(updatedForm.end_date);
            const diffInMs = end - start;
      
            if (diffInMs >= 0) {
              const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
              updatedForm.duration = `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
            } else {
              updatedForm.duration = '';
              toast.error('End date cannot be before start date');
            }
          }
      

          if (["no_of_adults", "no_of_children", "no_of_infants"].includes(name)) {
            const adults = parseInt(updatedForm.no_of_adults) || 0;
            const children = parseInt(updatedForm.no_of_children) || 0;
            const infants = parseInt(updatedForm.no_of_infants) || 0;
            updatedForm.no_of_pax = adults + children + infants;
          }
    

          return updatedForm;
        });
      };
      
      

      useEffect(() => {
        const getHolidays = async () => {

          try {
            const responses = await fetch(`${API_URL}/vendor/Destination`);
            if (!responses.ok) {
              throw new Error('Data not fetched properly');
            }
            const result = await responses.json();
            setDest(result.data); // Assuming API returns data under `data`
          } catch (error) {
            console.error('Failed to fetch holiday destinations:', error);
          }

          try {
            //alert(id);
            const responses_lead = await fetch(`${API_URL}/vendor/singlelead/${lead_id}`);
            if (!responses_lead.ok) {
              throw new Error('Data not fetched properly');
            }
            const result_lead = await responses_lead.json();
            //setLeads(result_lead.data); // Assuming API returns data under `data`
            setFormData(result_lead.data);
          } catch (error) {
            console.error('Failed to fetch holiday destinations:', error);
          }



        };
      
        getHolidays();
      }, []);


      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/vendor/Processed/${lead_id}`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          });
      
          const result = await response.json();
          if (response.ok) {
            toast.success('Form submitted successfully');
          } else {
            toast.error(result.message || 'Submission failed');
          }
        } catch (error) {
          toast.error('Error submitting form');
        }
      };
      




  return (
    <>
      <NavBar />
      <SideBar />
      
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4><i className="bi bi-pin-fill mx-2"></i><b> Itinerary Request Form
            </b></h4>
            <nav className="d-flex justify-arround">
              <ol className="breadcrumb mx-2 mb-0">
                <li className="breadcrumb-item">
                  <a href="index.html">Lead</a>
                </li>
                <li className="breadcrumb-item active">List</li>
              </ol>
            </nav>
          </div>
          
        </div>

        <ToastContainer />

        {/* Leads table */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  
                  <b className="mb-5">Leads Details</b>
                  
                  <form onSubmit={handleSubmit}>
                  
                  <div className="row">
    
                  <div className="col-3 form-group mb-3">
                    <label>Package Type</label>
                      <select  type="text" className="form-control" value={formData.package_type} name="package_type" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="Standard">Standard</option>
                        <option value="Budget">Budget </option>
                        <option value="Premimum">Premimum </option>
                      </select>
                  </div>
                  <div className="col-3 form-group mb-3">
                    <label>Customer Type</label>
                      <select  type="text" className="form-control" name="customer_type" value={formData.customer_type} onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="New Customer">New Customer</option>
                        <option value="Return Customer">Return Customer </option>
                        
                      </select>
                  </div>
                  <div className="col-3">
                      <label htmlFor="lead_source" className="form-label">Source</label>
                      <select
  className="form-select"
  name="lead_source"
  id="lead_source" onChange={handleChange}
  value={formData.lead_source}
>
  <option value="">Select Source Type</option>
  <option value="Website">Website</option>
  <option value="Instagram">Instagram</option>
  <option value="Google">Google</option>
  <option value="Facebook">Facebook</option>
  <option value="Existing-Customer">Existing Customer</option>
  <option value="Customer-Reference">Customer Reference</option>
  <option value="Personal-Reference">Personal Reference</option>
  <option value="Telecalling">Telecalling</option>
  <option value="S">Telecalling-CS</option>
  <option value="Telecalling-CS">Telecalling-CRM</option>
  <option value="Direct-Call">Direct Call</option>
  <option value="Marketing">Marketing</option>
  <option value="MICE-Marketing">MICE-Marketing</option>
  <option value="Partner">Partner</option>
  <option value="Bulk-SMS-Activity">Bulk SMS Activity</option>
  <option value="QR-Code-Scan">QR Code Scan</option>
</select>

                    </div>
                    <hr></hr>
                    <b className="mb-5">Customer Information</b>
                    <div className="col-4">
                      <label htmlFor="customerName" className="form-label">Customer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_name"
                        value={formData.customer_name}
                        id="customer_name" onChange={handleChange}
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="customerNumber" className="form-label">Customer Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_number"
                        value={formData.customer_number}
                        id="customer_number" onChange={handleChange}
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="customer_email" className="form-label">Customer E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        name="customer_email"
                        value={formData.customer_email}
                        id="customer_email" onChange={handleChange}
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="customerName" className="form-label">Preferred Time to Call</label>
                      <input
                        type="time"
                        className="form-control"
                        name="preferred_time"
                        value={formData.preferred_time}
                        id="preferred_time" onChange={handleChange}
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="customerNumber" className="form-label">Lead Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lead_location"
                        value={formData.lead_location}
                        id="lead_location" onChange={handleChange}
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="customer_email" className="form-label">Customer Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_location"
                        value={formData.customer_location}
                        id="customer_location" onChange={handleChange}
                      />
                    </div>
                    
                  </div><hr></hr>
                  <b>Holiday Details</b>
                  <div className="row my-5"> 
                  <div className="col-6 form-group mb-3">
                    <label>Holiday Type</label>
                      <select  type="text" className="form-control" value={formData.holiday_type} name="holiday_type" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International </option>
                      </select>
                  </div>
                  <div className="col-6">
                      <label htmlFor="customer_email" className="control">Start Airport/Train Station/Bus Station</label>
                      <input
                        type="text"
                        className="form-control"
                        name="start_city"
                        value={formData.start_city}
                        id="start_city" onChange={handleChange}
                      />
                    </div>


                    <div className="col-6 form-group">
                    <label>Holiday Destination</label>
                      <select  type="text" className="form-control" name="holiday_destination"
                       onChange={handleChange} value={formData.holiday_destination}>
                        <option value="">Select </option>
                       
                        <option value="">Select </option>
                        {dest.map((itms,index)=>(
                            <option value={itms._id}>{itms.destination_name}</option>
                        ))}
                      </select>
                  </div>
                  <div className="col-6 form-group">
                    <label>Select Visiting Cities</label>
                      <select  type="text" className="form-control" 
                      name="visiting_city" onChange={handleChange} value={formData.visiting_city}>
                        <option value="">Select </option>
                        {dest.map((itms,index)=>(
                            <option value={itms._id}>{itms.destination_name}</option>
                        ))}
                      </select>
                  </div>
                  <div className="col-6">
                      <label htmlFor="customer_email" className="control">Trip Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="start_date"
                        value={formData.start_date}
                        id="start_date" onChange={handleChange}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="customer_email" className="control">Trip End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="end_date"
                        value={formData.end_date}
                        id="end_date" onChange={handleChange}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="customer_email" className="control">Trip Duaration</label>
                      <input
                        type="text"
                        className="form-control"
                        name="duration"
                        value={formData.duration}
                        id="duration" 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-6 form-group">
                    <label>Travel Flexibility(How flexible is customer with change of dates?)</label>
                <select  type="text" className="form-control" value={formData.transformation_mode} name="transformation_mode" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="Fixed-With-Dates">Fixed With Dates</option>
                        <option value="2-3-Days">2-3 Days </option>
                        <option value="A-week">A week  </option>
                        <option value="Fort-Night">Fort Night </option>
                        <option value="With-In-The-Month">With In The Month </option>
                        <option value="Any-Date">Any Date </option>
                      </select>
                  </div>

                   
                    </div>
                    <hr></hr>
                    <b>Passengers Information</b>
                    <div className="row my-5">
                     
                     
                     <div className="col-3 ">
                      <label htmlFor="customer_email"  className="control">No. of Adults(+12 Years)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="no_of_adults"
                        value={ formData.no_of_adults || formData.no_of_adults}
                        id="no_of_adults" onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <label htmlFor="customer_email" className="control">No. of Children(2-12 Years)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="no_of_children"
                        value={formData.no_of_children || formData.no_of_children}
                        id="no_of_children" onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <label htmlFor="customer_email" className="control">No. of Infants(0-2 Years)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="no_of_infants"
                        value={formData.no_of_infants || formData.no_of_infants}
                        id="no_of_infants" onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <label htmlFor="customer_email" className="control">Total Passengers</label>
                      <input
                        type="number"
                        className="form-control"
                        name="no_of_pax"
                        id="no_of_pax"
                        value={formData.no_of_pax || formData.no_of_pax}
                        readonly="disabled" onChange={handleChange}
                      />
                    </div>
                    </div>

                    <b>Passengers Information</b>
                    <div className="row my-5">
                     
                    
                    <div className="col-4 ">
                      <label htmlFor="customer_email" className="control">Tranport Type</label>
                      <select  type="text" className="form-control" value={formData.transformation_mode} name="transformation_mode" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="Flight">Flight</option>
                        <option value="Train">Train</option>
                        <option value="Bus">Bus </option>
                        <option value="Cabs">Cabs</option>
                        <option value="Owne">Owne</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <label htmlFor="customer_email" className="control">Start City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="trans_from_city"
                        value={formData.trans_from_city}
                        id="trans_from_city" onChange={handleChange}
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="customer_email" className="control">End City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="trans_to_city"
                        value={formData.trans_to_city}
                        id="trans_to_city" onChange={handleChange}
                      />
                    </div>
                    </div>
                    <b>Hotel & Meal Informations</b>
                    <div className="row my-5">
                        
                        <div className="col-3 ">
                      <label htmlFor="customer_email" className="control">Hotel Standard</label>
                      <select  type="text" className="form-control"  value={formData.hotel_standed} name="hotel_standed" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4 </option>
                        <option value="5">5</option>
                        
                      </select>
                    </div>
                    <div className="col-3">
                      <label htmlFor="customer_email" className="control">Tranport Type</label>
                      <select  type="text" className="form-control" value={formData.hotel_type} name="hotel_type" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="Hotel">Hotel</option>
                        <option value="Resort">Resort</option>
                        <option value="Villa">Villa </option>
                        <option value="Appartment">Appartment</option>
                        <option value="Home-Stary">Home Stary</option>
                        <option value="Cruise">Cruise</option>
                        <option value="House-Boart">House Boart</option>
                      </select>
                    </div>
                    <div className="col-3">
                      <label htmlFor="customer_email" className="control">Room Sharing Type</label>
                      <select  type="text" className="form-control"  value={formData.room_sharing_type} name="room_sharing_type" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Suite">Suite </option>
                        <option value="Quard">Quard</option>
                        
                      </select>
                    </div>
                    <div className="col-3">
                      <label htmlFor="customer_email" className="control">Room Preferences</label>
                      <select  type="text" className="form-control" value={formData.room_prefaring}  name="room_prefaring" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="Beach-Front">Beach Front</option>
                        <option value="Floor-Specific">Floor Specific</option>
                        <option value="Fort-Stay">Fort Stay </option>
                        <option value="Hill-View">Hill View</option>
                        <option value="Smoking-Room">Smoking Room</option>
                        <option value="Suite">Suite</option>
                        <option value="Tent-Stay">Tent Stay</option>
                        <option value="Tree-House">Tree House</option>
                        <option value="Water-Villa">Water Villa</option>
                      </select>
                    </div>

                    <div className="col-4">
                      <label htmlFor="customer_email" className="control">No. of Rooms</label>
                      <input   type="text" className="form-control" name="no_of_rooms" value={formData.no_of_rooms} onChange={handleChange}/>
                        
                    </div>
                    <div className="col-4">
                      <label htmlFor="customer_email" className="control">Meal Plan</label>
                      <select  type="text" className="form-control" value={formData.meals_plan} name="meals_plan" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="No-Meals">No Meals</option>
                        <option value="Break-fast-Only">Break fast Only</option>
                        <option value="Break-Lunch ">Break & Lunch  </option>
                        <option value="Break-Dinner">Break & Dinner  </option>
                        <option value="Break-Lunch-Dinners">Break ,Lunch & Dinner  </option>
                      </select>
                    </div>
                    <div className="col-4">
                      <label htmlFor="customer_email" className="control">Room Preferences</label>
                      <select  className="form-control" value={formData.holiday_type} name="holiday_type" onChange={handleChange}>
                        <option value="">Select </option>
                        <option value="Beach-Front">Beach Front</option>
                        <option value="Floor-Specific">Floor Specific</option>
                        <option value="Fort-Stay">Fort Stay </option>
                        <option value="Hill-View">Hill View</option>
                        <option value="Smoking-Room">Smoking Room</option>
                        <option value="Suite">Suite</option>
                        <option value="Tent-Stay">Tent Stay</option>
                        <option value="Tree-House">Tree House</option>
                        <option value="Water-Villa">Water Villa</option>
                      </select>
                    </div>
                    <div className="col-6">
                    <label htmlFor="customer_email" className="control">Accommodation Preferences</label>
                    <textarea className="form-control" name="accomdation_prefaring" onChange={handleChange} value={formData.accomdation_prefaring}></textarea>
                    </div>
                    <div className="col-6">
                    <label htmlFor="customer_email" className="control" >Meal Preferences</label>
                    <textarea className="form-control" name="meals_prefaring" onChange={handleChange} value={formData.meals_prefaring}></textarea>
                    </div>
                    <div className="col-12">
                    <label htmlFor="customer_email" className="control">Sightseeing Preferences</label>
                    <textarea className="form-control" name="sight_prefaring" onChange={handleChange} value={formData.sight_prefaring}></textarea>
                    </div>
                    </div>
                    <b>Special Inclusions</b>
                    <div className="row my-5">
                        
                        <table className="table table-stripped table-bordered">
                            <tr>
                                <td><input type="checkbox" className="form-label" checked={formData.visa} name="visa" onChange={handleChange}></input> Visa</td>
                                <td><input type="checkbox" className="form-label" checked={formData.ticket} name="ticket" onChange={handleChange}></input> Entrance Tickets</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" className="form-label" name="honey" checked={formData.honey} onChange={handleChange}></input> Honeymoon Inclusions</td>
                                <td><input type="checkbox" className="form-label" name="day_break" checked={formData.day_break} onChange={handleChange}></input> Day-1 Breakfast</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" className="form-label" name="insurance" checked={formData.insurance} onChange={handleChange}></input> Travel Insurance</td>
                                <td><input type="checkbox" className="form-label" name="early" checked={formData.early} onChange={handleChange}></input> Early Checkin</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" className="form-label" name="activity" checked={formData.activity} onChange={handleChange}></input> Adventure Activities</td>
                                <td><input type="checkbox" className="form-label" name="chekcout" checked={formData.chekcout} onChange={handleChange}></input> Late Checkout</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" className="form-label" name="guide" checked={formData.guide} onChange={handleChange}></input> Tour Guide</td>
                                <td><input type="checkbox" className="form-label" name="dinner" checked={formData.dinner} onChange={handleChange}></input> Gala Dinner</td>
                            </tr>
                        </table>
                        
                    </div>
                    <div className="row">
                    <div className="col-4">
                      <label htmlFor="tee" className="control">Budget for Entire Package</label>
                      <input
                        type="text"
                        className="form-control"
                        name="budget_amount"
                        value={formData.budget_amount}
                        id="budget_amount" 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="customer_email" className="control">Does your customer require Holiday EMI's?</label>
                      <select className="form-select" value={formData.emi_amount } name="emi_amount" onChange={handleChange}>
                      <option value="">Select </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                       
                      </select>
                    </div>
                    
                    <div className="col-12">
                        <label>Form Raiser Inputs & Comments (if any)?</label>
                        <textarea className="form-control" value={formData.your_inputs} name="your_inputs"
                         id="your_inputs" onChange={handleChange}></textarea>
                    </div>
                    <div className="col-5">

                    </div>
                    <div className="col-3 mt-5">
                     <button className="btn btn-sm btn-primary">Save Details</button>
                    </div>
                    </div>
                </form>
              
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

export default Process;

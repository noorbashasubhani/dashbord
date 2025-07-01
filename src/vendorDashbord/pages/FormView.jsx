import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/forms/Footer';
import { API_URL } from '../data/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';


const FormView = () => {
  const { row_id } = useParams();


  const [leads,setLeads]=useState([]);
  const [flight,setFlight]=useState([]);
  const [hotel,setHotel]=useState([]);
  const [transport,setTransport]=useState([]);
  const [train,setTrain]=useState([]);
  const [bus,setBus]=useState([]);
  const [cruise,setCruise]=useState([]);
  const [supplem,setSupplem]=useState([]);
  const [dasy,setDasy]=useState([]);
  const [incexc,setIncexc]=useState([]);
  const [pack,setPack]=useState([]);
  const [cal,setCal]=useState([]);
  const [online,SetOnline]=useState([]);
  const [supliers,setSuppliers]=useState([]);
  const [visa,setVisa]=useState([]);
  const [tcs,setTcs]=useState([]);

  useEffect(()=>{
    getLeadDetails();
    getFlightDetails();
    getHotels();
    getTransfort();
    getTrainDetails();
    getBus();
    getCruise();
    getSupp();
    datesGet();
    innDetails();
    PackagDetails();
    getCostSheet();
    getOnlineHotels();
    interSupplers();
    getTcs();
    getVisa();
  },[row_id]);



  const getLeadDetails=async()=>{
       try{
          const response=await fetch(`${API_URL}/vendor/singlelead/${row_id}`);
          if(!response.ok){
            throw new Error('This is not link');
          }
          const result=await response.json();
          setLeads(result.data);
       }catch(err){
          console.log(err.message);
       }
    }
  
  const getFlightDetails=async()=>{
     try{
          const response=await fetch(`${API_URL}/vendor/Flights/${row_id}`);
          if(!response.ok){
            throw new Error('This is not link');
          }
          const result=await response.json();
          setFlight(result.data);
     }catch(err){
       console.log(err.message);
     }
  } 
  
   const getHotels=async()=>{
       try{
          const response=await fetch(`${API_URL}/vendor/Domestic-Hotel/${row_id}`);
          if(!response.ok){
            throw new Error('This is not link');
          }
          const result=await response.json();
          setHotel(result.data);
       }catch(err){
          console.log(err.message);
       }
    }

  const getTransfort=async()=>{
    try{
      const transport=await fetch(`${API_URL}/vendor/Transports/${row_id}`);
      const resdata=await transport.json();
      setTransport(resdata.data);
    }catch(err){
      console.log(err.message);
    }
  }

  const getTrainDetails=async()=>{
    try{
     const resTrain=await fetch(`${API_URL}/vendor/Train/${row_id}`);
     const trins=await resTrain.json();
     setTrain(trins.list);
    }catch(err){
    console.log(err.message);
    }
  }

  const getBus=async()=>{
    try{
      const resp=await fetch(`${API_URL}/vendor/getBussrel/${row_id}`);
      const resu=await resp.json();
      setBus(resu.data);
    }catch(err){
      console.log(err.messsage);
    }
  }

  const getCruise=async()=>{
    try{
       const datacur=await fetch(`${API_URL}/vendor/Cruise/${row_id}`);
       const result_data=await datacur.json();
       setCruise(result_data.list);
    }catch(err){
       console.log(err.message);
    }
  }

 const getSupp=async()=>{
   try{
       const resdata=await fetch(`${API_URL}/vendor/supplimentry/${row_id}`);
       const date=await resdata.json();
       setSupplem(date.data);
   }catch(err){
       console.log('Data not getting');
   }
 }

 const datesGet=async()=>{
   try{
    const res=await fetch(`${API_URL}/vendor/day/${row_id}`);
    const results=await res.json();
    setDasy(results.data);
   }catch(err){
    console.log(err.message);
   }
 }

 const innDetails = async () => {
  try {
    const response = await fetch(`${API_URL}/vendor/Form-inc-All/${row_id}`);
    const result = await response.json();
    setIncexc(Array.isArray(result.data) ? result.data : [result.data]); // Handles both single & array cases
  } catch (err) {
    console.log('Failed to fetch inclusions/exclusions:', err.message);
  }
};

const PackagDetails = async () => {
  try {
    const response = await fetch(`${API_URL}/vendor/FormPack/${row_id}`);
    const result = await response.json();

    // Ensure Getda.data exists before setting
    if (result?.data) {
      setPack(Array.isArray(result.data) ? result.data : [result.data]);
    } else {
      setPack([]); // fallback to empty array if data is missing
      console.warn("No data received from FormPack API");
    }
  } catch (err) {
    console.error("Error fetching package details:", err.message);
  }
};


const getCostSheet=async()=>{
  try{
      const datas=await fetch(`${API_URL}/vendor/Calsingle/${row_id}`);
      const data=await datas.json();
      setCal(data.list);
  }catch(err){
      console.log(err.message);
  }
}

const getOnlineHotels=async()=>{
  try{
    const datNew=await fetch(`${API_URL}/vendor/online/${row_id}`);
    const das=await datNew.json();
    SetOnline(das.data);
  }catch(err){
   console.log(err.message);
  }
}


const interSupplers=async()=>{
   try{
      const datas=await fetch(`${API_URL}/vendor/Supplier/${row_id}`);
      const supp=await datas.json();
      setSuppliers(supp.data);
   }catch(err){

   }
}

const getTcs=async()=>{
  try{
    const tcs=await fetch(`${API_URL}/vendor/tcs/${row_id}`);
    const Data=await tcs.json();
    setTcs(Data.data);
  }catch(err){
    console.log(err.message);
  }
}
const getVisa=async()=>{
   try {
      const res = await fetch(`${API_URL}/vendor/visa/${row_id}`);
      const result = await res.json();
      setVisa(Array.isArray(result.data) ? result.data : [result.data]);
    } catch (err) {
      console.error('Failed to fetch visa data:', err.message);
    }
}





  return (
    <>
      <NavBar />
      <SideBar />
      <main id="main" className="main">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h4><i className="bi bi-pin-fill mx-2"></i><b>Itinery Detail View</b></h4>
         
        </div>

        <ToastContainer />

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Customer Info</h6>
                  <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Customer Name	</th>
                            <th>Contact Number</th>
                            <th>Mail ID		</th>
                            <th>Customer Location	</th>
                            <th>No of Adults (+12 years)		</th>
                            <th>No of Children (2-12 years)			</th>
                            <th>No of Infants (0-2 years)	</th>
                            <th>Total no of pax</th>
                          </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>{leads.customer_name || '-'}</td>
                          <td>{leads.customer_number || '-'}</td>
                          <td>{leads.customer_email || '-'}</td>
                          <td>{leads.customer_location || '-'}</td>
                          <td>{leads.no_of_adults || 0}</td>
                          <td>{leads.no_of_children || 0}</td>
                          <td>{leads.no_of_infants || 0}</td>
                          <td>{(leads.no_of_adults || 0) + (leads.no_of_children || 0) + (leads.no_of_infants || 0)}</td>
                        </tr>
                      </tbody>
                      </table>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Holiday Information</h6>
                  <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Holiday Destination	</th>
                            <th>Trip Start Date</th>
                            <th>Trip End Date		</th>
                            <th>Trip Duration	</th>
                            
                          </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>{leads.holiday_destination?.destination_name || '-'}</td>
                          <td>{leads.start_date || '-'}</td>
                          <td>{leads.end_date || '-'}</td>
                          <td>{leads.duration || '-'}</td>
                           </tr>
                      </tbody>
                      </table>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Flights Details</h6>
                  <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>S.No	</th>
                            <th>IF Fare	</th>
                            <th>Group Provided By</th>
                            <th>Fare Validity</th>
                            <th>Fare Source	</th>

                               <th>Travel Type:</th>
                               <th>Number of Adults</th>
                               <th>Number of Children</th>
                               <th>Number of Infants</th>
                               <th>Total Pax</th>

                            <th>Onward Flight Name	</th>
                            <th>Onward Flight Number</th>
                            <th>Onward From City</th>
                            <th>Onward To City	</th>

                            <th>Onward From Terminal	</th>
                            <th>Onward To Terminal</th>
                            <th>Onward Start Date</th>
                            <th>Onward Reach Date</th>

                            <th>Onward Duration</th>
                            <th>Onward Hand Bag</th>
                            <th>Onward Cabin Bag</th>
                            <th>Onward Class Type</th>  



                            <th>Return Flight Name	</th>
                            <th>Return Flight Number</th>
                            <th>Return From City</th>
                            <th>Return To City	</th>

                            <th>Return From Terminal	</th>
                            <th>Return To Terminal</th>
                            <th>Return Start Date</th>
                            <th>Return Reach Date</th>

                            <th>Return Duration</th>
                            <th>Return Hand Bag</th>
                            <th>Return Cabin Bag</th>
                            <th>Return Class Type</th> 


                            <th>Flight Cost Consider</th>
                            <th>Baggage Cost</th>
                            <th>Total Flight Cost</th>   
                            
                          </tr>
                        </thead>
                        <tbody>
                          {flight.map((flights,index)=>(
                        <tr key={flights._id}>
                          <td>{index+1}</td>
                          <td>{flights.fare_source}</td>
                          <td>{flights.group_provided_by || '-'}</td>
                          <td>{flights.fare_validity || '-'}</td>
                          <td>{flights.fare_source || '-'}</td>
                          <td>{flights.travel_type || '-'}</td>
                          <td>{flights.no_of_adults || '-'}</td>
                          <td>{flights.no_of_children || '-'}</td>
                          <td>{flights.no_of_infants || '-'}</td>
                          <td>{flights.total_pax || '-'}</td>
                          <td>{flights.on_flight_name || '-'}</td>
                          <td>{flights.on_flight_no || '-'}</td>
                          <td>{flights.on_from_city || '-'}</td>
                          <td>{flights.on_to_city || '-'}</td>
                          <td>{flights.on_from_terminal || '-'}</td>
                          <td>{flights.on_to_terminal || '-'}</td>
                          <td>{flights.on_start_date || '-'}</td>
                          <td>{flights.on_reach_date || '-'}</td>
                          <td>{flights.on_duration || '-'}</td>


                          <td>{flights.on_hand_bag || '-'}</td>
                          <td>{flights.on_cabin_bag || '-'}</td>
                          <td>{flights.on_class_type || '-'}</td>
                          <td>{flights.r_flight_name || '-'}</td>
                          <td>{flights.r_flight_no || '-'}</td>

                          <td>{flights.r_from_city || '-'}</td>
                          <td>{flights.r_to_city || '-'}</td>
                          <td>{flights.r_from_terminal || '-'}</td>
                          <td>{flights.r_to_terminal || '-'}</td>
                          <td>{flights.r_start_date || '-'}</td>
                          <td>{flights.r_reach_date || '-'}</td>
                          <td>{flights.r_duration || '-'}</td>

                          <td>{flights.r_hand_bag || '-'}</td>
                          <td>{flights.r_cabin_bag || '-'}</td>
                          <td>{flights.r_class_type || '-'}</td>
                          <td>{flights.flight_cost_consider || '-'}</td>

                          <td>{flights.bagage_cost || '-'}</td>
                          <td>{flights.total_flight_cost || '-'}</td>


                           </tr>
                           ))}
                      </tbody>
                      </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        

         <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Hotel Details</h6>
                  <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Hotel Name	</th>
                            <th>Rating</th>
                            <th>Location</th>
                            <th>Contact Person	</th>
                            <th>Contact Number	</th>
                            <th>Check-In</th>
                            <th>Check-Out	</th>
                            <th>Meals Plan</th>

                            <th>Single Room </th>
                            <th>No of Single Rooms</th>
                            <th>No Of Nights</th>
                            <th>Room Category	</th>
                            <th>Cost For Single Room</th>

                            <th>Double Room / Night</th>
                            <th>No of Double rooms</th>
                            <th>No of Nights</th>
                            <th>Room Category	</th>
                            <th>Cost For Double rooms</th>

                            <th>Triple Room / Night </th>
                            <th>No of Triple rooms</th>
                            <th>No Of Nights</th>
                            <th>Room Category	</th>
                            <th>Cost For Triple rooms</th>


                            <th>Extra Bed per night </th>
                            <th>Extra Bed per night</th>
                            <th>No Of Nights</th>
                            <th>Room Category	</th>
                            <th>Cost For Extra Bed</th>

                            <th>Total Cost</th>

                            

                            
                          </tr>
                        </thead>
                        <tbody>
                          {hotel.map((hotels,indx)=>(
                        <tr key={hotels._id}>
                          <td>{indx+1}</td>
                          <td>{hotels.hotel_id?.hotel_name || '-'}</td>
                          <td>{hotels.hotel_rating || '-'}</td>
                          <td>{hotels.location || '-'}</td>
                          <td>{hotels.contact_person || '-'}</td>
                          <td>{hotels.contact_number || '-'}</td>
                          <td>{hotels.check_in_date || '-'}</td>
                          <td>{hotels.check_out_date || '-'}</td>
                          <td>{hotels.meals_plan || '-'}</td>

                           <td>{hotels.single_room_cost || '-'}</td>
                           <td>{hotels.no_of_single_rooms || '-'}</td>
                           <td>{hotels.no_of_single_room_nights || '-'}</td>
                           <td>{hotels.single_category || '-'}</td>
                           <td>{hotels.cost_for_single || '-'}</td>

                           <td>{hotels.double_room_cost || '-'}</td>
                           <td>{hotels.no_of_double_rooms || '-'}</td>
                           <td>{hotels.no_double_room_nights || '-'}</td>
                           <td>{hotels.double_category || '-'}</td>
                           <td>{hotels.cost_for_double || '-'}</td>


                           <td>{hotels.triple_room_cost || '-'}</td>
                           <td>{hotels.no_of_triple_rooms || '-'}</td>
                           <td>{hotels.no_of_triple_room_nights || '-'}</td>
                           <td>{hotels.triple_category || '-'}</td>
                           <td>{hotels.cost_for_triple || '-'}</td>

                           <td>{hotels.extra_room_cost || '-'}</td>
                           <td>{hotels.no_of_extra_rooms || '-'}</td>
                           <td>{hotels.no_of_extra_room_nights || '-'}</td>
                           <td>{hotels.extra_category || '-'}</td>
                           <td>{hotels.cost_for_extra || '-'}</td>

                           <td>{hotels.final_cost || '-'}</td>
                           </tr>
                           ))}
                      </tbody>
                      </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div className="row">
                    <div className="col-lg-12">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">Transport Details</h6>
                          <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>transport Type	</th>
                                    <th>transport Category</th>
                                    <th>transport Name</th>
                                    <th>transport location</th>
                                    <th>transport vehicle</th>
                                    <th>transport Site Cap</th>
                                    <th>transport Start Date</th>
                                    <th>transport End Date</th>
                                    <th>No of Days</th>
                                    <th>No of Vehicles</th>
                                    <th>Cost Per Vehicle</th>
                                    <th>Total Cost</th>
                                    
                                    
                                  </tr>
                                </thead>
                                <tbody>
                                {transport.map((trans,ind)=>(
                                  <tr key={trans._id}>
                                  <td>{trans.transport_type}</td>
                                  <td>{trans.transport_cat}</td>
                                  <td>{trans.transport_name}</td>
                                  <td>{trans.transport_location}</td>
                                  <td>{trans.transport_vehicle}</td>
                                  <td>{trans.transport_site_cap}</td>
                                  <td>{trans.transport_start_date}</td>
                                  <td>{trans.transport_end_date}</td>
                                  <td>{trans.no_of_days}</td>
                                  <td>{trans.no_of_vehicles}</td>
                                  <td>{trans.cost_per_vehicle}</td>
                                  <td>{trans.total_cost}</td>
                                  </tr>
                                ))}
                              </tbody>
                              </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Train Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>fare_source	</th>
                          <th>train_name</th>
                          
                          <th>train_number</th>
                          <th>start_date</th>
                          <th>end_date</th>
                          <th>start_city</th>
                          <th>end_city</th>


                          <th>duration</th>
                          <th>class_name</th>
                          <th>site_available</th>
                          <th>cost Pervehicl</th>
                          <th>cost</th>
                          <th>loading</th>
                          <th>total_cost</th>
                          
                          
                        </tr>
                      </thead>
                      <tbody>
                      {train.map((trainss,ind)=>(
                        <tr key={trainss._id}>
                        <td>{trainss.fare_source}</td>
                        <td>{trainss.train_name}</td>
                        <td>{trainss.train_number}</td>
                        <td>{trainss.start_date}</td>
                        <td>{trainss.end_date}</td>


                        <td>{trainss.start_city}</td>
                        <td>{trainss.end_city}</td>
                        <td>{trainss.duration}</td>
                        <td>{trainss.class_name}</td>
                        <td>{trainss.site_available}</td>
                        <td>{trainss.cost_per_vehicle}</td>
                        <td>{trainss.cost}</td>
                        <td>{trainss.loading}</td>
                        <td>{trainss.total_cost}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>

         <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Buss Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>fare_source	</th>
                          <th>bus_name</th>
                          <th>start_datetime</th>
                          <th>reach_datetime</th>
                          <th>start_city</th>
                          <th>reach_city</th>
                          <th>journey_duration</th>
                          <th>bus_class</th>
                          <th>seats_available</th>
                          <th>cost_considered</th>
                          <th>loading_on_bus</th>
                          <th>total_bus_fare</th>                          
                        </tr>
                      </thead>
                      <tbody>
                      {bus.map((buss,ind)=>(
                        <tr key={buss._id}>
                        <td>{ind+1}</td>
                        <td>{buss.fare_source}</td>
                        <td>{buss.bus_name}</td>
                        <td>{buss.start_datetime}</td>
                        <td>{buss.reach_datetime}</td>
                        <td>{buss.start_city}</td>
                        <td>{buss.reach_city}</td>
                        <td>{buss.journey_duration}</td>
                        <td>{buss.bus_class}</td>
                        <td>{buss.seats_available}</td>
                        
                        <td>{buss.cost_considered}</td>
                        <td>{buss.loading_on_bus}</td>
                        <td>{buss.total_bus_fare}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>

         <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Cruise Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>cruise_supp	</th>
                          <th>cruise_name</th>
                          <th>contact_person</th>
                          <th>contact_number</th>
                          <th>start_date</th>

                          <th>end_date</th>
                          <th>start_city</th>
                          <th>end_city</th>
                          <th>cabin_type</th>
                          <th>meal_plan</th>

                          <th>no_of_ninghts</th>
                          <th>no_of_adults</th> 
                          <th>no_of_children</th>    
                          <th>selling_cities</th>   
                          <th>no_of_cabin</th>     
                          <th>total_cost</th>                          
                        </tr>
                      </thead>
                      <tbody>
                      {cruise.map((cruiss,ind)=>(
                        <tr key={cruiss._id}>
                        <td>{ind+1}</td>
                        <td>{cruiss.cruise_supp}</td>
                        <td>{cruiss.cruise_name}</td>
                        <td>{cruiss.contact_person}</td>
                        <td>{cruiss.contact_number}</td>
                        <td>{cruiss.start_date}</td>


                        <td>{cruiss.end_date}</td>
                        <td>{cruiss.start_city}</td>
                        <td>{cruiss.end_city}</td>
                        <td>{cruiss.cabin_type}</td>
                        <td>{cruiss.meal_plan}</td>
                        
                        <td>{cruiss.no_of_ninghts}</td>
                        <td>{cruiss.no_of_adults}</td>
                        <td>{cruiss.no_of_children}</td>
                        <td>{cruiss.selling_cities?.destination_name}</td>
                        <td>{cruiss.no_of_cabin}</td>
                        <td>{cruiss.total_cost}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Supplimentary Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>location	</th>
                          <th>provison_date</th>
                          <th>supp_name</th>
                          <th>supp_cost</th>
                                                   
                        </tr>
                      </thead>
                      <tbody>
                      {supplem.map((supp,ind)=>(
                        <tr key={supp._id}>
                        <td>{ind+1}</td>
                        <td>{supp.location}</td>
                        <td>{supp.provison_date}</td>
                        <td>{supp.supp_name}</td>
                        <td>{supp.supp_cost}</td>
                       
                        </tr>
                      ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Day Wise Itenary Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>day_no	</th>
                          <th>day_title</th>
                          <th>day_date</th>
                          <th>hotel_id</th>
                          <th>distance</th>
                          <th>meals_plan</th>
                          <th>day_summary</th>
                                                   
                        </tr>
                      </thead>
                      <tbody>
                      {dasy.map((day,ind)=>(
                        <tr key={day._id}>
                        <td>{ind+1}</td>
                        <td>{day.day_no}</td>
                        <td>{day.day_title}</td>
                        <td>{day.day_date}</td>
                        <td>{day.hotel_id.hotel_name}</td>
                        <td>{day.distance}</td>
                        <td>{day.meals_plan}</td>
                        <td>{day.day_summary}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Inclusions & Exclusions Details
</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>exclusions	</th>
                          <th>inclusions</th>
                          
                                                   
                        </tr>
                      </thead>
                      <tbody>
                    {incexc.map((incexcd, ind) => (
  <tr key={incexcd?._id || ind}>
    <td>{ind + 1}</td>
    <td>
      {Array.isArray(incexcd?.exclusions) ? (
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {incexcd.exclusions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <span>No exclusions</span>
      )}
    </td>
  </tr>
))}


                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Package Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>cost_sheet	</th>
                          <th>package_them</th>
                          <th>payment_terms</th>
                          <th>quation_validate</th>                        
                        </tr>
                      </thead>
                      <tbody>

                        {pack.map((packs,ind)=>(
                            <tr key={packs._id}>
                              <td>{ind+1}</td>
                              <td>{packs.cost_sheet}</td>
                              <td>{packs.cost_sheet}</td>
                              <td>{packs.payment_terms}</td>
                              <td>{packs.quation_validate}</td>
                            </tr>
                        ))}
                     
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Domestic Caluculation Sheet Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>Particulars</th>
                        <th>Percentage</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Land Cost</td><td></td><td>{cal.land_cost}</td></tr>
                      <tr><td>Loading % on Land Cost</td><td>{cal.loading_percentage_on_land}</td><td>{cal.loading_amount_on_land}</td></tr>
                      <tr><td>Cost to Company</td><td></td><td>{cal.cost_to_company}</td></tr>

                      <tr><td><b>-- Select Super Partner --</b></td><td>{cal.supper_partner_percentage}</td><td>{cal.supper_partner_percentage_amount}</td></tr>
                      <tr><td><b>-- Select Sales Partner --</b></td><td>{cal.sales_partner_percentage}</td><td>{cal.sales_partner_percentage_amount}</td></tr>
                      <tr><td><b>-- Select Sales Partner --</b></td><td>{cal.lead_partner_percentage}</td><td>{cal.lead_partner_percentage_amount}</td></tr>

                      <tr>
                        <td colSpan="3"><b>Partner Commissions</b><br/><small>Note: Partner commission must be under 12% to enable saving.</small></td>
                      </tr>
                      <tr><td></td><td>{cal.total_partners_percentage}</td><td>{cal.total_partners_percentage_amount}</td></tr>

                      <tr><td>Cost to be Sold</td><td></td><td>{cal.cost_to_be_sold}</td></tr>
                      <tr><td>Goods and Services Tax</td><td>{cal.goods_tax_percentage}</td><td>{cal.goods_tax_amount}</td></tr>
                      <tr style={{ backgroundColor: '#f8f9fa' }}><td>Land cost after GST & Commissions</td><td></td><td>{cal.goods_tax_amount_after_land}</td></tr>

                      <tr><td>Flight cost to be shared</td><td></td><td>{cal.flight_cost_share}</td></tr>
                      <tr><td>Loading % on Flight Cost</td><td>{cal.flight_cost_percentage}</td><td>{cal.flight_cost_amount}</td></tr>
                      <tr><td>Travel Insurance & Seat Selection</td><td>Add 500/Person</td><td>{cal.travel_insurance}</td></tr>
                      <tr><td>Total Flight Cost</td><td></td><td>{cal.total_flight_cost}</td></tr>

                      <tr><td>Cruise / Chopper / Others (Vendor Price)</td><td></td><td>{cal.cruise_cost}</td></tr>
                      <tr><td>Loading % on Cruise</td><td>{cal.loading_on_cruise_percentage}</td><td>{cal.loading_on_cruise_amount}</td></tr>
                      <tr><td>Agents Commission on Cruise</td><td>Super: {cal.supper_agent_commission}, Sales: {cal.sales_agent_commission}, Lead: {cal.lead_agent_commission}</td><td>{cal.total_agent_commission_amount}</td></tr>
                      <tr><td>Cruise Cost After Loading</td><td></td><td>{cal.cruise_amount_after_loading}</td></tr>

                      <tr><td>Total Package Cost</td><td></td><td>{cal.total_package_cost}</td></tr>
                      <tr><td>Supplementary Charges</td><td></td><td>{cal.sup_charges}</td></tr>
                      <tr><td>Train Charges</td><td></td><td>{cal.train_charges}</td></tr>
                      <tr><td>Bus Charges</td><td></td><td>{cal.bus_charges}</td></tr>
                      <tr><td>Total Package Cost (To be quoted)</td><td></td><td>{cal.total_package_cost_quoted}</td></tr>

                      <tr><td>Total No. of Pax</td><td></td><td>{cal.no_of_packs}</td></tr>
                      <tr><td>Package Cost per Person (with Flights)</td><td></td><td>{cal.package_cost_for_flight}</td></tr>
                      <tr><td>Land Cost Per Person</td><td></td><td>{cal.land_cost_per_person}</td></tr>
                      <tr><td>Flight Cost Per Person</td><td></td><td>{cal.flight_cost_per_person}</td></tr>
                      <tr><td>Cruise Cost Per Person</td><td></td><td>{cal.cruise_cost_per_person}</td></tr>
                      <tr><td>Train Cost Per Person</td><td></td><td>{cal.train_cost_per_person}</td></tr>
                      <tr><td>Bus Cost Per Person</td><td></td><td>{cal.bus_cost_per_person}</td></tr>

                      <tr><td colSpan="3"><b>Show Single Cost Per Person In Itineraries</b>{cal.show_single_cost_in_itenary}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Online Hotel Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          
                          <th>S.No</th>
                          <th>price_source	</th>
                          <th>check_in	</th>
                          <th>check_out</th>
                          <th>hotel_name</th>
                          <th>hotel_standed</th>
                          <th>in_time</th>
                          <th>out_time</th>
                          <th>location</th>
                          <th>meals_plan</th>

                          <th>no_of_double_room</th>
                          <th>no_of_double_room_cat</th>
                          <th>no_of_double_room_nights</th>

                          <th>no_of_extra_room</th>
                          <th>no_of_extra_room_cat</th>
                          <th>no_of_extra_room_nights</th>

                          <th>no_of_single_room</th>
                          <th>no_of_single_room_cat</th>
                          <th>no_of_single_room_nights</th>

                          <th>no_of_suite_room</th>
                          <th>no_of_suite_room_cat</th>
                          <th>no_of_suite_room_nights</th>

                          <th>no_of_triple_room</th>
                          <th>no_of_triple_room_cat</th>
                          <th>no_of_triple_room_nights</th>
                          <th>total_cost</th>
                                                   
                        </tr>
                      </thead>
                      <tbody>
                      {online.map((onlines,ind)=>(
                        <tr key={onlines._id}>
                        <td>{ind+1}</td>
                        <td>{onlines.price_source}</td>
                        <td>{onlines.check_in}</td>
                        <td>{onlines.check_out}</td>
                        <td>{onlines.hotel_name}</td>
                        <td>{onlines.hotel_standed}</td>
                        <td>{onlines.in_time}</td>
                        <td>{onlines.out_time}</td> 


                        <td>{onlines.location}</td>
                        <td>{onlines.meals_plan}</td>
                        <td>{onlines.no_of_double_room}</td>
                        <td>{onlines.no_of_double_room_cat}</td>
                        <td>{onlines.no_of_double_room_nights}</td>


                        <td>{onlines.no_of_extra_room}</td>
                        <td>{onlines.no_of_extra_room_cat}</td>
                        <td>{onlines.no_of_extra_room_nights}</td>
                        <td>{onlines.no_of_single_room}</td>
                        <td>{onlines.no_of_single_room_cat}</td>


                        <td>{onlines.no_of_single_room_nights}</td>
                        <td>{onlines.no_of_suite_room}</td>
                        <td>{onlines.no_of_suite_room_cat}</td>
                        <td>{onlines.no_of_suite_room_nights}</td>
                        <td>{onlines.no_of_triple_room}</td>

                        <td>{onlines.no_of_triple_room_cat}</td>
                        <td>{onlines.no_of_triple_room_nights}</td>
                        <td>{onlines.no_of_extra_room_nights}</td>
                        <td>{onlines.total_cost}</td>
                        

                        </tr>
                      ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>

         <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">International Supplier Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          
                          <th>S.No</th>
                          <th>company_name	</th>
                          <th>contact_number	</th>
                          <th>cost_bifurication</th>
                          <th>currency_rate</th>
                          <th>destination</th>
                          <th>service</th>
                          <th>sup_currecny</th>
                          <th>sup_mail</th>
                          <th>sup_quote</th>

                          <th>total_cost</th>
                          <th>total_cost_consider</th>
                                                   
                        </tr>
                      </thead>
                      <tbody>
                      {supliers.map((suplierss,ind)=>(
                        <tr key={suplierss._id}>
                        <td>{ind+1}</td>
                        <td>{suplierss.company_name}</td>
                        <td>{suplierss.contact_number}</td>
                        <td>{suplierss.cost_bifurication}</td>
                        <td>{suplierss.currency_rate}</td>
                        <td>{suplierss.destination}</td>
                        <td>{suplierss.service}</td>
                        <td>{suplierss.sup_currecny}</td> 


                        <td>{suplierss.sup_mail}</td>
                        <td>{suplierss.sup_quote}</td>
                        <td>{suplierss.total_cost}</td>


                        

                        </tr>
                      ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Visa Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
  <thead>
    <tr>
      <th>#</th>
      <th>Destination(s)</th>
      <th>Nationality</th>
      <th>No. of Pax</th>
      <th>Total Cost</th>
      <th>Cost Per Person</th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(visa) && visa.map((item, index) => (
  item && (
    <tr key={item._id || index}>
      <td>{index + 1}</td>
      <td>
        {Array.isArray(item.destination_id)
          ? item.destination_id.map((d, i) => (
              <div key={i}>{d.destination_name}</div>
            ))
          : 'N/A'}
      </td>
      <td>{item.nationality || 'N/A'}</td>
      <td>{item.no_of_pax ?? 'N/A'}</td>
      <td>{item.total_cost ?? 'N/A'}</td>
      <td>{item.cost_per_person ?? 'N/A'}</td>
    </tr>
  )
))}

  </tbody>
</table>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">TCS Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          
                          <th>S.No</th>
                          <th>adhar	</th>
                          <th>invoice	</th>
                          <th>is_customer_paying_tcs</th>
                          <th>tcs_amount</th>
                          <th>tcs_per</th>
                                                  
                        </tr>
                      </thead>
                      <tbody>
                       {tcs.map((tcss,inss)=>(
                        <tr key={tcss._id}>
                          <td>{inss+1}</td>
                          <td>{tcss.adhar}</td>
                          <td>{tcss.invoice}</td>
                          <td>{tcss.is_customer_paying_tcs}</td>
                          <td>{tcss.tcs_amount}</td>
                          <td>{tcss.tcs_per}</td>
                        </tr>
                       ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>

         <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">International Caluculation Sheet Details</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
  <thead>
    <tr>
      <th>Particulars</th>
      <th>Percentage</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><b>Land Cost</b></td><td></td><td>{cal.land_cost}</td></tr>
    <tr><td>Loading % on Land cost</td><td>{cal.loading_percentage_on_land}%</td><td>{cal.loading_amount_on_land}</td></tr>
    <tr><td><b>Cost to Company</b></td><td></td><td>{cal.cost_to_company}</td></tr>

    <tr><td><b>-- Select Super Partner --</b></td><td>{cal.supper_partner_percentage}%</td><td>{cal.supper_partner_percentage_amount}</td></tr>
    <tr><td><b>-- Select Sales Partner --</b></td><td>{cal.sales_partner_percentage}%</td><td>{cal.sales_partner_percentage_amount}</td></tr>
    <tr><td><b>-- Select Sales Partner --</b></td><td>{cal.lead_partner_percentage}%</td><td>{cal.lead_partner_percentage_amount}</td></tr>

    <tr>
      <td colSpan="3">
        <b>Partner Commissions</b><br />
        <small className="text-danger">Note: Partner commission must be under 12% to enable saving.</small>
      </td>
    </tr>
    <tr><td></td><td>{cal.total_partners_percentage}%</td><td>{cal.total_partners_percentage_amount}</td></tr>

    <tr><td><b>Cost to be Sold</b></td><td></td><td>{cal.cost_to_be_sold}</td></tr>
    <tr><td>Goods and Services Tax</td><td>{cal.goods_tax_percentage}%</td><td>{cal.goods_tax_amount}</td></tr>
    <tr><td><b>Land cost after Goods and Services Tax & Commissions</b></td><td></td><td>{cal.goods_tax_amount_after_land}</td></tr>

    <tr><td>Remittance (Add INR 4050 Per Supplier)</td><td></td><td>560</td></tr>
    <tr><td><b>Total Package Cost Including GST & Remittance</b></td><td></td><td>1359.87</td></tr>

    <tr><td>Flight cost to be shared</td><td></td><td>{cal.flight_cost_share}</td></tr>
    <tr><td>Loading % on Flight Cost</td><td>{cal.flight_cost_percentage}%</td><td>{cal.flight_cost_amount}</td></tr>
    <tr><td>Travel Insurance & Seat Selection</td><td>Add ₹500/Person</td><td>{cal.travel_insurance}</td></tr>
    <tr><td><b>Total Flight Cost</b></td><td></td><td>{cal.total_flight_cost}</td></tr>

    <tr><td>Cruise / Chopper / Others (Vendor Price)</td><td></td><td>{cal.cruise_cost}</td></tr>
    <tr><td>Loading % on Cruise</td><td>{cal.loading_on_cruise_percentage}%</td><td>{cal.loading_on_cruise_amount}</td></tr>
    <tr><td>Agents Commission on Cruise<br /><small>Super Partner: {cal.supper_agent_commission}%, Sales Partner: {cal.sales_agent_commission}%, Lead Generator: {cal.lead_agent_commission}%</small></td><td></td><td>0</td></tr>
    <tr><td><b>Cruise Cost After Loading</b></td><td></td><td>{cal.total_agent_commission_amount}</td></tr>

    <tr><td>Visa Cost</td><td></td><td>525</td></tr>
    <tr><td>Travel Insurance</td><td></td><td>100</td></tr>

    <tr><td><b>Total Package Cost</b></td><td></td><td>{cal.total_package_cost}</td></tr>
    <tr><td>Supplementary Charges</td><td></td><td>{cal.sup_charges}</td></tr>
    <tr><td>Train Charges</td><td></td><td>{cal.train_charges}</td></tr>
    <tr><td>Bus Charges</td><td></td><td>{cal.bus_charges}</td></tr>
    <tr><td><b>Total Package Cost (To be quoted)</b></td><td></td><td>{cal.total_package_cost_quoted}</td></tr>

    <tr><td>Total No. of Pax</td><td></td><td>{cal.no_of_packs}</td></tr>
    <tr><td><b>Package cost per person with Flights</b></td><td></td><td>{cal.package_cost_for_flight}</td></tr>
    <tr><td>Land Cost Per Person</td><td></td><td>{cal.land_cost_per_person}</td></tr>
    <tr><td>Flight Cost Per Person</td><td></td><td>{cal.flight_cost_per_person}</td></tr>
    <tr><td>Cruise Cost Per Person</td><td></td><td>{cal.cruise_cost_per_person}</td></tr>
    <tr><td>Train Cost Per Person</td><td></td><td>{cal.train_cost_per_person}</td></tr>
    <tr><td>Bus Cost Per Person</td><td></td><td>{cal.bus_cost_per_person}</td></tr>
    <tr><td><b>TCS</b></td><td></td><td>{cal.total_tcs_cost}</td></tr>

    <tr>
      <td colSpan="3">
        <b>Show Single Cost Per Person In Itineraries</b><br />
        <small className="text-info">Note: Please save the Calculation Sheet permanently if you have made any changes to the above details.</small>
      </td>
    </tr>
  </tbody>
</table>

                </div>
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

export default FormView;

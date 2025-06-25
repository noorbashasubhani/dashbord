import React from 'react'
import { useState,useEffect } from 'react';
import { API_URL } from '../data/apiUrl';
import { jwtDecode } from 'jwt-decode';



const Caluculation = ({ customerData, row_id , totals }) => {
const [leadApproved, setLeadApproved] = useState(false);

   const [partners,setPartners]=useState([]);
   const { total_flight_cost,
     total_cruise_cost,
      total_train_cost,
     total_bus_cost,
      transport_cost,
       online_hotel_cost,
        domestic_hotel_cost,
     supplementary_cost, total_land } = totals;
     //console.log("CALLING", totals.total_flight_cost);



    const [btns,setBtns]=useState(false);
   const [form, setForm] = useState({ land_cost: 0, loading_percentage_on_land: 0, loading_amount_on_land: 0, cost_to_company: 0, supper_partner_id: '', supper_partner_percentage: 0, supper_partner_percentage_amount: 0, sales_partner_id: '', sales_partner_percentage: 0, sales_partner_percentage_amount: 0, lead_partner_id: '', lead_partner_percentage: 0, lead_partner_percentage_amount: 0, total_partners_percentage: 0, total_partners_percentage_amount: 0, cost_to_be_sold: 0, goods_tax_percentage: 0, goods_tax_amount: 0, goods_tax_amount_after_land: 0, flight_cost_share: 0, flight_cost_percentage: 0, flight_cost_amount: 0, travel_insurance: 0, total_flight_cost: 0, cruise_cost: 0, loading_on_cruise_percentage: 0, loading_on_cruise_amount: 0, supper_agent_commission: 0, sales_agent_commission: 0, lead_agent_commission: 0, total_agent_commission_amount: 0, cruise_amount_after_loading: 0, total_package_cost: 0, sup_charges: 0, train_charges: 0, bus_charges: 0, total_package_cost_quoted: 0, no_of_packs: 0, package_cost_for_flight: 0, land_cost_per_person: 0, flight_cost_per_person: 0, cruise_cost_per_person: 0, train_cost_per_person: 0, bus_cost_per_person: 0, show_single_cost_in_itenary: 'no', doc_id: '',
    sup_status:'',sales_status:'',lead_status:'',sup_approved_by:'',sale_approved_by:'',lead_approved_by:''
    });



useEffect(() => {
  const landCost = parseFloat(form.land_cost) || 0;
  const loadingPercent = parseFloat(form.loading_percentage_on_land) || 0;
  const loadingAmount = (landCost * loadingPercent) / 100;
  const costToCompany = landCost + loadingAmount;
  const supperPercent = parseFloat(form.supper_partner_percentage) || 0;
  const salesPercent = parseFloat(form.sales_partner_percentage) || 0;
  const leadPercent = parseFloat(form.lead_partner_percentage) || 0;
  const supperAmount = (costToCompany * supperPercent) / 100;
  const salesAmount = (costToCompany * salesPercent) / 100;
  const leadAmount = (costToCompany * leadPercent) / 100;
  const totalPartnersAmount = supperAmount + salesAmount + leadAmount;
  const totalPartnersPercentage = supperPercent + salesPercent + leadPercent;
  const costToBeSold = costToCompany + totalPartnersAmount;
  const gstPercent = parseFloat(form.goods_tax_percentage) || 0;
  const goodsTaxAmount = (costToBeSold * gstPercent) / 100;
  const goodsTaxAmountAfterLand = costToBeSold + goodsTaxAmount;
  // Flight cost calculations
const flightCostShare = parseFloat(form.flight_cost_share) || 0;
const flightCostPercentage = parseFloat(form.flight_cost_percentage) || 0;
const travelInsurance = parseFloat(form.travel_insurance) || 0;
// 🔸 1. Calculate loading based on flight share
const flightLoadingAmount = (flightCostShare * flightCostPercentage) / 100;
// 🔸 2. Total Flight Cost = loading + flight cost share + manually entered insurance
const totalFlightCost = flightLoadingAmount + flightCostShare + travelInsurance;
// Cruise Details entering here
  const cruiseCost = parseFloat(form.cruise_cost) || 0;
  const loadingOnCruisePercentage = parseFloat(form.loading_on_cruise_percentage) || 0;
  const loadingOnCruiseAmount = (cruiseCost * loadingOnCruisePercentage) / 100;
  const cruiseAmountAfterLoading = cruiseCost + loadingOnCruiseAmount;
  const supperAgent = parseFloat(form.supper_agent_commission) || 0;
  const salesAgent = parseFloat(form.sales_agent_commission) || 0;
  const leadAgent = parseFloat(form.lead_agent_commission) || 0;
  const totalAgentPercentage = supperAgent + salesAgent + leadAgent;
  //alert(cruiseAmountAfterLoading);

  const totalAgentCommissionAmount = totalAgentPercentage > 0
    ? (cruiseAmountAfterLoading * totalAgentPercentage) / 100
    : 0;
const totalCruiseCost = cruiseAmountAfterLoading + totalAgentCommissionAmount;
const totalPackageCost = goodsTaxAmountAfterLand + totalFlightCost + totalCruiseCost;
const supCharges = parseFloat(form.sup_charges) || 0;
const trainCharges = parseFloat(form.train_charges) || 0;
const busCharges = parseFloat(form.bus_charges) || 0;
const totalPackageCostQuoted = totalPackageCost + supCharges + trainCharges + busCharges;

const noOfPax = parseFloat(form.no_of_packs) || 0;
const packageCostPerPerson = noOfPax > 0 ? totalPackageCostQuoted / noOfPax : 0;
const landCostPerPerson = noOfPax > 0 ? +(goodsTaxAmountAfterLand / noOfPax).toFixed(2) : 0;
const flightCostPerPerson = noOfPax > 0 ? +(totalFlightCost / noOfPax).toFixed(2) : 0;
const cruiseCostPerPerson = noOfPax > 0 ? +(totalCruiseCost / noOfPax).toFixed(2) : 0;
const trainCostPerPerson = noOfPax > 0 ? +(trainCharges / noOfPax).toFixed(2) : 0;
const busCostPerPerson = noOfPax > 0 ? +(busCharges / noOfPax).toFixed(2) : 0;

  setForm(prev => ({
    ...prev,
    loading_amount_on_land: loadingAmount,
    cost_to_company: costToCompany,
    supper_partner_percentage_amount: supperAmount,
    sales_partner_percentage_amount: salesAmount,
    lead_partner_percentage_amount: leadAmount,
    total_partners_percentage: totalPartnersPercentage,
    total_partners_percentage_amount: totalPartnersAmount,
    cost_to_be_sold: costToBeSold,
    goods_tax_amount: goodsTaxAmount,
    goods_tax_amount_after_land: goodsTaxAmountAfterLand,
    loading_on_flight_amount: flightLoadingAmount,
    flight_cost_amount:flightLoadingAmount,
    travel_insurance: travelInsurance,
    total_flight_cost: totalFlightCost,
    loading_on_cruise_amount: loadingOnCruiseAmount,
    cruise_amount_after_loading: totalCruiseCost,
    total_agent_commission_amount: totalAgentCommissionAmount,
    total_cruise_cost: totalCruiseCost,
    total_package_cost: totalPackageCost,
    total_package_cost_quoted: totalPackageCostQuoted,
    package_cost_for_flight: packageCostPerPerson,
    
land_cost_per_person: landCostPerPerson,
flight_cost_per_person: flightCostPerPerson,
cruise_cost_per_person: cruiseCostPerPerson,
train_cost_per_person: trainCostPerPerson,
bus_cost_per_person: busCostPerPerson,

  }));
}, [
  form.land_cost,
  form.loading_percentage_on_land,
  form.supper_partner_percentage,
  form.sales_partner_percentage,
  form.lead_partner_percentage,
  form.goods_tax_percentage,
  form.flight_cost_share,
  form.flight_cost_percentage,
  form.travel_insurance,
  form.cruise_cost,
  form.loading_on_cruise_percentage,
  form.supper_agent_commission,
  form.sales_agent_commission,
  form.lead_agent_commission,
  form.sup_charges,
  form.train_charges,
  form.bus_charges,
  form.no_of_packs
]);


useEffect(() => {

  getPartnersList();
  fetchCalculation();
}, [row_id, totals.total_land,totals.total_flight_cost,totals.total_cruise_cost,totals.total_train_cost,totals.total_bus_cost
  ,totals.transport_cost,totals.online_hotel_cost,totals.domestic_hotel_cost]);


  const fetchCalculation = async () => {
    if (!row_id || row_id.trim() === "") return;

    try {
      const res = await fetch(`${API_URL}/vendor/Calsingle/${row_id}`);
      if (!res.ok) throw new Error("Failed to fetch calculation");

      const data = await res.json();

      if (data.list) {
        setForm(prev => ({
          ...prev,
          ...data.list,
          land_cost: data.list.land_cost || totals.total_land || 0,
          flight_cost_share: data.list.flight_cost_share || totals.total_flight_cost || 0,
          cruise_cost:data.list.cruise_cost || totals.total_cruise_cost || 0,
          sup_charges:data.list.sup_charges || totals.supplementary_cost || 0,
          train_charges:data.list.train_charges || totals.total_train_cost || 0,
          bus_charges:data.list.bus_charges || totals.total_bus_cost || 0,
        }));
      } else {
        // no saved data: set land_cost from totals
        setForm(prev => ({
          ...prev,
          land_cost: totals.total_land || 0,
          flight_cost_share: totals.total_flight_cost || 0,
          cruise_cost: totals.total_cruise_cost || 0,
          sup_charges: totals.supplementary_cost || 0,
          train_charges: totals.total_train_cost || 0,
          bus_charges: totals.total_bus_cost || 0,
        }));
      }

      setBtns(true);
    } catch (err) {
      console.error("Error loading calculation:", err.message);
    }
  };




const handleChange = (e) => {
const { name, value } = e.target;
setForm((prev) => ({
    ...prev,
    [name]: value,
}));
};

  const saveData = async () => {
  try {
    if (!row_id || row_id.trim() === "") {
      alert("row_id is missing or invalid");
      return;
    }

    const dataToSend = {
      ...form,
      supper_partner_id: form.supper_partner_id || null,
      sales_partner_id: form.sales_partner_id || null,
      lead_partner_id: form.lead_partner_id || null,
    };

    const calData = await fetch(`${API_URL}/vendor/CalSave/${row_id}`, {
      method: 'POST', // always POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await calData.json();
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
};



const getPartnersList=async()=>{
  try{
    const responce=await fetch(`${API_URL}/vendor/Partnerlist`);
    if(!responce.ok){
      throw new Error('Something went wrong');
    }
    const datas=await responce.json();
    setPartners(datas.data);
  }catch(err){
    console.log(err.message);
  }
}

const Approve = async (cal_id, Type) => {
  //alert(row_id);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId= decoded.userId;
  let bodyData = { doc_id: row_id };


 

  if (Type === 'S') {
  bodyData.sup_status = 'A';
  bodyData.sup_approved_by = userId;
} else if (Type === 'P') {
  bodyData.sales_status = 'A';              // ✅ Use 'partner_...'
  bodyData.partner_approved_by = userId;      // ✅ Fix this line
} else if (Type === 'L') {
  bodyData.lead_status = 'A';
  bodyData.lead_approved_by = userId;
}

  try {
    const response = await fetch(`${API_URL}/vendor/calApprove`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Update successful:", result);
      //saveData();
      //fetchCalculation();
      // toast.success("Approval updated");
    } else {
      console.error("Update failed:", result.message);
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
};


  return (
    <div className="row mt-5" >
      <div className="col-lg-12" style={{ backgroundColor: '#e5550d' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Caluculation Sheet Details</h3>
           
            </div>
        </div>
        <table className="table table-stripped table-border table-sm table-bordered small">
            <thead>
                <tr>
                    <th>Particulars	</th>
                    <th>Percentage</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Land Cost</td>
                    <td></td>
                    <td><input type="number" name="land_cost" className="form-control" value={form.land_cost} onChange={handleChange} /></td>
                </tr>
                <tr>
                    <td>Loading % on Land cost</td>
                    <td><input type="number" name="loading_percentage_on_land" value={form.loading_percentage_on_land} className="form-control" onChange={handleChange}/></td>
                    <td><input type="number" name="loading_amount_on_land" value={form.loading_amount_on_land} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr>
                    <td>Cost to Company</td>
                    <td></td>
                    <td><input type="number" name="cost_to_company" value={form.cost_to_company} className="form-control" onChange={handleChange}/></td>
                </tr>
                 <tr>
                    <td>
                        <select className="form-select" value={form.supper_partner_id} name="supper_partner_id" onChange={handleChange}>
                        <option value="">--Select Super Partner--</option>
                        {partners.map((its, indx) => (
                          <option key={its._id} value={its._id}>{its.first_name}</option>
                        ))}
                      </select>
                    </td>
                    <td><input type="number" name="supper_partner_percentage" 
                    value={form.supper_partner_percentage} className="form-control" onChange={handleChange}/>
                    <span
  className={`badge ${form.sup_status === 'A' ? 'bg-success' : 'bg-danger'}`}
  onClick={() => Approve(form._id, 'S')}
  style={{ cursor: 'pointer' }}
>
  Approve
</span></td>
                    <td><input type="number" name="supper_partner_percentage_amount" value={form.supper_partner_percentage_amount} className="form-control" onChange={handleChange}/></td>
                </tr>
                 <tr>
                    <td>
                        <select className="form-select" value={form.sales_partner_id} name="sales_partner_id" onChange={handleChange}>
                            <option>--Select Sales Parnter--</option>
                            {partners.map((its, indx) => (
                          <option key={its._id} value={its._id}>{its.first_name}</option>
                        ))}
                        </select>
                        
                    </td>
                    <td><input type="number" name="sales_partner_percentage" value={form.sales_partner_percentage} 
                    className="form-control" onChange={handleChange}/>
                    <span
  className={`badge ${form.sales_status === 'A' ? 'bg-success' : 'bg-danger'}`}
  onClick={() => Approve(form._id, 'P')}
  style={{ cursor: 'pointer' }}
>
  Approve
</span>
                    </td>
                    <td><input type="number" name="sales_partner_percentage_amount" value={form.sales_partner_percentage_amount} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr>
                    <td>
                        <select className="form-select" value={form.lead_partner_id} name="lead_partner_id"  onChange={handleChange}>
                            <option>--Select Sales Parnter--</option>
                            {partners.map((its, indx) => (
                          <option key={its._id} value={its._id}>{its.first_name}</option>
                        ))}
                        </select>
                    </td>
                    <td><input type="number" name="lead_partner_percentage" value={form.lead_partner_percentage} 
                    className="form-control" onChange={handleChange}/>
                    <span
  className={`badge ${form.lead_status === 'A' ? 'bg-success' : 'bg-danger'}`}
  onClick={() => Approve(form._id, 'L')}
  style={{ cursor: 'pointer' }}
>
  Approve
</span>
                    </td>
                    <td><input type="number" name="lead_partner_percentage_amount" value={form.lead_partner_percentage_amount} className="form-control" onChange={handleChange}/></td>
                </tr>

                <tr>
                    <td>Partner Commissions</td>
                    <td><input type="number" name="total_partners_percentage" value={form.total_partners_percentage} className="form-control" onChange={handleChange}/></td>
                    <td><input type="number" name="total_partners_percentage_amount" value={form.total_partners_percentage_amount} className="form-control" onChange={handleChange}/></td>
                </tr>

                <tr>
                    <td>Cost to be Sold	</td>
                    <td></td>
                    <td><input type="number" name="cost_to_be_sold" value={form.cost_to_be_sold} className="form-control" onChange={handleChange}/></td>
                </tr>

                <tr>
                    <td>Goods and Services Tax	</td>
                    <td><input type="number" name="goods_tax_percentage" value={form.goods_tax_percentage} className="form-control" onChange={handleChange}/></td>
                    <td><input type="number" name="goods_tax_amount" value={form.goods_tax_amount} className="form-control" onChange={handleChange}/></td>
                </tr>

               <tr className="table-primary">

                    <td>Land cost after Goods and Services Tax & Commissions	</td>
                    <td></td>
                    <td><input type="number" name="goods_tax_amount_after_land" value={form.goods_tax_amount_after_land} className="form-control" onChange={handleChange}/></td>
                </tr>

                <tr className="bg-dark">
                    <td>Flight cost to be shared	</td>
                    <td></td>
                    <td><input type="number" name="flight_cost_share" value={form.flight_cost_share} className="form-control" onChange={handleChange}/></td>
                </tr>

                 <tr className="bg-dark">
                    <td>Loading % on Flight Cost	</td>
                    <td><input type="number" name="flight_cost_percentage" value={form.flight_cost_percentage} className="form-control" onChange={handleChange}/></td>
                    <td><input type="number" name="flight_cost_amount" value={form.flight_cost_amount} className="form-control" onChange={handleChange}/></td>
                </tr>

                 <tr className="bg-dark">
                    <td>Travel Insurance & Seat Selection(If flight is provided)	</td>
                    <td><input type="text" name="" className="form-control" value="Add 500 Per Person" onChange={handleChange} readonly/></td>
                    <td><input type="number" name="travel_insurance" value={form.travel_insurance} className="form-control" onChange={handleChange}/></td>
                </tr>

                 <tr className="table-primary">
                    <td>Total Flight Cost	</td>
                    <td></td>
                    <td><input type="number" name="total_flight_cost" value={form.total_flight_cost} className="form-control" onChange={handleChange}/></td>
                </tr>

                <tr className="bg-dark">
                    <td>Cruise cost / Chopper / Others(Vendor Price)	</td>
                    <td></td>
                    <td><input type="number" name="cruise_cost" value={form.cruise_cost} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr className="bg-dark">
                    <td>Loding % on cruise	</td>
                    <td><input type="number" name="loading_on_cruise_percentage" value={form.loading_on_cruise_percentage} className="form-control" onChange={handleChange}/></td>
                    <td><input type="number" name="loading_on_cruise_amount" value={form.loading_on_cruise_amount} className="form-control" onChange={handleChange}/></td>
                </tr>

                <tr className="bg-dark">
                    <td>Agents commission on Cruise		</td>
                    <td>
                    Super Partner:<input type="number" name="supper_agent_commission" value={form.supper_agent_commission} className="form-control" onChange={handleChange}/>
                    Sales Partner:<input type="number" name="sales_agent_commission" value={form.sales_agent_commission} className="form-control" onChange={handleChange}/>
                    Lead Generator:<input type="number" name="lead_agent_commission" value={form.lead_agent_commission} className="form-control" onChange={handleChange}/>
                    </td>
                    <td><input type="number" name="total_agent_commission_amount" value={form.total_agent_commission_amount} className="form-control" onChange={handleChange}/></td>
                </tr>

                <tr className="table-primary">
                    <td>Cruise Cost After Loading	</td>
                    <td></td> 
                    <td><input type="number" name="cruise_amount_after_loading" value={form.cruise_amount_after_loading} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr className="table-primary1">
                    <td>Total Package cost		</td>
                    <td></td>
                    <td><input type="number" name="total_package_cost" value={form.total_package_cost} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr className="table-primary1">
                    <td>Supplementary Charges		</td>
                    <td></td>
                    <td><input type="number" name="sup_charges" value={form.sup_charges} className="form-control" onChange={handleChange}/></td>
                </tr>
                 <tr className="bg-dark">
                    <td>Train Charges	</td>
                    <td></td>
                    <td><input type="number" name="train_charges" value={form.train_charges} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr className="bg-dark">
                    <td>Bus Charges		</td>
                    <td></td>
                    <td><input type="number" name="bus_charges" value={form.bus_charges} className="form-control" onChange={handleChange}/></td>
                </tr>

                 <tr className="table-primary">
                    <td>Total Package Cost (To be quoted)		</td>
                    <td></td>
                    <td><input type="number" name="total_package_cost_quoted" value={form.total_package_cost_quoted} className="form-control" onChange={handleChange}/></td>
                </tr>
                 <tr className="bg-dark">
                    <td>Total No.of Pax	</td>
                    <td></td>
                    <td><input type="number" name="no_of_packs" value={form.no_of_packs} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr className="bg-dark">
                    <td>Package cost per person with Flights	</td>
                    <td></td>
                    <td><input type="number" name="package_cost_for_flight" value={form.package_cost_for_flight} className="form-control" onChange={handleChange}/></td>
                </tr>
                 <tr className="bg-dark">
                    <td colSpan={2}>Land Cost Per Person	</td>                   
                    <td><input type="number" name="land_cost_per_person" value={form.land_cost_per_person} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr className="bg-dark">
                    <td colSpan={2}>Flight Cost Per Person		</td>                   
                    <td><input type="number" name="flight_cost_per_person" value={form.flight_cost_per_person} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr className="bg-dark">
                    <td colSpan={2}>Cruise Cost Per Person		</td>                   
                    <td><input type="number" name="cruise_cost_per_person" value={form.cruise_cost_per_person} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr className="bg-dark">
                    <td colSpan={2}>Train Cost Per Person			</td>                   
                    <td><input type="number" name="train_cost_per_person" value={form.train_cost_per_person} className="form-control" onChange={handleChange}/></td>
                </tr>
                 <tr className="bg-dark">
                    <td colSpan={2}>Bus Cost Per Person			</td>                   
                    <td><input type="number" name="bus_cost_per_person" value={form.bus_cost_per_person} className="form-control" onChange={handleChange}/></td>
                </tr>
                <tr className="table-primary">
                    <td colSpan={2}>Show Single Cost Per Person In Itineraries</td>                   
                    <td><input type="checkbox" name="show_single_cost_in_itenary" onChange={handleChange}/></td>
                </tr>
                 
                 <tr>
                    <td></td>
                    <td></td>
                    <td><button className="btn btn-primary btn-sm" onClick={saveData}>Save Caluculation</button></td>
                 </tr>
            </tbody>
        </table>
       </div> 
     </div>
  )
}

export default Caluculation
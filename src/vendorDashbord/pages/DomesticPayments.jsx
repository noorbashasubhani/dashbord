import React, { useEffect, useState } from 'react';
import { API_URL } from '../data/apiUrl';

const DomesticPayments = () => {
  const tableHeaders = [
    "S.No",
    "Cash In Hand",
    "Booking To Be Process",
    "Ref No.",
    "Trip Start Date",
    "Trip End Date",
    "Links",
    "Qc Done By",
    "Sale Date",
    "Customer Name",
    "Holiday Destination",
    "Handled By",
    "Booking Entry Date",
    "Voucher Permission",
    "Customer Support Manager",
    "Partner Payout Status",
    "Source",
    "GST Amount",
    "TCS %",
    "TCS Amount",
    "Customer Require Invoice ?",
    "Customers Pan Card Linked with aadhar ?",
    "Itinerary Manager",
    "Move To Completed Payment"
  ];

  const [domestpay, setDomesticpay] = useState([]);
  const [emp, setEmp] = useState([]);

  const getLeads = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/ReservePaydata`);
      if (!response.ok) throw new Error('Data not coming from the API');
      const datares = await response.json();

      const dataWithState = datares.data.map(row => ({
        ...row,
        bookingstatus: row.bookingstatus || '',
        voucher_permission: row.voucher_permission || '',
        payout_status: row.payout_status || '',
        payment_completed: row.payment_completed || '',
        handled_by: row.handled_by || null,
        supportManager: row.supportManager || null,
        booking_entry_date: row.booking_entry_date || '',
        gst_amount: row.gst_amount || '',
        tcs_percent: row.tcs_percent || '',
      }));

      setDomesticpay(dataWithState);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getEmployee = async () => {
    try {
      const resp = await fetch(`${API_URL}/vendor/Userlist`);
      const newData = await resp.json();
      setEmp(newData.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getLeads();
    getEmployee();
  }, []);

  const handleRowChange = (index, field, value) => {
    const updated = [...domestpay];
    updated[index][field] = value;
    setDomesticpay(updated);

    const payload = {
      ...updated[index],
      id: updated[index]._id,
    };

    saveRowToDB(payload);
  };

  const getSelectClass = (value) => {
    if (value === 'Process' || value === 'Yes') return 'form-select form-select-sm text-white bg-success';
    if (value === 'Hold' || value === 'No') return 'form-select form-select-sm text-white bg-danger';
    return 'form-select form-select-sm';
  };

  const saveRowToDB = async (rowData) => {
    try {
      if (!rowData.id) {
        console.error("Missing doc_id in row:", rowData);
        return;
      }

      const response = await fetch(`${API_URL}/vendor/leadPayment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Saved successfully:', result);
      } else {
        console.error('Save failed:', result.message);
      }
    } catch (err) {
      console.error('Error saving data:', err.message);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark">
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index} style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {domestpay.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>--</td>
              <td>
                <select
                  className={getSelectClass(item.bookingstatus)}
                  value={item.bookingstatus}
                  onChange={(e) => handleRowChange(index, 'bookingstatus', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Process">Process</option>
                  <option value="Hold">Hold</option>
                </select>
              </td>
              <td>{item.ghrn_no}</td>
              <td>{item.start_date}</td>
              <td>{item.end_date}</td>
              <td>--</td>
              <td>{item.qc_done_by?.first_name}</td>
              <td>{item.confirmed_date}</td>
              <td>{item.customer_name}</td>
              <td>{item.holiday_destination?.destination_name}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={item.handled_by?._id || ''}
                  onChange={(e) =>
                    handleRowChange(index, 'handled_by', emp.find(emp => emp._id === e.target.value))
                  }
                >
                  <option value="">-- Select --</option>
                  {emp.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.first_name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={item.booking_entry_date}
                  onChange={(e) => handleRowChange(index, 'booking_entry_date', e.target.value)}
                />
              </td>
              <td>
                <select
                  className={getSelectClass(item.voucher_permission)}
                  value={item.voucher_permission}
                  onChange={(e) => handleRowChange(index, 'voucher_permission', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Process">Process</option>
                  <option value="Hold">Hold</option>
                </select>
              </td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={item.supportManager?._id || ''}
                  onChange={(e) =>
                    handleRowChange(index, 'supportManager', emp.find(emp => emp._id === e.target.value))
                  }
                >
                  <option value="">-- Select --</option>
                  {emp.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.first_name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className={getSelectClass(item.payout_status)}
                  value={item.payout_status}
                  onChange={(e) => handleRowChange(index, 'payout_status', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Process">Process</option>
                  <option value="Hold">Hold</option>
                </select>
              </td>
              <td>{item.lead_source}</td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={item.gst_amount}
                  onChange={(e) => handleRowChange(index, 'gst_amount', e.target.value)}
                />
              </td>
              <td>{item.tcs_data?.tcs_per}</td>
              <td>{item.tcs_data?.tcs_amount}</td>
              <td>{item.tcs_data?.invoice}</td>
              <td>{item.tcs_data?.adhar}</td>
              <td>{item.operation_executive?.first_name}</td>
              <td>
                <select
                  className={getSelectClass(item.payment_completed)}
                  value={item.payment_completed}
                  onChange={(e) => handleRowChange(index, 'payment_completed', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DomesticPayments;

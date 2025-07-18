import React, { useEffect, useState } from 'react';
import { API_URL } from '../data/apiUrl';

const CompletedCustomer = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchCompletedTrips();
  }, []);

  const fetchCompletedTrips = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/confirm`);
      const json = await res.json();
      setTrips(json.data || []);
    } catch (error) {
      console.error('Error fetching completed trips:', error);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  const completedTrips = trips.filter(trip =>
    trip.end_date?.slice(0, 10) < today
  );

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Completed Trips</h5>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>GHRN</th>
                <th>Lead Passenger Name</th>
                <th>Sub Pax</th>
                <th>Destination</th>
                <th>Trip Start Date</th>
                <th>Trip End Date</th>
                <th>Manager</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {completedTrips.length > 0 ? (
                completedTrips.map((trip, index) => (
                  <tr key={trip._id}>
                    <td>{index + 1}</td>
                    <td>{trip.ghrn_no || '-'}</td>
                    <td>{trip.customer_name || '-'}</td>
                    <td>{trip.sub_pax || '-'}</td>
                    <td>{trip.holiday_destination?.destination_name || '-'}</td>
                    <td>{trip.start_date?.slice(0, 10) || '-'}</td>
                    <td>{trip.end_date?.slice(0, 10) || '-'}</td>
                    <td>{trip.supportManager?.first_name || '-'}</td>
                    <td>
                      <button className="btn btn-sm btn-primary">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No completed trips found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompletedCustomer;

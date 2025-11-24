import { useState, useEffect } from "react";
import { getMyApointments } from "../api/api";
import "./Table.css"; // Common table styles

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await getMyApointments();
        setAppointments(data);
      } catch (error) {
        console.error("Could not fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="table-page-container">
      <h2>My Appointments</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <tr key={apt._id}>
                  <td>Dr. {apt.doctor.firstName} {apt.doctor.lastName}</td>
                  <td>{apt.doctor.specialization}</td>
                  <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status status-${apt.status.toLowerCase()}`}>{apt.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">You have no appointments.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAppointments;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDoctors, getMyAppointments, getPatientProfile } from '../../api/api';
import DoctorCard from '../../components/DoctorCard';
import './PatientDashboard.css'; // Styling के लिए CSS फ़ाइल

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appointmentsRes, doctorsRes] = await Promise.all([
          getPatientProfile(),
          getMyAppointments(),
          getAllDoctors()
        ]);
        setPatient(profileRes.data);
        setAppointments(appointmentsRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error("Could not fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed')
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="patient-dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Welcome, {patient?.firstName}!</h2>
          <p>Here's a summary of your medical activities.</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>{upcomingAppointments.length}</h3>
          <p>Upcoming Appointments</p>
        </div>
        <div className="summary-card">
          <h3>{appointments.length}</h3>
          <p>Total Appointments</p>
        </div>
        <div className="summary-card">
          <Link to="/patient-panel/book-appointment" className="btn btn-primary w-100 h-100 d-flex flex-column justify-content-center align-items-center text-decoration-none">
            <h4 className="text-white">Book New Appointment</h4>
            <p className="text-white-50">Click to schedule</p>
          </Link>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Your Next Appointments</h3>
        <div className="appointment-list">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.slice(0, 3).map(apt => (
              <div key={apt._id} className="appointment-item">
                <div className="appointment-details">Dr. {apt.doctor.firstName} {apt.doctor.lastName}</div>
                <div className="appointment-date">{new Date(apt.appointmentDate).toLocaleDateString()}</div>
                <div><span className={`status-badge status-${apt.status}`}>{apt.status}</span></div>
              </div>
            ))
          ) : (
            <p>You have no upcoming appointments.</p>
          )}
        </div>
        <Link to="/patient-panel/appointments" className="btn btn-link mt-3">View All Appointments</Link>
      </div>

      <div className="dashboard-section">
        <h3>Find a Doctor</h3>
        <input
          type="text"
          className="form-control doctor-search"
          placeholder="Search by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="doctors-list">
          {filteredDoctors.map((doctor) => (
            <DoctorCard 
              key={doctor._id}
              doctorId={doctor._id}
              name={`Dr. ${doctor.firstName} ${doctor.lastName}`} 
              specialization={doctor.specialization}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

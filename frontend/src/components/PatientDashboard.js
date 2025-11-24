import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApointments } from '../api/api';
import './PatientDashboard.css';

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getMyApointments();
                setAppointments(data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const upcomingAppointments = appointments
        .filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'Cancelled' && apt.status !== 'Completed')
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

    const totalAppointments = appointments.length;

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div className="patient-dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.name}!</h1>
                <p>Here's a summary of your medical appointments.</p>
            </div>

            <div className="dashboard-summary-cards">
                <div className="summary-card">
                    <h3>{upcomingAppointments.length}</h3>
                    <p>Upcoming Appointments</p>
                </div>
                <div className="summary-card">
                    <h3>{totalAppointments}</h3>
                    <p>Total Appointments</p>
                </div>
                <div className="summary-card cta">
                    <Link to="/patient/book-appointment">
                        <h3>Book New Appointment</h3>
                        <p>Click here to schedule</p>
                    </Link>
                </div>
            </div>

            <div className="upcoming-appointments">
                <h2>Your Next Appointments</h2>
                {upcomingAppointments.length > 0 ? (
                    <div className="appointment-list">
                        {upcomingAppointments.slice(0, 3).map(apt => (
                            <div key={apt._id} className="appointment-item">
                                <div className="appointment-details">
                                    <strong>Dr. {apt.doctor.firstName} {apt.doctor.lastName}</strong>
                                    <span>{apt.doctor.specialization}</span>
                                </div>
                                <div className="appointment-time">
                                    <span>{new Date(apt.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    <span>{new Date(apt.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                                <div className="appointment-status">
                                    <span className={`status status-${apt.status.toLowerCase()}`}>{apt.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no upcoming appointments.</p>
                )}
                <div className="view-all-link">
                    <Link to="/patient/appointments">View All Appointments</Link>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
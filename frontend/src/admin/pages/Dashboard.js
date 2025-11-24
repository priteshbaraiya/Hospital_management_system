import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDoctors, getUsers, getAllAppointments } from '../../api/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './Dashboard.css'; // Modern styling के लिए

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    totalAppointments: 0,
  });
  const [appointmentStatusData, setAppointmentStatusData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FFC107', // Pending
        '#198754', // Approved
        '#DC3545', // Cancelled
        '#6C757D', // Completed
      ],
      hoverOffset: 4,
    }],
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
          getAllDoctors(),
          getUsers(),
          getAllAppointments(),
        ]);

        const statusCounts = appointmentsRes.data.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          doctors: doctorsRes.data.length,
          patients: patientsRes.data.length,
          totalAppointments: appointmentsRes.data.length,
          pending: statusCounts.pending || 0,
        });

        setAppointmentStatusData({
          labels: Object.keys(statusCounts),
          datasets: [{ ...appointmentStatusData.datasets[0], data: Object.values(statusCounts) }],
        });

        // Sort appointments by date and get the 5 most recent
        const sortedAppointments = [...appointmentsRes.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentAppointments(sortedAppointments.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <div className="dashboard-grid">
        <div className="stat-card primary" onClick={() => navigate('/admin/doctors')}>
          <h5>Total Doctors</h5>
          <p className="stat-number">{stats.doctors}</p>
        </div>
        <div className="stat-card success" onClick={() => navigate('/admin/patients')}>
          <h5>Total Patients</h5>
          <p className="stat-number">{stats.patients}</p>
        </div>
        <div className="stat-card info" onClick={() => navigate('/admin/appointments')}>
          <h5>Total Appointments</h5>
          <p className="stat-number">{stats.totalAppointments}</p>
        </div>
        <div className="stat-card warning" onClick={() => navigate('/admin/appointments')}>
          <h5>Pending Appointments</h5>
          <p className="stat-number">{stats.pending}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h5 className="mb-3">Appointments by Status</h5>
          <Doughnut data={appointmentStatusData} />
        </div>
        <div className="chart-container">
          <h5 className="mb-3">Recent Appointments</h5>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map(apt => (
                <tr key={apt._id}>
                  <td>{apt.patient?.firstName || 'N/A'}</td>
                  <td>Dr. {apt.doctor?.firstName || 'N/A'}</td>
                  <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                  <td><span className={`badge bg-${apt.status === 'approved' ? 'success' : apt.status === 'pending' ? 'warning' : 'danger'}`}>{apt.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
            <div className="card">
                <div className="card-body text-center">
                    <h5 className="card-title">Current System Time</h5>
                    <p className="card-text fs-3">{currentTime}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

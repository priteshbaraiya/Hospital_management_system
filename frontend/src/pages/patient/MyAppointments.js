import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyAppointments, cancelMyAppointment } from '../../api/api';
import { Toast, ToastContainer, Pagination } from 'react-bootstrap';
import './MyAppointments.css'; // Custom styles for this page

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Filtering, Sorting, and Pagination
  const [filterStatus, setFilterStatus] = useState('upcoming');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' for upcoming, 'desc' for past
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await getMyAppointments();
      setAppointments(data);
    } catch (err) {
      showToast("Could not fetch appointments.", "danger");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelMyAppointment(appointmentId);
        showToast('Appointment cancelled successfully.');
        fetchAppointments();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to cancel appointment.', 'danger');
        console.error(err);
      }
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const isUpcoming = new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed';
    if (filterStatus === 'upcoming') return isUpcoming;
    if (filterStatus === 'completed') return apt.status === 'completed';
    if (filterStatus === 'cancelled') return apt.status === 'cancelled';
    return false; // Should not happen with the given filters
  });

  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <div className="my-appointments-container">
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide bg={toast.type}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="appointments-header">
        <h2>My Appointments</h2>
        <div className="appointments-controls">
          <div className="btn-group" role="group">
            <button type="button" className={`btn btn-outline-primary ${filterStatus === 'upcoming' ? 'active' : ''}`} onClick={() => { setFilterStatus('upcoming'); setSortDirection('asc'); setCurrentPage(1); }}>Upcoming</button>
            <button type="button" className={`btn btn-outline-primary ${filterStatus === 'completed' ? 'active' : ''}`} onClick={() => { setFilterStatus('completed'); setSortDirection('desc'); setCurrentPage(1); }}>Completed</button>
            <button type="button" className={`btn btn-outline-primary ${filterStatus === 'cancelled' ? 'active' : ''}`} onClick={() => { setFilterStatus('cancelled'); setSortDirection('desc'); setCurrentPage(1); }}>Cancelled</button>
          </div>
          <select className="form-select" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
            <option value="asc">Oldest First</option>
            <option value="desc">Newest First</option>
          </select>
        </div>
      </div>

      <div className="appointments-grid">
        {currentItems.length > 0 ? (
          currentItems.map(apt => (
            <div key={apt._id} className="appointment-card">
              <div className="card-header">
                <h5>Dr. {apt.doctor.firstName} {apt.doctor.lastName}</h5>
                <span className={`status-badge status-${apt.status}`}>{apt.status}</span>
              </div>
              <div className="card-body">
                <p><strong>Specialization:</strong> {apt.doctor.specialization}</p>
                <p><strong>Date:</strong> {new Date(apt.appointmentDate).toLocaleDateString()}</p>
                <p><strong>Reason:</strong> {apt.reason}</p>
              </div>
              <div className="card-footer">
                {(apt.status === 'pending' || apt.status === 'approved') && (
                  <button onClick={() => handleCancel(apt._id)} className="btn btn-sm btn-outline-danger">Cancel</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-appointments-card">
            <h4>No {filterStatus} appointments found.</h4>
            <p>Looks like you don't have any appointments in this category.</p>
            <button onClick={() => navigate('/patient-panel/book-appointment')} className="btn btn-primary">Book a New Appointment</button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <Pagination>
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages).keys()].map(number => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;

import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../../api/api';
import { Pagination, Toast, ToastContainer } from 'react-bootstrap';
import './ManageAppointments.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filtering and Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'appointmentDate', direction: 'descending' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsRes, doctorsRes] = await Promise.all([
          api.getAllAppointments(),
          api.getAllDoctors()
        ]);
        setAppointments(appointmentsRes.data);
        setDoctors(doctorsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Toast message timer
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(''); setError(''); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateAppointmentStatus(id, { status });
      // Update status locally for instant UI feedback
      setAppointments(prev => prev.map(apt => apt._id === id ? { ...apt, status } : apt));
      setSuccess('Appointment status updated successfully');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = [...appointments];

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        `${apt.patient?.firstName} ${apt.patient?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }
    if (filterDoctor) {
      filtered = filtered.filter(apt => apt.doctor?._id === filterDoctor);
    }
    if (filterDate) {
      filtered = filtered.filter(apt => new Date(apt.appointmentDate).toISOString().slice(0, 10) === filterDate);
    }

    filtered.sort((a, b) => {
      let aValue = sortConfig.key.includes('.') ? sortConfig.key.split('.').reduce((o, i) => o[i], a) : a[sortConfig.key];
      let bValue = sortConfig.key.includes('.') ? sortConfig.key.split('.').reduce((o, i) => o[i], b) : b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [appointments, searchTerm, filterStatus, filterDoctor, filterDate, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedAppointments.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="manage-appointments-container">
      <ToastContainer position="top-end" className="p-3 message-toast">
        {success && <Toast bg="success" onClose={() => setSuccess('')} show={!!success} delay={3000} autohide><Toast.Body className="text-white">{success}</Toast.Body></Toast>}
        {error && <Toast bg="danger" onClose={() => setError('')} show={!!error} delay={3000} autohide><Toast.Body className="text-white">{error}</Toast.Body></Toast>}
      </ToastContainer>

      <div className="page-header">
        <h2>Manage Appointments</h2>
      </div>

      <div className="filters-container">
        <input type="text" className="form-control" placeholder="Search by patient name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <select className="form-select" value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)}>
          <option value="">All Doctors</option>
          {doctors.map(doc => <option key={doc._id} value={doc._id}>Dr. {doc.firstName} {doc.lastName}</option>)}
        </select>
        <input type="date" className="form-control" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th onClick={() => requestSort('patient.firstName')}>Patient {sortConfig.key === 'patient.firstName' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
              <th onClick={() => requestSort('doctor.firstName')}>Doctor {sortConfig.key === 'doctor.firstName' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
              <th onClick={() => requestSort('appointmentDate')}>Date {sortConfig.key === 'appointmentDate' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
              <th>Status</th>
              <th className="text-center">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? currentItems.map(apt => (
              <tr key={apt._id}>
                <td>{apt.patient?.firstName} {apt.patient?.lastName}</td>
                <td>Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</td>
                <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                <td><span className={`status-badge status-${apt.status}`}>{apt.status}</span></td>
                <td className="text-center">
                  <select className="form-select form-select-sm" value={apt.status} onChange={(e) => handleStatusChange(apt._id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center no-results">No appointments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <Pagination>
            {[...Array(totalPages).keys()].map(number => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;

import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../../api/api';
import PatientFormModal from '../components/PatientFormModal';
import { Pagination, Toast, ToastContainer } from 'react-bootstrap';
import Papa from 'papaparse';
import './ManagePatients.css';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.getUsers(); // getUsers fetches patients
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch patients');
    }
    setLoading(false);
  };

  const handleSave = async (patientData) => {
    try {
      if (selectedPatient) {
        await api.updateUser(selectedPatient._id, patientData);
        setSuccess('Patient updated successfully');
      } else {
        await api.createUser(patientData);
        setSuccess('Patient created successfully');
      }
      fetchPatients();
      setIsModalOpen(false);
      setSelectedPatient(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save patient');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.deleteUser(id);
        setSuccess('Patient deleted successfully');
        fetchPatients(); // Refetch to update list and pagination
      } catch (err) {
        console.error(err);
        setError('Failed to delete patient');
      }
    }
  };

  const handleExportCSV = () => {
    const dataToExport = filteredAndSortedPatients.map(patient => ({
      'First Name': patient.firstName,
      'Last Name': patient.lastName,
      'Email': patient.email,
      'Phone': patient.phone || 'N/A',
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `patients-export-${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone && patient.phone.includes(searchTerm))
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [patients, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredAndSortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredAndSortedPatients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading patients...</p>;

  return (
    <div className="manage-patients-container">
      <ToastContainer position="top-end" className="p-3 message-toast">
        {success && <Toast bg="success" onClose={() => setSuccess('')} show={!!success} delay={3000} autohide><Toast.Body className="text-white">{success}</Toast.Body></Toast>}
        {error && <Toast bg="danger" onClose={() => setError('')} show={!!error} delay={3000} autohide><Toast.Body className="text-white">{error}</Toast.Body></Toast>}
      </ToastContainer>

      <div className="page-header">
        <h2>Manage Patients</h2>
      </div>

      <div className="controls-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={handleExportCSV} disabled={filteredAndSortedPatients.length === 0}>
            <i className="bi bi-download me-2"></i>Export to CSV
          </button>
          <button className="btn btn-primary" onClick={() => { setSelectedPatient(null); setIsModalOpen(true); }}>
            <i className="bi bi-plus-circle me-2"></i>Add New Patient
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th onClick={() => requestSort('firstName')}>Name {sortConfig.key === 'firstName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
              <th onClick={() => requestSort('email')}>Email {sortConfig.key === 'email' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
              <th>Phone</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.length > 0 ? currentPatients.map(patient => (
              <tr key={patient._id}>
                <td>{patient.firstName} {patient.lastName}</td>
                <td>{patient.email}</td>
                <td>{patient.phone || 'N/A'}</td>
                <td className="text-center action-buttons">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedPatient(patient); setIsModalOpen(true); }}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(patient._id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center no-results">No patients found.</td></tr>
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

      {isModalOpen && (
        <PatientFormModal 
          patient={selectedPatient} 
          onSave={handleSave} 
          onClose={() => { setIsModalOpen(false); setSelectedPatient(null); }} 
        />
      )}
    </div>
  );
};

export default ManagePatients;

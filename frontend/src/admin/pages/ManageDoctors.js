import React, { useState, useEffect } from 'react';
import * as api from '../../api/api';
import DoctorFormModal from '../components/DoctorFormModal';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.getAllDoctors();
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch doctors');
    }
    setLoading(false);
  };

  const handleSave = async (doctorData) => {
    try {
      if (selectedDoctor) {
        await api.updateDoctor(selectedDoctor._id, doctorData);
      } else {
        await api.createDoctor(doctorData);
      }
      fetchDoctors();
      setIsModalOpen(false);
      setSelectedDoctor(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save doctor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.deleteDoctor(id);
        setDoctors(doctors.filter(d => d._id !== id));
      } catch (err) {
        console.error(err);
        setError('Failed to delete doctor');
      }
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  return (
    <div>
      <h2 className="mb-4">Manage Doctors</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '300px' }}
          placeholder="Search by name, email, or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => { setSelectedDoctor(null); setIsModalOpen(true); }}>Add New Doctor</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.map(doctor => (
            <tr key={doctor._id}>
              <td>{doctor.firstName} {doctor.lastName}</td>
              <td>{doctor.email}</td>
              <td>{doctor.specialization}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => { setSelectedDoctor(doctor); setIsModalOpen(true); }}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(doctor._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <DoctorFormModal 
          doctor={selectedDoctor} 
          onSave={handleSave} 
          onClose={() => { setIsModalOpen(false); setSelectedDoctor(null); }} 
        />
      )}
    </div>
  );
};

export default ManageDoctors;

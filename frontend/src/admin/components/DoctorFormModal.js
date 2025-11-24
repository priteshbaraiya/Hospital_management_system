import React, { useState, useEffect } from 'react';

const DoctorFormModal = ({ doctor, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    specialization: '',
    contact: '',
    department: '',
  });

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        specialization: '',
        contact: '',
        department: '',
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{doctor ? 'Edit Doctor' : 'Add Doctor'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              {!doctor && (
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Specialization</label>
                <input type="text" className="form-control" name="specialization" value={formData.specialization} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact</label>
                <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Department</label>
                <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorFormModal;

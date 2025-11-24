import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getDepartments, getDoctorsByDepartment, createAppointment, getAllDoctors, getDoctorAvailability } from '../../api/api';
import { Toast, ToastContainer, Spinner } from 'react-bootstrap';
import '../../components/Form.css'; // Modern styling के लिए CSS फ़ाइल
import './BookAppointment.css'; // Custom styles for this page

const BookAppointment = () => {
  const location = useLocation();
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await getDepartments();
        setDepartments(data);
      } catch (error) {
        showToast("Could not fetch departments.", "danger");
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const prefillDoctor = async () => {
      const doctorIdFromState = location.state?.doctorId;
      if (doctorIdFromState) {
        try {
          setDoctorsLoading(true);
          const { data: allDocs } = await getAllDoctors();
          const selectedDoc = allDocs.find(d => d._id === doctorIdFromState);
          if (selectedDoc) {
            setFormData(prev => ({ ...prev, department: selectedDoc.department, doctor: selectedDoc._id }));
          }
        } catch (err) {
          showToast("Could not pre-fill doctor info.", "danger");
        } finally {
          setDoctorsLoading(false);
        }
      }
    };
    prefillDoctor();
  }, [location.state]);

  // Fetch doctors when department changes
  useEffect(() => {
    if (formData.department) {
      const fetchDoctors = async () => {
        setDoctorsLoading(true);
        setDoctors([]);
        setFormData(prev => ({ ...prev, doctor: '' }));
        try {
          const { data } = await getDoctorsByDepartment(formData.department);
          setDoctors(data);
        } catch (err) {
          showToast("Could not fetch doctors for the selected department.", "danger");
        } finally {
          setDoctorsLoading(false);
        }
      };
      fetchDoctors();
    }
  }, [formData.department]);

  // Fetch time slots when doctor or date changes
  useEffect(() => {
    if (formData.doctor && formData.appointmentDate) {
      const fetchAvailability = async () => {
        setSlotsLoading(true);
        setTimeSlots([]);
        setFormData(prev => ({ ...prev, appointmentTime: '' }));
        try {
          const { data } = await getDoctorAvailability(formData.doctor, formData.appointmentDate);
          setTimeSlots(data);
        } catch (err) {
          showToast("Could not fetch time slots.", "danger");
        } finally {
          setSlotsLoading(false);
        }
      };
      fetchAvailability();
    }
  }, [formData.doctor, formData.appointmentDate]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAppointment(formData);
      showToast('Appointment booked successfully!');
      setFormData({ department: '', doctor: '', appointmentDate: '', appointmentTime: '', reason: '' });
      setTimeSlots([]);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to book appointment.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-appointment-page">
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide bg={toast.type}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="form-container modern-form">
        <div className="form-header">
          <h2>Book a New Appointment</h2>
          <p>Fill the form below to schedule an appointment.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <fieldset className="form-step">
            <legend>Step 1: Choose Department & Doctor</legend>
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((dept) => (<option key={dept._id} value={dept.name}>{dept.name}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label>Doctor</label>
              <select name="doctor" value={formData.doctor} onChange={handleChange} required disabled={!formData.department || doctorsLoading}>
                <option value="">{doctorsLoading ? 'Loading...' : 'Select Doctor'}</option>
                {doctors.map((doc) => (<option key={doc._id} value={doc._id}>Dr. {doc.firstName} {doc.lastName}</option>))}
              </select>
            </div>
          </fieldset>

          <fieldset className="form-step" disabled={!formData.doctor}>
            <legend>Step 2: Select Date & Time</legend>
            <div className="form-group">
              <label>Appointment Date</label>
              <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required />
            </div>
            {formData.doctor && formData.appointmentDate && (
              <div className="form-group">
                <label>Available Time Slots</label>
                {slotsLoading ? (<div className="text-center p-3"><Spinner animation="border" size="sm" /> Loading slots...</div>) : (
                  <div className="time-slots-container">
                    {timeSlots.length > 0 ? (
                      timeSlots.map((slot) => (
                        <button type="button" key={slot} name="appointmentTime" value={slot} onClick={handleChange} className={`time-slot-btn ${formData.appointmentTime === slot ? 'selected' : ''}`}>{slot}</button>
                      ))
                    ) : (<p className="no-slots-msg">No available slots for this date.</p>)}
                  </div>
                )}
                <input type="hidden" name="appointmentTime" value={formData.appointmentTime} required />
              </div>
            )}
          </fieldset>

          <fieldset className="form-step" disabled={!formData.appointmentTime}>
            <legend>Step 3: Reason & Confirmation</legend>
            <div className="form-group">
              <label>Reason for Appointment</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} required placeholder="Briefly describe your reason for the visit..." />
            </div>
            <button type="submit" className="btn-submit" disabled={loading || !formData.reason}>
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;

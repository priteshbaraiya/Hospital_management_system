import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorCard.css'; // Styling के लिए CSS फ़ाइल

const DoctorCard = ({ doctorId, name, specialization, photo }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    // डॉक्टर ID के साथ बुकिंग पेज पर नेविगेट करें
    navigate(`/patient-panel/book-appointment`, { state: { doctorId: doctorId } });
  };

  return (
    <div className="doctor-card">
      {photo && <img src={photo} alt={name} className="doctor-photo" />}
      <div className="doctor-info">
        <h4>{name}</h4>
        <p>{specialization}</p>
      </div>
      <button onClick={handleBookAppointment} className="book-appointment-btn">
        Book Appointment
      </button>
    </div>
  );
};

export default DoctorCard;
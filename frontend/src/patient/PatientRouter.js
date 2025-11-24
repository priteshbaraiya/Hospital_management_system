import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientProfile from '../pages/patient/PatientProfile';
import MyAppointments from '../pages/patient/MyAppointments';
import BookAppointment from '../pages/patient/BookAppointment';

const PatientRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="profile" element={<PatientProfile />} />
      <Route path="appointments" element={<MyAppointments />} />
      <Route path="book-appointment" element={<BookAppointment />} />
    </Routes>
  );
};

export default PatientRouter;

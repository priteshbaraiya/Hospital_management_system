import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import Appointment from "./pages/Appointment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientPanel from "./pages/PatientPanel";
import DoctorPanel from "./pages/DoctorPanel";
import ContactUs from "./pages/ContactUs";
import AdminRoute from "./admin/AdminRoute";
import AdminRouter from "./admin/AdminRouter";
import PatientRouter from "./patient/PatientRouter";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Protected Routes */}
        <Route path="/patient-panel/*" element={<PatientPanel />}>
          <Route path="*" element={<PatientRouter />} />
        </Route>
        <Route path="/doctor-panel" element={<DoctorPanel />} />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/*" element={<AdminRouter />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;

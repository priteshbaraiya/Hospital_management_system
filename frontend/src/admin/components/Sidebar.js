import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { adminLogout } from '../../api/api';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminLogout();
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="sidebar-container bg-dark text-white">
      <h3 className="text-center p-3">Admin Panel</h3>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/admin/dashboard" className="nav-link text-white">
            <i className="fas fa-tachometer-alt me-2"></i>Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/doctors" className="nav-link text-white">
            <i className="fas fa-user-md me-2"></i>Manage Doctors
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/patients" className="nav-link text-white">
            <i className="fas fa-user-injured me-2"></i>Manage Patients
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/departments" className="nav-link text-white">
            <i className="fas fa-building me-2"></i>Manage Departments
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/appointments" className="nav-link text-white">
            <i className="fas fa-calendar-check me-2"></i>Appointments
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/settings" className="nav-link text-white">
            <i className="fas fa-cog me-2"></i>System Settings
          </NavLink>
        </li>
      </ul>
      <div className="mt-auto p-3">
        <button className="btn btn-danger w-100" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2"></i>Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

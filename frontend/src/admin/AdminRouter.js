import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import ManageDoctors from './pages/ManageDoctors';
// Import other admin pages here as they are created
import ManagePatients from './pages/ManagePatients';
import ManageDepartments from './pages/ManageDepartments';
import ManageAppointments from './pages/ManageAppointments';
import SystemSettings from './pages/SystemSettings';

const AdminRouter = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="doctors" element={<ManageDoctors />} />
        <Route path="patients" element={<ManagePatients />} />
        <Route path="departments" element={<ManageDepartments />} />
        <Route path="appointments" element={<ManageAppointments />} />
        <Route path="settings" element={<SystemSettings />} />
        
        {/* Default route for /admin */}
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const getUserFromLocalStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    return null;
  };

  const user = getUserFromLocalStorage();

  // The user object from login has a nested 'user' object for patient/doctor roles
  // but for admin, the role is added at the top level of the stored object.
  // Let's check for both structures for robustness.
  const isAdmin = user && (user.role === 'admin' || (user.user && user.user.role === 'admin'));

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;

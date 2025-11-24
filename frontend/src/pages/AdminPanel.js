import { useEffect, useState } from "react";
import { NavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import "./AdminPanel.css"; // Import the CSS file

const AdminPanel = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
      if (updatedUser?.role !== "admin") {
        navigate("/login");
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Initial check
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser?.role !== "admin") {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    // Redirect to dashboard if on the base admin path
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/dashboard', { replace: true });
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>Welcome, {user?.name || 'Admin'}</p>
        </div>
        <nav className="admin-nav">
          <NavLink to="dashboard" className="admin-nav-link">Dashboard</NavLink>
          <NavLink to="appointments" className="admin-nav-link">Appointments</NavLink>
          <NavLink to="doctors" className="admin-nav-link">Manage Doctors</NavLink>
          <NavLink to="patients" className="admin-nav-link">Manage Patients</NavLink>
          <NavLink to="departments" className="admin-nav-link">Departments</NavLink>
          <NavLink to="settings" className="admin-nav-link">System Settings</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <span></span><span></span><span></span>
          </button>
        </header>
        <div className="admin-content">
          <Outlet /> {/* Nested routes will render here */}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
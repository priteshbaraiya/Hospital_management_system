import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import { getPatientProfile } from "../api/api";
import "./PatientPanel.css"; // CSS for styling

const PatientPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setUser(null);
        navigate("/login");
      } else {
        setUser(JSON.parse(storedUser));
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser?.role !== "patient") {
      navigate("/login");
      return;
    }
  
    if (location.pathname === '/patient-panel') {
      navigate('/patient-panel/dashboard', { replace: true });
    }
  
    // Fetch fresh profile data to ensure the name is up-to-date
    const fetchProfile = async () => {
      try {
        const { data } = await getPatientProfile();
        // Update state and localStorage with the latest name
        const updatedUser = { ...currentUser, name: data.firstName };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Could not fetch latest profile data", error);
        // If profile fetch fails (e.g., token expired), log out
        handleLogout();
      }
    };
  
    fetchProfile();
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="patient-layout">
      <aside className="patient-sidebar">
        <div className="patient-sidebar-header">
          <h2>Welcome, {user?.name}</h2>
        </div>
        <nav className="patient-nav">
          <NavLink to="dashboard" className="patient-nav-link">Dashboard</NavLink>
          <NavLink to="profile" className="patient-nav-link">My Profile</NavLink>
          <NavLink to="appointments" className="patient-nav-link">My Appointments</NavLink>
          <NavLink to="book-appointment" className="patient-nav-link">Book Appointment</NavLink>
        </nav>
        <div className="patient-sidebar-footer">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </aside>

      <main className="patient-main">
        <div className="patient-content">
          <Outlet /> {/* Nested routes will render here */}
        </div>
      </main>
    </div>
  );
};

export default PatientPanel;
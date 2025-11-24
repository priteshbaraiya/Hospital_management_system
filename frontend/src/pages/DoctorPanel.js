import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import { getDoctorAppointments, updateAppointmentStatus } from "../api/api";
import "./DoctorPanel.css";

const DoctorPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  // const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
      if (updatedUser?.role !== "doctor") {
        navigate("/login");
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser?.role !== "doctor") {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  return (
    <>
      <Navbar />
      <section className="panel doctor-panel">
        <h2>Doctor Dashboard</h2>
        <div className="panel-content">
          <h3>Welcome, Dr. {user?.name}!</h3>
          <p>Your appointments are managed by the admin.</p>
          {/* Appointments table has been removed from this view. */}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default DoctorPanel;

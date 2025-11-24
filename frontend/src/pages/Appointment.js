import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createAppointment } from "../api/api";

const Appointment = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", birthdate: "",
    street1: "", street2: "", city: "", region: "", pincode: "", email: ""
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAppointment(form);
      alert("Appointment submitted successfully!");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <section style={{ minHeight: "90vh", background: "#fff" }}>
        <h2
          style={{
            textAlign: "center",
            marginTop: "72px", // Increased space from top
            fontWeight: 700
          }}
        >
          Book Appointment
        </h2>
        <div
          style={{
            maxWidth: 500,
            margin: "32px auto 0 auto",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: "32px 24px"
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <input
                style={{ flex: 1 }}
                placeholder="First Name"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                required
              />
              <input
                style={{ flex: 1 }}
                placeholder="Last Name"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <input
                style={{ width: "100%" }}
                placeholder="Address Line 1"
                value={form.street1}
                onChange={e => setForm({ ...form, street1: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <input
                style={{ width: "100%" }}
                placeholder="Address Line 2"
                value={form.street2}
                onChange={e => setForm({ ...form, street2: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <input
                style={{ flex: 1 }}
                placeholder="Mobile No"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />
              <input
                style={{ flex: 1 }}
                type="date"
                placeholder="Birthdate"
                value={form.birthdate}
                onChange={e => setForm({ ...form, birthdate: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <input
                style={{ width: "100%" }}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <input
                style={{ flex: 1 }}
                placeholder="City"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                required
              />
              <input
                style={{ flex: 1 }}
                placeholder="State/Region"
                value={form.region}
                onChange={e => setForm({ ...form, region: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <input
                style={{ width: "100%" }}
                placeholder="Pincode"
                value={form.pincode}
                onChange={e => setForm({ ...form, pincode: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#0d6efd",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "10px 0",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer"
              }}
            >
              Book Now
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Appointment;

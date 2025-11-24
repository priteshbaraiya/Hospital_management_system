import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { registerPatient } from "../api/api";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    address: {
      street1: "",
      street2: "",
      city: "",
      region: "",
      pincode: "",
    },
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword || !form.phone || !form.gender) return "Please fill all required fields";
    if (!emailRegex.test(form.email)) return "Please enter a valid email";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { alert(err); return; }
    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      await registerPatient(payload);
      alert("Sign up successful! Please log in.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <section className="register-page">
        <h2>Create Account</h2>
        <div className="auth-card">
          <form onSubmit={handleSubmit}>
            <div className="auth-grid">
              <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
              <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
              <input name="address.street1" placeholder="Address Line 1" value={form.address.street1} onChange={handleChange} required className="full" />
              <input name="address.street2" placeholder="Address Line 2" value={form.address.street2} onChange={handleChange} className="full" />
              <input name="phone" placeholder="Mobile No" value={form.phone} onChange={handleChange} required />
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="full" />
              <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
              <input name="address.city" placeholder="City" value={form.address.city} onChange={handleChange} />
              <input name="address.region" placeholder="State/Region" value={form.address.region} onChange={handleChange} />
              <input name="address.pincode" placeholder="Pincode" value={form.address.pincode} onChange={handleChange} />
            </div>
            <div className="auth-actions center column">
              <button type="submit" className="btn-primary">Sign Up</button>
              <div className="auth-note">Already have an account? <a className="link" href="/login">Login</a></div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;

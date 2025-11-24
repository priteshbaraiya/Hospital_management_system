import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import * as api from "../api/api";

const Login = () => {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Example login submit handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }
    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    try {
      let res;
      if (role === "patient") res = await api.loginPatient({ email, password });
      if (role === "admin") res = await api.loginAdmin({ email, password });

      alert("Login successful!");
      // Ensure consistent user object structure
      const userData = { ...res.data, role };
      localStorage.setItem("user", JSON.stringify(userData));

      if (role === "patient") navigate("/patient-panel");
      if (role === "admin") navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <>
      <Navbar loginPage={true} />
      <section className="login-page">
        <h2>Login</h2>
        <div className="auth-card">
          <form onSubmit={handleLogin}>
            <div className="auth-grid full">
              <select value={role} onChange={(e) => setRole(e.target.value)} className="full">
                <option value="patient">Patient</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="full"
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="full"
              />
            </div>
            <div className="auth-actions center column">
              <button type="submit" className="btn-primary">Login</button>
              <div className="auth-note">Don't have an account? <Link className="link" to="/register">Sign Up</Link></div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;

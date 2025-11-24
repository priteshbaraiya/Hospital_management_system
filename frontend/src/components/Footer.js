import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4>About Our Hospital</h4>
          <p>
            We are committed to providing the highest quality healthcare services with modern
            facilities, advanced technology, and a dedicated team of doctors and nurses available 24/7.
          </p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Service</Link></li>
            <li><Link to="/doctors">Doctor</Link></li>
            <li><Link to="/appointment">Appointments</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Our Services</h4>
          <ul>
            <li>Emergency Department</li>
            <li>Pediatric</li>
            <li>General Physician</li>
            <li>Neurology</li>
            <li>Cardiology</li>
            <li>Orthopedic</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p><strong>Address:</strong> 123 Health Street, City, India</p>
          <p><strong>Phone:</strong> +91 9876543210</p>
          <p><strong>Email:</strong> support@hospital.com</p>
        </div>
      </div>
      <div className="footer-bottom">© 2025 Hospital | All Rights Reserved</div>
    </footer>
  );
};

export default Footer;

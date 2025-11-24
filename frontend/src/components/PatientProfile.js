import { useState, useEffect } from "react";
import { getPatientProfile, updatePatientProfile } from "../api/api";
import "./Form.css"; // Common form styles

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getPatientProfile();
        setFormData(data);
      } catch (error) {
        setMessage("Could not fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: updatedPatient } = await updatePatientProfile(formData);
      setMessage("Profile updated successfully!");

      // Update user's name in localStorage so it reflects in the sidebar
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        localStorage.setItem("user", JSON.stringify({ ...user, name: updatedPatient.firstName }));
      }
    } catch (error) {
      setMessage("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="form-container">
      <h2>My Profile</h2>
      <p>View and update your personal information.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} readOnly />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea name="address" value={formData.address || ""} onChange={handleChange}></textarea>
        </div>
        <button type="submit" className="btn-submit">Update Profile</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PatientProfile;
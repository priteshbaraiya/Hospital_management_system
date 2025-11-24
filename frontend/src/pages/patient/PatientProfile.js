import React, { useState, useEffect } from 'react';
import { getPatientProfile, updatePatientPassword } from '../../api/api';
import '../../components/Form.css'; // Reusing common form styles
import './PatientProfile.css'; // Import specific styles

const PatientProfile = () => {
  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePhoto: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getPatientProfile();
        setPatient(data);
      } catch (err) {
        setError('Could not fetch profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('New passwords do not match.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Add confirmation dialog before submitting
    if (window.confirm('Are you sure you want to change your password?')) {
      try {
        const { oldPassword, newPassword } = passwordData;
        await updatePatientPassword({ oldPassword, newPassword });
        setMessage('Password updated successfully!');
        setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear fields
        
        // Hide the success message after 3 seconds
        setTimeout(() => {
            setMessage('');
        }, 3000);

      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update password.';
        setError(errorMessage);
        
        // Hide the error message after 3 seconds
        setTimeout(() => {
            setError('');
        }, 3000);
        console.error(err);
      }
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="form-container">
      {/* Display messages at the top */}
      {message && <p className="profile-message success">{message}</p>}
      {error && <p className="profile-message error">{error}</p>}

      <h2>My Profile</h2>      
      <form onSubmit={handlePasswordSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" value={patient.firstName} readOnly />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" value={patient.lastName} readOnly />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={patient.email} readOnly />
        </div>

        <hr />
        <h4>Change Password</h4>
        <div className="form-group"><label>Old Password</label><input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handleChange} required /></div>
        <div className="form-group"><label>New Password</label><input type="password" name="newPassword" value={passwordData.newPassword} onChange={handleChange} required /></div>
        <div className="form-group"><label>Confirm New Password</label><input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handleChange} required /></div>
        
        <button type="submit" className="btn-submit">Update Password</button>
      </form>
      {/* Old message location removed from here */}
    </div>
  );
};

export default PatientProfile;
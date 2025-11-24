import React, { useState, useEffect } from 'react';
import * as api from '../../api/api';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    hospitalName: '',
    address: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.getSystemSettings();
      setSettings(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch system settings');
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateSystemSettings(settings);
      alert('Settings updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update settings');
    }
  };

  return (
    <div>
      <h2 className="mb-4">System Settings</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Hospital Name</label>
          <input type="text" className="form-control" name="hospitalName" value={settings.hospitalName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input type="text" className="form-control" name="address" value={settings.address} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input type="text" className="form-control" name="phone" value={settings.phone} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={settings.email} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Save Settings</button>
      </form>
    </div>
  );
};

export default SystemSettings;

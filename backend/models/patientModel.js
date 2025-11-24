const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  birthdate: String,
  address: {
    street1: String,
    street2: String,
    city: String,
    region: String,
    pincode: String,
  },
  role: { type: String, enum: ['patient', 'admin'], default: 'patient' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

module.exports = mongoose.model("Patient", patientSchema);

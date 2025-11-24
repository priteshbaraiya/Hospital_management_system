const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  specialization: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: String,
  contact: String,
  department: String,
  timings: String,
  role: { type: String, enum: ['doctor', 'admin'], default: 'doctor' },
});

module.exports = mongoose.model("Doctor", doctorSchema);

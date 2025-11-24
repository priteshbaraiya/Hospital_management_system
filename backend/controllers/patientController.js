const Patient = require("../models/patientModel");
const Appointment = require("../models/appointmentModel"); // Assuming you have this model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register Patient
const registerPatient = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const exists = await Patient.findOne({ email });
    if (exists) return res.status(400).json({ message: "Patient already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const patient = await Patient.create({ firstName, lastName, email, password: hashedPassword });
    res.status(201).json({
      _id: patient._id,
      name: patient.firstName,
      email: patient.email,
      role: "patient",
      token: generateToken(patient._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login Patient
const loginPatient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.findOne({ email });
    if (patient && (await bcrypt.compare(password, patient.password))) {
      res.json({
        _id: patient._id,
        name: patient.firstName,
        email: patient.email,
        role: "patient",
        token: generateToken(patient._id)
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private
const getPatientProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const patient = await Patient.findById(req.user._id).select('-password');

    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update patient profile (non-password fields)
// @route   PUT /api/patients/profile
// @access  Private
const updatePatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id);

    if (patient) {
      patient.firstName = req.body.firstName || patient.firstName;
      patient.lastName = req.body.lastName || patient.lastName;
      patient.phone = req.body.phone || patient.phone;
      patient.birthdate = req.body.birthdate || patient.birthdate;
      patient.address = req.body.address || patient.address;

      const updatedPatient = await patient.save();
      res.json({
        _id: updatedPatient._id,
        firstName: updatedPatient.firstName,
        lastName: updatedPatient.lastName,
        email: updatedPatient.email,
        // ... other fields you want to return
      });
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete patient profile
// @route   DELETE /api/patients/profile
// @access  Private
const deletePatientProfile = async (req, res) => {
  const { password } = req.body;

  try {
    const patient = await Patient.findById(req.user._id);

    if (patient && (await bcrypt.compare(password, patient.password))) {
      await patient.remove();
      res.json({ message: "Patient profile deleted successfully" });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update patient password
// @route   PUT /api/patients/password
// @access  Private
const updatePatientPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const patient = await Patient.findById(req.user._id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (patient && (await bcrypt.compare(oldPassword, patient.password))) {
      const salt = await bcrypt.genSalt(10);
      patient.password = await bcrypt.hash(newPassword, salt);
      await patient.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid old password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update patient profile photo
// @route   PUT /api/patients/profile/photo
// @access  Private
const updatePatientPhoto = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id);

    if (patient) {
      // req.file is available due to multer middleware
      patient.profilePhoto = `/uploads/${req.file.filename}`;
      const updatedPatient = await patient.save();
      res.json({
        message: "Photo updated successfully",
        profilePhoto: updatedPatient.profilePhoto,
      });
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { registerPatient, loginPatient, getPatientProfile, updatePatientProfile, deletePatientProfile, updatePatientPassword, updatePatientPhoto };

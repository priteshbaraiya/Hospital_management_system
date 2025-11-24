const Doctor = require("../models/doctorModel");
const Department = require("../models/departmentModel");
const Appointment = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Auth doctor & get token
// @route   POST /api/doctors/login
// @access  Public
const loginDoctor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.findOne({ email });
    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      res.json({
        _id: doctor._id,
        name: doctor.firstName,
        email: doctor.email,
        role: "doctor",
        token: generateToken(doctor._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  const { department: departmentName } = req.query;
  try {
    let filter = {};
    if (departmentName) {
      // The Doctor model stores the department name as a string, so we filter directly on that.
      filter.department = departmentName;
    }
    const doctors = await Doctor.find(filter).select("-password");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
  const { firstName, lastName, email, password, specialization, contact, department } = req.body;
  try {
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await Doctor.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      specialization,
      contact,
      department,
    });

    res.status(201).json({
        _id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      doctor.firstName = req.body.firstName || doctor.firstName;
      doctor.lastName = req.body.lastName || doctor.lastName;
      doctor.email = req.body.email || doctor.email;
      doctor.specialization = req.body.specialization || doctor.specialization;
      doctor.contact = req.body.contact || doctor.contact;
      doctor.department = req.body.department || doctor.department;
      
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        doctor.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedDoctor = await doctor.save();
      res.json(updatedDoctor);
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({ message: "Doctor removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update doctor password
// @route   PUT /api/doctors/password
// @access  Private (Doctor)
const updateDoctorPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const doctor = await Doctor.findById(req.user._id);

    if (doctor && (await bcrypt.compare(oldPassword, doctor.password))) {
      const salt = await bcrypt.genSalt(10);
      doctor.password = await bcrypt.hash(newPassword, salt);
      await doctor.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid old password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get available time slots for a doctor on a specific date
// @route   GET /api/doctors/:id/availability?date=YYYY-MM-DD
// @access  Private
const getDoctorAvailability = async (req, res) => {
  // This function's logic can remain the same
  const { date } = req.query;
  const { id: doctorId } = req.params;

  if (!date) {
    return res.status(400).json({ message: "Date query parameter is required" });
  }

  try {
    const workingHours = { start: 9, end: 17 }; 
    const slotDuration = 30; 

    const allSlots = [];
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      allSlots.push(`${String(hour).padStart(2, '0')}:00`);
      allSlots.push(`${String(hour).padStart(2, '0')}:${slotDuration}`);
    }

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const bookedSlots = existingAppointments.map(apt => {
      const d = new Date(apt.appointmentDate);
      return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
    });

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get appointments for a doctor
// @route   GET /api/doctors/:id/appointments
// @access  Private (Doctor)
const getDoctorAppointments = async (req, res) => {
  try {
    // The doctor's ID should come from req.user._id if they are logged in.
    // The route is /:id/appointments, so we should use req.params.id,
    // but ensure the logged-in user is the one requesting it.
    if (req.user._id.toString() !== req.params.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const appointments = await Appointment.find({ doctor: req.params.id }).populate(
      "patient",
      "firstName lastName email"
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  loginDoctor,
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAvailability,
  updateDoctorPassword,
  getDoctorAppointments,
};

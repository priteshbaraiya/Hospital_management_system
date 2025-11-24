const Appointment = require("../models/appointmentModel");

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const createAppointment = async (req, res) => {
  const { doctor, department, appointmentDate, appointmentTime, reason } = req.body;

  if (!doctor || !department || !appointmentDate || !appointmentTime || !reason) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // Combine date and time
    const fullAppointmentDate = new Date(`${appointmentDate}T${appointmentTime}:00`);

    const appointment = new Appointment({
      patient: req.user._id, // from 'protect' middleware
      doctor,
      department, // department name as string
      appointmentDate: fullAppointmentDate,
      reason,
      status: 'pending', // Explicitly set default status
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get appointments for logged in patient
// @route   GET /api/appointments/my
// @access  Private (Patient)
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id }).populate(
      "doctor",
      "firstName lastName specialization"
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Get all appointments (for Admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).populate('doctor', 'firstName lastName').populate('patient', 'firstName lastName');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update appointment status (for Admin/Doctor)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin or Private/Doctor
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // It's good practice to keep the source of truth for statuses in one place,
    // but for a quick fix, we'll manage it here.
    const validStatuses = ["pending", "approved", "cancelled", "completed"];

    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      // Ensure the status is lowercase to match the enum values like 'approved', 'pending'
      appointment.status = status.toLowerCase().trim(); // Trim whitespace and set to lowercase
      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an appointment (for Patient)
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient)
const cancelMyAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ensure the appointment belongs to the logged-in patient
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to cancel this appointment" });
    }

    // Prevent cancellation of already completed or cancelled appointments
    if (["completed", "cancelled"].includes(appointment.status)) {
      return res
        .status(400)
        .json({ message: `Cannot cancel an appointment that is already ${appointment.status}` });
    }

    appointment.status = "cancelled";
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createAppointment, getMyAppointments, getAllAppointments, updateAppointmentStatus, cancelMyAppointment };
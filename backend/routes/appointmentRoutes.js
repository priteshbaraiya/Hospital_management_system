const express = require("express");
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelMyAppointment,
} = require("../controllers/appointmentController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   /api/appointments

// Patient routes
router.route("/").post(protect, createAppointment);
router.route("/my").get(protect, getMyAppointments);
router.route("/:id/cancel").put(protect, cancelMyAppointment); // Patient can cancel their own appointment

// Admin routes
router.route("/all").get(protect, admin, getAllAppointments);
router.route("/:id/status").put(protect, admin, updateAppointmentStatus); // Only Admin can change status

module.exports = router;
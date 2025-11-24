const express = require("express");
const router = express.Router();
const {
  loginDoctor,
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAvailability,
  getDoctorAppointments,
  updateDoctorPassword,
} = require("../controllers/doctorController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", loginDoctor);
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/availability", getDoctorAvailability); // Should this be protected?

// Admin only routes
router.post("/", protect, admin, createDoctor);
router.put("/:id", protect, admin, updateDoctor);
router.delete("/:id", protect, admin, deleteDoctor);

// Protected routes (for logged-in users, e.g., doctors themselves)
router.get("/:id/appointments", protect, getDoctorAppointments);
router.put("/password", protect, updateDoctorPassword);

module.exports = router;

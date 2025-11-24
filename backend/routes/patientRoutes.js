const express = require("express");
const {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
  updatePatientPassword,
  deletePatientProfile,
  updatePatientPhoto,
} = require("../controllers/patientController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.route("/profile").get(protect, getPatientProfile).put(protect, updatePatientProfile).delete(protect, deletePatientProfile);
router.put('/profile/photo', protect, upload.single('profilePhoto'), updatePatientPhoto);
router.put('/password', protect, updatePatientPassword);

module.exports = router;

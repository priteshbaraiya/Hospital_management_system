const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/systemSettingController");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   /api/settings

// Public route to get settings
router.get("/", getSettings);

// Admin route to update settings
router.put("/", protect, admin, updateSettings);

module.exports = router;

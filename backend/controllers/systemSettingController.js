const SystemSetting = require("../models/systemSettingModel");

// @desc    Get hospital settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.findOne();
    if (!settings) {
      // If no settings exist yet, return default/empty values
      return res.json({
        hospitalName: "",
        address: "",
        phone: "",
        email: "",
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update hospital settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { hospitalName, address, phone, email } = req.body;

    const settings = await SystemSetting.findOneAndUpdate(
      {},
      { hospitalName, address, phone, email },
      {
        new: true,
        upsert: true, // Create a new document if one doesn't exist
        setDefaultsOnInsert: true
      }
    );

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getSettings, updateSettings };

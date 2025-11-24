const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  // There should only ever be one document in this collection
  capped: { size: 1024, max: 1 },
});

module.exports = mongoose.model("SystemSetting", systemSettingSchema);

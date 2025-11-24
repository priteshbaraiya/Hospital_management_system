const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        role: "admin",
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new admin
const addAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ name, email, password: hashedPassword });
    return res.status(201).json({ _id: admin._id, name: admin.name, token: generateToken(admin._id) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get all admins
const getAllAdmins = async (_req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    return res.json(admins);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const logoutAdmin = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { loginAdmin, addAdmin, getAllAdmins, logoutAdmin };

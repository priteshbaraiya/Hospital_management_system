const Contact = require("../models/contactModel");

const createContact = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const doc = await Contact.create({ name, phone, email, subject, message });
    return res.status(201).json({ message: "Message received", contact: doc });
  } catch (err) {
    console.error("Failed to save contact", err);
    return res.status(500).json({ message: "Failed to save contact" });
  }
};

module.exports = {
    createContact,
};

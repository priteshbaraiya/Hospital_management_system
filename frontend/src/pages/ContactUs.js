import React, { useState } from "react";
import Navbar from "../components/Navbar";
import contactImage from "../assets/contect.jpg";
import { createContact } from "../api/api";

const ContactUs = () => {
  const [contact, setContact] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createContact(contact);
      alert("Message sent successfully");
      setContact({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <h2 style={{ textAlign: "center", margin: "0 0 16px 0", fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 700 }}>Contact Us</h2>
        <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 4px 22px rgba(0,0,0,0.08)", padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 520px) 1fr", gap: 20, alignItems: "start" }}>
            <img src={contactImage} alt="Contact" style={{ width: "100%", height: "auto", borderRadius: 6, display: "block" }} />
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: "unset", margin: 0, width: "100%" }}>
              <input name="name" placeholder="Name" value={contact.name} onChange={onChange} required style={{ padding: 10, width: "100%" }} />
              <input name="phone" placeholder="Phone" value={contact.phone} onChange={onChange} required style={{ padding: 10, width: "100%" }} />
              <input type="email" name="email" placeholder="Email" value={contact.email} onChange={onChange} required style={{ padding: 10, width: "100%" }} />
              <input name="subject" placeholder="Subject" value={contact.subject} onChange={onChange} required style={{ padding: 10, width: "100%" }} />
              <textarea name="message" placeholder="Your Message" rows={6} value={contact.message} onChange={onChange} required style={{ padding: 10, width: "100%" }} />
              <div style={{ color: "#c00", fontSize: 12 }}>Note: All fields are compulsory</div>
              <button type="submit" disabled={submitting} style={{ padding: 14, background: "#2f6f6b", color: "#fff", border: "none", cursor: "pointer", width: "100%" }}>{submitting ? "Sending..." : "Send Message"}</button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactUs;



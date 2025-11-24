import { useState, useEffect } from "react";
import { getAllDoctors, bookAppointment, getDoctorAvailability } from "../api/api";
import "./Form.css";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // To handle submission state
  const [error, setError] = useState(""); // To handle error messages

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await getAllDoctors();
        setDoctors(data);
        setError("");
      } catch (error) {
        console.error("Could not fetch doctors", error);
        setError("Could not load doctor list. Please try again later.");
      }
    };
    fetchDoctors();
  }, []);

  // Effect to fetch time slots when doctor or date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (formData.doctor && formData.appointmentDate) {
        setSlotsLoading(true);
        setTimeSlots([]);
        try {
          const { data } = await getDoctorAvailability(formData.doctor, formData.appointmentDate);
          setTimeSlots(data);
        } catch (err) {
          setError("Could not fetch time slots.");
        } finally {
          setSlotsLoading(false);
        }
      }
    };
    fetchAvailability();
  }, [formData.doctor, formData.appointmentDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      appointmentTime: name === "doctor" || name === "appointmentDate" ? "" : prev.appointmentTime,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await bookAppointment(formData);
      setMessage("Appointment booked successfully!");
      setFormData({ doctor: "", appointmentDate: "", appointmentTime: "", reason: "" }); // Reset form
    } catch (error) {
      setError(error.response?.data?.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Book a New Appointment</h2>
      <p>Fill the form below to schedule an appointment.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Doctor</label>
          <select name="doctor" value={formData.doctor} onChange={handleChange} required>
            <option value="">-- Choose a Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.firstName} {doc.lastName} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Appointment Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        {formData.doctor && formData.appointmentDate && (
          <div className="form-group">
            <label>Select Time Slot</label>
            {slotsLoading ? (
              <p>Loading slots...</p>
            ) : (
              <div className="time-slots-container">
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => (
                    <button type="button" key={slot} name="appointmentTime" value={slot} onClick={handleChange} className={`time-slot-btn ${formData.appointmentTime === slot ? 'selected' : ''}`}>{slot}</button>
                  ))
                ) : ( <p>No available slots for this date.</p> )}
              </div>
            )}
            <input type="hidden" name="appointmentTime" value={formData.appointmentTime} required />
          </div>
        )}
        <div className="form-group">
          <label>Reason for Appointment</label>
          <textarea name="reason" value={formData.reason} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default BookAppointment;
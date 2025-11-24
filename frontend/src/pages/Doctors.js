import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DoctorCard from "../components/DoctorCard";

import d0 from "../assets/d0.jpg";
import d1 from "../assets/d1.jpg";
import d2 from "../assets/d2.jpg";
import d3 from "../assets/d3.jpg";
import d4 from "../assets/d4.jpg";
import d5 from "../assets/d5.jpg";

const Doctors = () => {
  const doctors = [
    { name: "Dr. Rajesh Sharma", specialization: "Cardiologist", photo: d0 },
    { name: "Dr. Amit Kumar", specialization: "Cardiologist", photo: d1 },
    { name: "Dr. Arjun Verma", specialization: "General Physician", photo: d2 },
    { name: "Dr. Rohan Mehta", specialization: "Neurologist", photo: d3 },
    { name: "Dr. Sandeep Singh", specialization: "Pediatrician", photo: d4 },
    { name: "Dr. Vivek Patel", specialization: "Orthopedic", photo: d5 },
  ];
  
  return (
    <>
      <Navbar />
      <section className="doctors-page">
        <h2 className="section-title center bold">Our Doctors</h2>
        <div className="doctor-cards three-col">
          {doctors.map((d, i) => (
            <DoctorCard key={i} name={d.name} specialization={d.specialization} photo={d.photo} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Doctors;

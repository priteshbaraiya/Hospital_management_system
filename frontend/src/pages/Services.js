import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";

import diagnosticsImg from "../assets/Diagnostics.jpg";
import emergencyImg from "../assets/Emergency and General Care.jpg";
import specializedImg from "../assets/SpecializedTreatments.jpg";
import surgicalImg from "../assets/SurgicalProcedures.jpg";

const Services = () => {
  const services = [
    { title: "Emergency Care", description: "24/7 emergency services.", image: emergencyImg },
    { title: "Cardiology", description: "Specialized heart care.", image: specializedImg },
    { title: "Orthopedics", description: "Bone and joint treatments.", image: surgicalImg },
    { title: "Diagnostics", description: "Lab and imaging tests.", image: diagnosticsImg },
    { title: "Surgery", description: "Safe surgical procedures.", image: surgicalImg },
  ];

  return (
    <>
      <Navbar />
      <section className="services-page">
        <h2 className="section-title center bold">Services</h2>
        <div className="service-cards">
          {services.map((s, i) => (
            <ServiceCard key={i} title={s.title} description={s.description} image={s.image} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Services;

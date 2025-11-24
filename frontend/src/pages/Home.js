import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

import diagnosticsImg from "../assets/Diagnostics.jpg";
import emergencyImg from "../assets/Emergency and General Care.jpg";
import specializedImg from "../assets/SpecializedTreatments.jpg";
import surgicalImg from "../assets/SurgicalProcedures.jpg";

const Home = () => {
  const services = [
    {
      title: "Emergency & General Care",
      description: "Round-the-clock emergency and urgent care services.",
      image: emergencyImg,
    },
    {
      title: "Diagnostics",
      description: "Accurate lab testing and advanced imaging.",
      image: diagnosticsImg,
    },
    {
      title: "Specialized Treatments",
      description: "Expert care across cardiology, neuro, ortho and more.",
      image: specializedImg,
    },
    {
      title: "Surgical Procedures",
      description: "Safe, modern OT with experienced surgeons.",
      image: surgicalImg,
    },
  ];

  const features = [
    { title: "Experienced Doctors", text: "Board-certified specialists across departments." },
    { title: "Modern Facilities", text: "State-of-the-art technology and equipment." },
    { title: "Patient-Centered", text: "Compassionate care tailored to your needs." },
  ];

  const stats = [
    { label: "Patients Served", value: "50K+" },
    { label: "Doctors", value: "120+" },
    { label: "Departments", value: "25+" },
    { label: "Years of Care", value: "15+" },
  ];

  const testimonials = [
    { name: "Ravi Kumar", quote: "Staff were kind and professional. Highly recommend!" },
    { name: "Anita Sharma", quote: "Quick diagnosis and excellent treatment plan." },
  ];

  return (
    <>
      <Navbar />
      <Hero />

      <section className="home-intro">
        <div className="container">
          <h2>Comprehensive Care, Trusted by Thousands</h2>
          <p>
            From emergency care to specialized treatments, we deliver high-quality healthcare
            with compassion and expertise.
          </p>
          <div className="feature-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {services.map((s, i) => (
              <article key={i} className="service-item">
                <div className="service-image-wrap">
                  <img src={s.image} alt={s.title} />
                </div>
                <div className="service-content">
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="container stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-testimonials">
        <div className="container testimonial-grid">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="testimonial">
              <p>“{t.quote}”</p>
              <footer>— {t.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;

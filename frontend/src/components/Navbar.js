import { NavLink, useNavigate } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/LOGO.jpg";

const Navbar = ({ loginPage }) => {
  const navigate = useNavigate();

  // Appointment link click handler
  const handleAppointmentClick = (e) => {
    const user = localStorage.getItem("user");
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
    // else allow navigation
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={NavLink} to="/">
          <img
            src={logo}
            width="36"
            height="36"
            className="d-inline-block align-top rounded"
            alt="Hospital Logo"
          />
          <span className="ms-2">Hospital</span>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {loginPage ? (
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                <Nav.Link as={NavLink} to="/doctors">Doctor</Nav.Link>
                <Nav.Link as={NavLink} to="/services">Service</Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/appointment"
                  onClick={handleAppointmentClick}
                >
                  Appointment
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
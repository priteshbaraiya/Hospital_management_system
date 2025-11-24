import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import heroImage from "../assets/HERO.jpg";

const Hero = () => {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
    height: '80vh',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: 'white'
  };

  return (
    <div style={heroStyle}>
      <Container>
        <Row>
          <Col md={8} className="mx-auto text-center">
            <h1 className="display-4 fw-bold">Welcome to Our Hospital</h1>
            <p className="lead fw-normal">We provide world-class medical care for all patients.</p>
            <Button as={Link} to="/appointment" variant="light" size="lg">
              Make Appointment
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;
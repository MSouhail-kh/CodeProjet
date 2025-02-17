import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import AjouterProduitsModel from './AjouterProduitsModel';

const MyNavbar = ({ darkMode }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Navbar expand="lg" bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} className="shadow">
        <Container>
          <Navbar.Brand href="#">🚀 Mon Site</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className='btn' onClick={handleShow}>Crées</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AjouterProduitsModel show={showModal} handleClose={handleClose} />
    </>
  );
};

export default MyNavbar;

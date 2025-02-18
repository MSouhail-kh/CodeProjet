import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import AjouterProduitsModel from '../Produits/AjouterProduitsModel';
import './Navbar.css';

const MyNavbar = ({ darkMode }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Navbar 
        expand="lg" 
        variant="dark" 
        className="custom-navbar shadow" 
      >
        <Container>
          <Navbar.Brand href="/">🚀 Production</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto"> 
            <Nav.Link 
                className="btn gradient-btn" 
                onClick={handleShow}
              >
                Créer un produit
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AjouterProduitsModel show={showModal} handleClose={handleClose} />
    </>
  );
};

export default MyNavbar;
import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import AjouterProduitsModel from '../Produits/AjouterProduitsModel';
import ImporterProduitsModel from '../Produits/ImporterProduitsModel';
import './Navbar.css';

const MyNavbar = ({ darkMode }) => {
  const [showProduitModal, setShowProduitModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);

  const handleShowProduit = () => setShowProduitModal(true);
  const handleCloseProduit = () => setShowProduitModal(false);

  const handleShowExcel = () => setShowExcelModal(true);
  const handleCloseExcel = () => setShowExcelModal(false);

  return (
    <>
      <Navbar expand="lg" variant="dark" className="custom-navbar shadow">
        <Container>
          <Navbar.Brand href="/">🚀 Production</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link className="btn gradient-btn" onClick={handleShowProduit}>
                Créer un produit
              </Nav.Link>
              <Nav.Link className="btn gradient-btn ms-2" onClick={handleShowExcel}>
                Importer Excel
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AjouterProduitsModel show={showProduitModal} handleClose={handleCloseProduit} />
      <ImporterProduitsModel show={showExcelModal} handleClose={handleCloseExcel} />
    </>
  );
};

export default MyNavbar;

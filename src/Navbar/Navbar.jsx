import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, InputGroup } from 'react-bootstrap';
import { PlusCircle, FileEarmarkExcel, Search } from 'react-bootstrap-icons';
import AjouterProduitsModel from '../Produits/AjouterProduitsModel';
import ImporterProduitsModel from '../Produits/ImporterProduitsModel';
import UserProfile from '../Authentification/User/UserProfile';
import './Navbar.css';

 const MyNavbar = ({ darkMode }) => {
  const [showProduitModal, setShowProduitModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [file, setFile] = useState(null);
  
  const handleShowProduit = () => setShowProduitModal(true);
  const handleCloseProduit = () => setShowProduitModal(false);

  const handleShowExcel = () => setShowExcelModal(true);
  const handleCloseExcel = () => {
    setShowExcelModal(false);
    setFile(null); 
  };

  return (
    <>
      <Navbar expand="lg" variant="dark" className="custom-navbar shadow">
        <Container>
          <Navbar.Brand href="/Chaines" className="logo-text">Sigmatex</Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="d-flex flex-grow-1 justify-content-between align-items-center">
            <Form className="d-flex mx-4 my-2 my-lg-0 flex-grow-1 justify-content-center">
              <InputGroup className="search-group align-items-center">
                <InputGroup.Text className="search-icon p-0 border-0">
                  <Search className="mx-3" />
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Rechercher..."
                  className="search-input border-0 py-3"
                  aria-label="Search"
                />
              </InputGroup>
            </Form>

              <Nav className="align-items-center">
                <Nav.Link className="btn gradient-btn me-2" onClick={handleShowProduit}>
                  <PlusCircle className="icon-btn" /> 
                </Nav.Link>
                <Nav.Link className="btn gradient-btn" onClick={handleShowExcel}>
                  <FileEarmarkExcel className="icon-btn" /> 
                </Nav.Link>
                <Nav.Item className="ms-3">
                  <UserProfile />
                </Nav.Item>
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AjouterProduitsModel show={showProduitModal} handleClose={handleCloseProduit} />
      <ImporterProduitsModel
        show={showExcelModal}
        handleClose={handleCloseExcel}
        file={file}
        setFile={setFile} 
      />
    </>
  );
};

export default MyNavbar;
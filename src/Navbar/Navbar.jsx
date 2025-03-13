import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { PlusCircle, FileEarmarkPlus, Search, ArrowClockwise } from 'react-bootstrap-icons';
import AjouterProduitsModel from '../Produits/AjouterProduitsModel';
import ImporterProduitsModel from '../Produits/ImporterProduitsModel';
import UserProfile from '../Authentification/User/UserProfile';
import SearchResultsModal from '../Produits/SearchResultsModal';
import './Navbar.css';
import api from "../services/axios";

const MyNavbar = ({ darkMode, produits = [] }) => { 
  const [showProduitModal, setShowProduitModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [file, setFile] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [error, setError] = useState(null); 

  const handleShowProduit = () => setShowProduitModal(true);
  const handleCloseProduit = () => setShowProduitModal(false);

  const handleShowExcel = () => setShowExcelModal(true);
  const handleCloseExcel = () => {
    setShowExcelModal(false);
    setFile(null);
  };

  const handleShowSearchModal = () => setShowSearchModal(true);
  const handleCloseSearchModal = () => setShowSearchModal(false);

  const handleRefreshPage = async () => {
    try {
      await api.post("/trigger-update", { newPosition: produits.map(p => p.position_id) }, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Mise à jour déclenchée avec succès");
    } catch (syncError) {
      console.error("Erreur de synchronisation :", syncError);
      setError("Problème de synchronisation avec Google Sheets"); 
    }
  };

  return (
    <>
      <Navbar expand="lg" variant="dark" className="custom-navbar shadow">
        <Container>
          <Navbar.Brand href="/Chaines" className="logo-text">
            Sigmatex
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className={`d-flex flex-grow-1 ${window.innerWidth <= 768 ? 'justify-content-center' : 'justify-content-end'} align-items-center flex-row`}>
              <Nav className="align-items-center">
                <Nav.Link className='btn gradient-btn btn-lg me-2' onClick={handleShowSearchModal}>
                  <Search className="icon-btn" size={28}/>
                </Nav.Link>
                <Nav.Link className="btn gradient-btn btn-lg me-2" onClick={handleShowProduit}>
                  <PlusCircle className="icon-btn" size={28} />
                </Nav.Link>
                <Nav.Link className="btn gradient-btn btn-lg me-2" onClick={handleShowExcel}>
                  <FileEarmarkPlus className="icon-btn" size={28} />
                </Nav.Link>
                <Nav.Link className="btn gradient-btn btn-lg me-2" onClick={handleRefreshPage}>
                  <ArrowClockwise className="icon-btn" size={28} />
                </Nav.Link>
                <Nav.Item className="btn gradient-btn btn-lg me-2">
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

      <SearchResultsModal
        show={showSearchModal}
        handleClose={handleCloseSearchModal}
        results={searchResults}
        error={searchError}
      />
    </>
  );
};

export default MyNavbar;
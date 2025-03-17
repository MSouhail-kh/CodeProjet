import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, InputGroup } from 'react-bootstrap';
import { PlusCircle, Search, ArrowClockwise } from 'react-bootstrap-icons';
import ClipLoader from 'react-spinners/ClipLoader';
import AjouterProduitsModel from '../Produits/AjouterProduitsModel';
import UserProfile from '../Authentification/User/UserProfile';
import SearchResultsModal from '../Produits/SearchResultsModal';
import './Navbar.css';
import api from "../services/axios";

const MyNavbar = ({ darkMode, produits = [], onRefresh }) => { 
  const [showProduitModal, setShowProduitModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [file, setFile] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");

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
      setIsLoading(true);
      const response = await api.get("/process");
      const produits = Object.values(response.data);
      console.log("Produits récupérés avec succès :", produits);
      onRefresh(produits);
      setIsLoading(false);
    } catch (syncError) {
      console.error("Erreur de synchronisation :", syncError);
      setError("Problème de synchronisation avec Google Sheets");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar expand="lg" variant="dark" className="custom-navbar">
        <Container fluid className="px-4">
          <Navbar.Brand href="/Chaines" className="logo-text me-4">
            <span className="gradient-text">Sigmatex</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
          
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <div className="d-flex justify-content-center flex-grow-1 mx-4">
              <Form className="w-75">
                <InputGroup className="search-group">
                  <Form.Control
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="search-input rounded-pill px-4"
                  />
                  <InputGroup.Text className="search-icon-container rounded-pill">
                    <Search className="icon-btn" size={20} />
                  </InputGroup.Text>
                </InputGroup>
              </Form>
            </div>

            <Nav className="align-items-center gap-3">
              <Nav.Link 
                className="nav-icon" 
                onClick={handleShowSearchModal}
                title="Recherche avancée"
              >
                <div className="icon-wrapper">
                  <Search className="icon-btn" size={24} />
                </div>
              </Nav.Link>

              <Nav.Link 
                className="nav-icon" 
                onClick={handleShowProduit}
                title="Ajouter un produit"
              >
                <div className="icon-wrapper">
                  <PlusCircle className="icon-btn" size={24} />
                </div>
              </Nav.Link>

              <Nav.Link 
                className="nav-icon" 
                onClick={handleRefreshPage}
                title="Rafraîchir"
                disabled={isLoading}
              >
                <div className="icon-wrapper">
                  {isLoading ? (
                    <BounceLoader 
                      size={28} 
                      color="#fff" 
                      className="loader"
                    />
                  ) : (
                    <ArrowClockwise className="icon-btn" size={24} />
                  )}
                </div>
              </Nav.Link>

              <div className="vr mx-2" style={{ height: '2rem' }} />

              <Nav.Item className="nav-icon">
                <UserProfile />
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AjouterProduitsModel show={showProduitModal} handleClose={handleCloseProduit} />

      <SearchResultsModal
        show={showSearchModal}
        handleClose={handleCloseSearchModal}
        results={searchResults}
        error={searchError}
      />    </>
  );
};

export default MyNavbar;

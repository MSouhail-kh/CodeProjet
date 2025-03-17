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
      <Navbar expand="lg" variant="dark" className="custom-navbar shadow">
        <Container>
          <Navbar.Brand href="/Chaines" className="logo-text">
            Sigmatex
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Conteneur en flex avec répartition entre champ de saisie au centre et icônes à droite */}
            <div className="d-flex w-100 align-items-center justify-content-between">
              {/* Espace vide à gauche pour équilibrer (facultatif) */}
              <div className="d-none d-lg-block" style={{ width: "150px" }}></div>
              {/* Champ de saisie stylé au centre */}
              <Form className="d-flex mx-auto" style={{ width: "40%" }}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search className="icon-input" size={20} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Saisir un texte"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </InputGroup>
              </Form>
              {/* Icônes de navigation à droite */}
              <Nav className="align-items-center">
                <Nav.Link className="btn gradient-btn btn-lg me-2" onClick={handleShowSearchModal}>
                  <Search className="icon-btn" size={28} />
                </Nav.Link>
                <Nav.Link className="btn gradient-btn btn-lg me-2" onClick={handleShowProduit}>
                  <PlusCircle className="icon-btn" size={28} />
                </Nav.Link>
                <Nav.Link className="btn gradient-btn btn-lg me-2" onClick={handleRefreshPage}>
                  {isLoading ? (
                    <ClipLoader size={28} color="#ffffff" />
                  ) : (
                    <ArrowClockwise className="icon-btn" size={28} />
                  )}
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

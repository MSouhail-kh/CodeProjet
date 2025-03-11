import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, InputGroup, Button } from 'react-bootstrap';
import { PlusCircle, FileEarmarkPlus } from 'react-bootstrap-icons';
import AjouterProduitsModel from '../Produits/AjouterProduitsModel';
import ImporterProduitsModel from '../Produits/ImporterProduitsModel';
import UserProfile from '../Authentification/User/UserProfile';
import SearchResultsModal from './SearchResultsModal';
import './Navbar.css';

const MyNavbar = ({ darkMode }) => {
  // États pour les modals
  const [showProduitModal, setShowProduitModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [file, setFile] = useState(null);

  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Gestion des modals existants
  const handleShowProduit = () => setShowProduitModal(true);
  const handleCloseProduit = () => setShowProduitModal(false);

  const handleShowExcel = () => setShowExcelModal(true);
  const handleCloseExcel = () => {
    setShowExcelModal(false);
    setFile(null);
  };

  // Gestion de la recherche
  const parseSearchQuery = (query) => {
    const params = {};
    const pairs = query.split('&');

    pairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key && value) {
        const cleanKey = key.trim().toLowerCase();
        params[cleanKey] = value.trim();
      }
    });

    return params;
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchError('Veuillez entrer un critère de recherche.');
      setShowSearchModal(true);
      return;
    }

    try {
      const searchParams = parseSearchQuery(searchQuery);

      if (Object.keys(searchParams).length === 0) {
        setSearchError('Format de recherche invalide. Utilisez "clé=valeur".');
        setShowSearchModal(true);
        return;
      }

      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(`/produits/search?${queryString}`);

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        setSearchError('');
      } else {
        const errorData = await response.json();
        setSearchError(errorData.error || 'Erreur lors de la recherche.');
      }
    } catch (error) {
      setSearchError('Erreur de connexion au serveur.');
    }
    setShowSearchModal(true);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCloseSearchModal = () => {
    setShowSearchModal(false);
    setSearchResults([]);
    setSearchError('');
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
            <div className="d-flex flex-grow-1 justify-content-between align-items-center flex-row">
            <Form
                  className="d-flex mx-4 my-2 my-lg-0 flex-grow-1 justify-content-center form-inline-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  <InputGroup className="search-group align-items-center p-2">
                    <InputGroup.Text className="search-icon border-0 py-2 p-2 bg-transparent">
                      🔍
                    </InputGroup.Text>
                    <Form.Control
                      type="search"
                      placeholder="Rechercher (ex: style=1&brand=nike)"
                      className="search-input border-0 py-2 p-2"
                      aria-label="Search"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    <Button variant="outline-light" type="submit">
                      Rechercher
                    </Button>
                  </InputGroup>
                </Form>


              <Nav className="align-items-center">
                <Nav.Link className="btn gradient-btn btn-lg me-2" onClick={handleShowProduit}>
                  <PlusCircle className="icon-btn" size={20} />
                </Nav.Link>
                <Nav.Link className="btn gradient-btn btn-lg" onClick={handleShowExcel}>
                  <FileEarmarkPlus className="icon-btn" size={20} />
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
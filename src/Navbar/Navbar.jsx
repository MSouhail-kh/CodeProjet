import React, { useState } from "react";
import { Navbar, Nav, Container, Form, InputGroup, Button } from "react-bootstrap";
import { PlusCircle, Search, ArrowClockwise } from "react-bootstrap-icons";
import { BounceLoader } from "react-spinners";
import styled from "styled-components";
import AjouterProduitsModel from "../Produits/AjouterProduitsModel";
import UserProfile from "../Authentification/User/UserProfile";
import SearchResultsModal from "../Produits/SearchResultsModal";
import api from "../services/axios";

const StyledNavbar = styled(Navbar)`
  background: linear-gradient(135deg, #7c4dff, #448aff) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 0.8rem 0;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1.5rem;
`;

const SearchGroup = styled(InputGroup)`
  width: 35%; 
  margin: 0 auto;

  .form-control {
    border: 1px solid #ccc; /* Bordure standard */
    border-radius: 4px; /* Bordure légèrement arrondie */
    padding: 0.375rem 0.75rem; /* Padding par défaut */
    font-size: 1rem; /* Taille de police par défaut */
    transition: border-color 0.3s ease; /* Transition pour l'effet de focus */

    &:focus {
      border-color: #7c4dff; /* Changement de couleur au focus */
      outline: none; /* Supprimer l'outline par défaut */
    }
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const MyNavbar = ({ produits = [], onRefresh }) => {
  const [showProduitModal, setShowProduitModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleShowProduit = () => setShowProduitModal(true);
  const handleCloseProduit = () => setShowProduitModal(false);

  const handleShowSearchModal = () => setShowSearchModal(true);
  const handleCloseSearchModal = () => setShowSearchModal(false);

  const handleRefreshPage = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/process");
      onRefresh(Object.values(response.data));
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur de synchronisation :", error);
      setIsLoading(false);
    }
  };

  return (
    <StyledNavbar expand="lg" variant="dark">
      <Container fluid>
        <NavContainer>
          <Navbar.Brand href="/Chaines">Sigmatex</Navbar.Brand>

          <SearchGroup>
            <Form.Control
              type="text"
              placeholder="Rechercher un produit..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </SearchGroup>

          {/* Icons */}
          <IconsContainer>
            <IconButton onClick={handleShowSearchModal}>
              <Search size={20} />
            </IconButton>
            <IconButton onClick={handleShowProduit}>
              <PlusCircle size={20} />
            </IconButton>
            <IconButton onClick={handleRefreshPage} disabled={isLoading}>
              {isLoading ? <BounceLoader size={20} color="#fff" /> : <ArrowClockwise size={20} />}
            </IconButton>
          </IconsContainer>

          {/* User Profile */}
          <UserProfile />
        </NavContainer>
      </Container>

      {/* Modals */}
      <AjouterProduitsModel show={showProduitModal} handleClose={handleCloseProduit} />
      <SearchResultsModal show={showSearchModal} handleClose={handleCloseSearchModal} />
    </StyledNavbar>
  );
};


export default MyNavbar;
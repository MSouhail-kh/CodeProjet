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
  width: 400px; /* Largeur fixe pour l'input */
  margin: 0 auto; /* Centrer l'input dans l'espace disponible */

  .form-control {
    border-radius: 25px 0 0 25px;
    border: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .btn {
    border-radius: 0 25px 25px 0;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
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
          {/* Brand */}
          <Navbar.Brand href="/Chaines">Sigmatex</Navbar.Brand>

          {/* Search Input */}
          <SearchGroup>
            <Form.Control
              type="text"
              placeholder="Rechercher un produit..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button variant="outline-light" onClick={handleShowSearchModal}>
              <Search size={20} />
            </Button>
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
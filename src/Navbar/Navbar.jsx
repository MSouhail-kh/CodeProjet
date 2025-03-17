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
`;

const SearchGroup = styled(InputGroup)`
  max-width: 600px;
  flex-grow: 1;
  margin-right: 1.5rem;

  .form-control {
    border-radius: 25px;
    border: none;
    padding: 0.75rem 1.5rem;
    transition: all 0.3s ease;

    &:focus {
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }
  }

  .btn {
    border-radius: 25px;
    margin-left: -50px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const NavIconsGroup = styled(Nav)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
        <Navbar.Brand href="/Chaines" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Sigmatex
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavContainer>
            <SearchGroup>
              <Form.Control
                type="text"
                placeholder="Rechercher un produit..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button onClick={handleShowSearchModal}>
                <Search size={20} />
              </Button>
            </SearchGroup>

            <NavIconsGroup>
              <Nav.Link onClick={handleShowProduit}>
                <IconContainer>
                  <PlusCircle size={24} />
                </IconContainer>
              </Nav.Link>

              <Nav.Link onClick={handleRefreshPage} disabled={isLoading}>
                <IconContainer>
                  {isLoading ? <BounceLoader size={28} color="#fff" /> : <ArrowClockwise size={24} />}
                </IconContainer>
              </Nav.Link>

              <UserProfile />
            </NavIconsGroup>
          </NavContainer>
        </Navbar.Collapse>
      </Container>

      <AjouterProduitsModel show={showProduitModal} handleClose={handleCloseProduit} />
      <SearchResultsModal show={showSearchModal} handleClose={handleCloseSearchModal} />
    </StyledNavbar>
  );
};

export default MyNavbar;